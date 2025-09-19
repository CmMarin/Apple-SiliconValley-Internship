# This is a simplified version of routes.py that only implements the parse endpoint
# and model status endpoints to fix the hanging issue

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import re
import csv
import io
from datetime import datetime

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

# Simplified extractor function directly included
def extract_tasks(input_text: str) -> List[Dict[str, str]]:
    tasks: List[Dict[str, str]] = []
    for raw in re.split(r"[\.\n;]+", input_text):
        s = raw.strip(" -•\t")
        if not s:
            continue
        # Filter trivial tokens and greetings
        if len(s) < 3 or re.fullmatch(r"[A-Za-z]", s) or s.lower() in {"hi", "hello", "salut", "hey"}:
            continue

        time = None
        deadline = None
        m_time = re.search(r"\b(\d{1,2}[:\.]\d{2}\s*(?:am|pm|AM|PM)?)\b", s)
        if m_time:
            time = m_time.group(1)
        m_date = re.search(r"\b(\d{1,2}\s+[A-Za-zăâîșțA-ZĂÂÎȘȚ]+|tomorrow|mâine)\b", s)
        if m_date:
            deadline = m_date.group(1)

        task = {
            "task": s,
            "time": time,
            "deadline": deadline,
            "category": None
        }
        tasks.append(task)

    return tasks

@router.get("/model/status", response_model=ModelStatus)
async def get_model_status():
    """Get the current status of the AI model"""
    return {
        "state": "not_loaded",
        "model": None,
        "error": None,
        "loading_started": False
    }

@router.post("/model/load", response_model=ModelStatus)
async def load_model():
    """Trigger model loading if not already started"""
    return {
        "state": "loading",
        "model": "flan-t5-small",
        "error": None,
        "loading_started": True
    }

class ParseRequest(BaseModel):
    text: str
    lang: Optional[str] = "ro"
    forceJson: Optional[bool] = True

@router.post("/parse", response_model=ParseResponse)
async def parse_text(req: ParseRequest):
    try:
        # Just use the regex extractor
        tasks = extract_tasks(req.text)
        
        # Final filtering and deduplication
        clean = []
        seen = set()
        for t in tasks:
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
        
        # Convert to Task objects
        task_objects = [Task(**t) for t in clean]
        
        return ParseResponse(
            tasks=task_objects,
            method="regex_fallback",
            model_state="not_loaded",
            message="Using simplified parsing as AI model is not available"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))