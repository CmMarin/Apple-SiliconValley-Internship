from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import re
import csv
import io
from datetime import datetime
from app.nlp.extractor import extract_tasks
from app.nlp.ai_service import model_service
from app.google.calendar import list_events as gcal_list, create_event as gcal_create

router = APIRouter()

class Task(BaseModel):
    task: str
    time: Optional[str] = None
    category: Optional[str] = None
    deadline: Optional[str] = None

class ModelStatus(BaseModel):
    state: str
    model: Optional[str] = None
    error: Optional[str] = None
    loading_started: bool

class ParseResponse(BaseModel):
    tasks: List[Task]
    method: str
    model_state: str
    message: Optional[str] = None
    error: Optional[str] = None

@router.post("/tasks/", response_model=List[Task])
async def create_tasks(tasks: List[Task]):
    # Here you would typically process the tasks and store them in the database
    return tasks

@router.get("/tasks/", response_model=List[Task])
async def get_tasks():
    # Here you would typically retrieve tasks from the database
    return []  # Return an empty list for now as a placeholder

@router.delete("/tasks/{task_id}", response_model=dict)
async def delete_task(task_id: int):
    # Here you would typically delete a task from the database
    return {"message": "Task deleted successfully"}

@router.get("/model/status", response_model=ModelStatus)
async def get_model_status():
    """Get the current status of the AI model"""
    return model_service.get_status()

@router.post("/model/load", response_model=ModelStatus)
async def load_model():
    """Trigger model loading if not already started"""
    model_service.start_loading()
    return model_service.get_status()

class ParseRequest(BaseModel):
    text: str
    lang: Optional[str] = "ro"
    forceJson: Optional[bool] = True

@router.post("/parse", response_model=ParseResponse)
async def parse_text(req: ParseRequest):
    try:
        # Process the text with our AI service (handles fallbacks automatically)
        result = model_service.process_text(
            req.text, 
            options={
                "lang": req.lang,
                "forceJson": req.forceJson
            }
        )
        
        # Final filtering and deduplication
        clean = []
        seen = set()
        for t in result["tasks"]:
            task_text = (t.get("task") or "").strip()
            if not task_text or len(task_text) < 3:
                continue
            if task_text.lower() in {"hi", "hello", "salut", "hey"}:
                continue
            if task_text.lower() in seen:
                continue
            seen.add(task_text.lower())
            clean.append({
                "task": task_text,
                "time": t.get("time") or None,
                "category": t.get("category") or None,
                "deadline": t.get("deadline") or None,
            })
        
        # Update the tasks in the result
        result["tasks"] = [Task(**t) for t in clean]
        
        return ParseResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----------------- Calendar -----------------
class Event(BaseModel):
    id: Optional[str] = None
    summary: str
    start: str  # ISO string
    end: str    # ISO string
    timeZone: Optional[str] = None

class EventCreate(BaseModel):
    summary: str
    start: str
    end: str
    timeZone: Optional[str] = None

@router.get("/calendar/events", response_model=List[Event])
async def calendar_events():
    try:
        items = gcal_list()
        events: List[Event] = []
        for it in items:
            start = it.get('start', {}).get('dateTime') or it.get('start', {}).get('date')
            end = it.get('end', {}).get('dateTime') or it.get('end', {}).get('date')
            tz = it.get('start', {}).get('timeZone')
            events.append(Event(id=it.get('id'), summary=it.get('summary') or '(no title)', start=start, end=end, timeZone=tz))
        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Calendar error: {e}")

@router.post("/calendar/events", response_model=Event)
async def calendar_create(ev: EventCreate):
    try:
        payload: Dict[str, Any] = {
            'task': ev.summary,
            'time': ev.start,
            'end_time': ev.end,
        }
        created = gcal_create(payload)
        start = created.get('start', {}).get('dateTime') or created.get('start', {}).get('date')
        end = created.get('end', {}).get('dateTime') or created.get('end', {}).get('date')
        tz = created.get('start', {}).get('timeZone')
        return Event(id=created.get('id'), summary=created.get('summary') or ev.summary, start=start, end=end, timeZone=tz)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Calendar create error: {e}")


# ----------------- Finance Analyze -----------------
class FinanceRequest(BaseModel):
    csvText: str

class FinanceSummary(BaseModel):
    total: float
    byCategory: Dict[str, float]
    transactions: int

def _cat_for_desc(desc: str) -> str:
    d = desc.lower()
    if any(k in d for k in ["uber", "fuel", "gas", "petrol", "omv"]):
        return "Transport"
    if any(k in d for k in ["kaufland", "carrefour", "mega", "lidl", "food", "restaurant"]):
        return "Groceries/Food"
    if any(k in d for k in ["rent", "util", "electric", "water", "internet", "netflix"]):
        return "Utilities/Home"
    if any(k in d for k in ["pharma", "doctor", "clinic"]):
        return "Health"
    return "Other"

@router.post("/finance/analyze", response_model=FinanceSummary)
async def finance_analyze(req: FinanceRequest):
    try:
        f = io.StringIO(req.csvText)
        reader = csv.DictReader(f)
        total = 0.0
        by_cat: Dict[str, float] = {}
        count = 0
        for row in reader:
            try:
                amt = float(row.get('amount') or row.get('Amount') or 0)
            except ValueError:
                # Try to normalize comma decimals
                amt = float((row.get('amount') or '0').replace(',', '.'))
            desc = row.get('description') or row.get('Description') or ''
            cat = _cat_for_desc(desc)
            total += amt
            by_cat[cat] = by_cat.get(cat, 0.0) + amt
            count += 1
        return FinanceSummary(total=round(total, 2), byCategory={k: round(v, 2) for k, v in by_cat.items()}, transactions=count)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Finance analyze error: {e}")


# ----------------- Document Scanner -----------------
class DocumentExtractRequest(BaseModel):
    text: str

class Entity(BaseModel):
    type: str
    value: str

class DocumentExtractResponse(BaseModel):
    entities: List[Entity]
    tasks: List[Task]

@router.post("/documents/extract", response_model=DocumentExtractResponse)
async def documents_extract(req: DocumentExtractRequest):
    try:
        text = req.text
        entities: List[Entity] = []
        # Amounts like 1,234.56 or 1234,56
        for m in re.finditer(r"\b\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})\b|\b\d+[.,]\d{2}\b", text):
            entities.append(Entity(type="amount", value=m.group(0)))
        # Dates ISO-ish or dd Month
        for m in re.finditer(r"\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{1,2}\s+[A-Za-zăâîșțA-ZĂÂÎȘȚ]+\b", text):
            entities.append(Entity(type="date", value=m.group(0)))
        # IBAN RO...
        for m in re.finditer(r"\bRO\w{2}\s?\w{4}(?:\s?\w{4}){3,}\b", text):
            entities.append(Entity(type="iban", value=m.group(0)))
        # Derive tasks using lightweight extractor
        task_dicts = extract_tasks(text)
        return DocumentExtractResponse(entities=entities, tasks=[Task(**t) for t in task_dicts])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Document extract error: {e}")


# ----------------- Email Organizer -----------------
class Email(BaseModel):
    subject: str
    body: str

class EmailOrganizeRequest(BaseModel):
    emails: List[Email]

class EmailOrganizeResult(BaseModel):
    subject: str
    categories: List[str]
    tasks: List[Task]

def _email_categories(subject: str, body: str) -> List[str]:
    s = (subject + " " + body).lower()
    cats = []
    if any(k in s for k in ["invoice", "payment", "due", "factura", "plata"]):
        cats.append("Billing")
    if any(k in s for k in ["meeting", "calendar", "invite", "întâlnire"]):
        cats.append("Meetings")
    if any(k in s for k in ["offer", "promo", "sale"]):
        cats.append("Promotions")
    if any(k in s for k in ["job", "cv", "application"]):
        cats.append("Careers")
    return cats or ["General"]

@router.post("/emails/organize", response_model=List[EmailOrganizeResult])
async def emails_organize(req: EmailOrganizeRequest):
    try:
        out: List[EmailOrganizeResult] = []
        for em in req.emails:
            cats = _email_categories(em.subject, em.body)
            # Extract tasks from combined text using regex fallback (fast); transformer could be used too
            tdicts = extract_tasks(f"{em.subject}. {em.body}")
            out.append(EmailOrganizeResult(
                subject=em.subject,
                categories=cats,
                tasks=[Task(**t) for t in tdicts]
            ))
        return out
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Email organize error: {e}")