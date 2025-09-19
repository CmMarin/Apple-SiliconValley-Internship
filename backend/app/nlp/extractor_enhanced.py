from typing import List, Dict
import re
from datetime import datetime, timedelta

# Improved regular expressions for task extraction
SPLIT_RE = re.compile(r"[\.\n;•]+")

# Time patterns (more comprehensive)
TIME_RE = re.compile(r"\b(\d{1,2}[:\.]\d{2}\s*(?:am|pm|AM|PM)?|\d{1,2}\s*(?:am|pm|AM|PM))\b")
# Time with "at" or "la" prefix
TIME_PREFIX_RE = re.compile(r"(?:at|la|@)\s*(\d{1,2}[:\.]\d{2}\s*(?:am|pm|AM|PM)?|\d{1,2}\s*(?:am|pm|AM|PM))")

# Date patterns (more comprehensive)
DATE_RE = re.compile(r"\b(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ian|feb|mar|apr|mai|iun|iul|aug|sep|oct|nov|dec)(?:uary|ruary|ch|il|e|y|ust|tember|ober|ember)?(?:\s+\d{2,4})?)\b", re.IGNORECASE)
# Date with deadline prefixes
DEADLINE_PREFIX_RE = re.compile(r"(?:by|până la|before|until|due|deadline)\s+(\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{2,4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ian|feb|mar|apr|mai|iun|iul|aug|sep|oct|nov|dec)(?:uary|ruary|ch|il|e|y|ust|tember|ober|ember)?(?:\s+\d{2,4})?|tomorrow|mâine|today|astăzi|next\s+(?:week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday|săptămână|luni|marți|miercuri|joi|vineri|sâmbătă|duminică))", re.IGNORECASE)
# Relative dates
RELATIVE_DATE_RE = re.compile(r"\b(tomorrow|mâine|maine|today|astăzi|azi|next\s+(?:week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday|săptămână|luni|marți|miercuri|joi|vineri|sâmbătă|duminică))\b", re.IGNORECASE)
# Romanian days of the week
ROMANIAN_DAYS_RE = re.compile(r"\b(luni|marți|miercuri|joi|vineri|sâmbătă|duminică)\b", re.IGNORECASE)
# English days of the week
ENGLISH_DAYS_RE = re.compile(r"\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b", re.IGNORECASE)

# Task intention markers in Romanian
ROMANIAN_TASK_MARKERS = [
    "trebuie", "să", "ar trebui", "vreau să", "voi", "o să", "va trebui", 
    "trebuie să", "am nevoie", "am de", "o să", "trebuie de", "va fi", "să fac",
    "programare", "programat", "duc", "mă duc", "merg"
]

# Common greeting patterns
GREETING_RE = re.compile(
    r"^(hello|hi|hey|good morning|good afternoon|good evening|greetings|salut|buna|salutare|bună ziua|bună dimineața|bună seara|ce faci|ce mai faci|how are you|how are you doing|how's it going|what's up|hey there|hi there)[\s\.,!\?]*$", 
    re.IGNORECASE
)

# More sophisticated greeting pattern that can detect mixed greetings with some extra content
GREETING_WITH_EXTRAS_RE = re.compile(
    r"^(hello|hi|hey|good morning|good afternoon|good evening|greetings|salut|buna|salutare|bună ziua|bună dimineața|bună seara|ce faci|ce mai faci|how are you|how are you doing|how's it going|what's up|hey there|hi there)[\s\.,!\?]*(how are you|how are you doing|how's it going|what's up|ce mai faci|ce faci|cum e|cum ești|cum te simți)?[\s\.,!\?]*$",
    re.IGNORECASE
)

def is_greeting(text: str) -> bool:
    """
    Check if the input text is just a greeting with no task content.
    Returns True for pure greetings, False for text that contains tasks.
    """
    text = text.strip()
    
    # Quick check for very short texts
    if len(text) < 2:
        return False
        
    # Check if it's a simple greeting
    if GREETING_RE.match(text):
        return True
        
    # Check if it's a greeting with some extras
    if GREETING_WITH_EXTRAS_RE.match(text):
        return True
        
    # Check for longer greetings with some extras but no task content
    if len(text.split()) <= 10:  # Limit to short phrases
        text_lower = text.lower()
        
        # Check if it contains greeting words but no task-related words or dates
        has_greeting_words = any(word in text_lower for word in [
            "hello", "hi", "hey", "morning", "afternoon", "evening", "greetings",
            "salut", "buna", "bună", "salutare", "ziua", "dimineața", "seara"
        ])
        
        # Check if it does NOT contain task indicators
        has_no_task_indicators = not any(word in text_lower for word in [
            "need", "must", "should", "have to", "want", "will", 
            "trebuie", "vreau", "voi", "am de", "să", "maine", "mâine", 
            "today", "tomorrow", "azi", "astăzi"
        ])
        
        # Check for dates and times
        has_no_dates = not (RELATIVE_DATE_RE.search(text_lower) or 
                           DATE_RE.search(text_lower) or 
                           TIME_RE.search(text_lower) or
                           ROMANIAN_DAYS_RE.search(text_lower) or
                           ENGLISH_DAYS_RE.search(text_lower))
        
        # If it has greeting words but no task indicators and no dates, it's likely just a greeting
        if has_greeting_words and has_no_task_indicators and has_no_dates:
            return True
    
    return False

def normalize_date(date_str: str) -> str:
    """
    Convert relative date references to actual dates in YYYY-MM-DD format.
    """
    if not date_str:
        return date_str
        
    date_str = date_str.lower().strip()
    today = datetime.now()
    
    # Handle simple cases
    if date_str in ["tomorrow", "maine", "mâine"]:
        tomorrow = today + timedelta(days=1)
        return tomorrow.strftime("%Y-%m-%d")
    elif date_str in ["today", "azi", "astăzi"]:
        return today.strftime("%Y-%m-%d")
        
    # Handle "next" + time unit
    if "next " in date_str:
        parts = date_str.split("next ", 1)
        time_unit = parts[1].strip() if len(parts) > 1 else ""
        
        if time_unit == "week":
            # Next week = 7 days from now
            next_date = today + timedelta(days=7)
            return next_date.strftime("%Y-%m-%d")
        elif time_unit == "month":
            # Next month = same day next month
            month = today.month + 1
            year = today.year
            if month > 12:
                month = 1
                year += 1
            try:
                next_date = today.replace(year=year, month=month)
            except ValueError:
                # Handle edge cases like Jan 31 -> Feb 28
                next_date = today.replace(year=year, month=month, day=1) - timedelta(days=1)
            return next_date.strftime("%Y-%m-%d")
        elif time_unit in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]:
            # Calculate days until next occurrence of the day
            day_mapping = {
                "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
                "friday": 4, "saturday": 5, "sunday": 6
            }
            target_weekday = day_mapping.get(time_unit)
            if target_weekday is not None:
                days_ahead = (target_weekday - today.weekday()) % 7
                if days_ahead == 0:
                    days_ahead = 7  # If today is the target day, get next week
                next_date = today + timedelta(days=days_ahead)
                return next_date.strftime("%Y-%m-%d")
        elif time_unit in ["săptămână", "saptamana"]:
            # Next week in Romanian
            next_date = today + timedelta(days=7)
            return next_date.strftime("%Y-%m-%d")
        elif time_unit in ["luni", "marți", "marti", "miercuri", "joi", "vineri", "sâmbătă", "sambata", "duminică", "duminica"]:
            # Romanian day names
            day_mapping = {
                "luni": 0, "marți": 1, "marti": 1, "miercuri": 2, "joi": 3,
                "vineri": 4, "sâmbătă": 5, "sambata": 5, "duminică": 6, "duminica": 6
            }
            target_weekday = day_mapping.get(time_unit)
            if target_weekday is not None:
                days_ahead = (target_weekday - today.weekday()) % 7
                if days_ahead == 0:
                    days_ahead = 7  # If today is the target day, get next week
                next_date = today + timedelta(days=days_ahead)
                return next_date.strftime("%Y-%m-%d")
    
    # Handle standalone day names (this week or next if today is past that day)
    day_mapping = {
        # English
        "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
        "friday": 4, "saturday": 5, "sunday": 6,
        # Romanian
        "luni": 0, "marți": 1, "marti": 1, "miercuri": 2, "joi": 3,
        "vineri": 4, "sâmbătă": 5, "sambata": 5, "duminică": 6, "duminica": 6
    }
    
    if date_str in day_mapping:
        target_weekday = day_mapping[date_str]
        days_ahead = (target_weekday - today.weekday()) % 7
        if days_ahead == 0:
            # If today is the target day and it's mentioned without context,
            # assume it means today rather than next week
            days_ahead = 0  
        # If today is after the mentioned day, get next week
        if days_ahead == 0 and "next" not in date_str:
            days_ahead = 7
        next_date = today + timedelta(days=days_ahead)
        return next_date.strftime("%Y-%m-%d")
    
    # If we can't normalize, return the original string
    return date_str

def extract_tasks(input_text: str) -> List[Dict[str, str]]:
    """
    Enhanced task extraction with improved time, date, and deadline detection
    for both English and Romanian text.
    """
    # Quick check for greetings
    if is_greeting(input_text):
        return []  # Return empty list for pure greetings
    
    tasks: List[Dict[str, str]] = []
    
    # Special handling for common Romanian task expressions
    text_lower = input_text.lower()
    has_romanian_markers = any(marker in text_lower for marker in ROMANIAN_TASK_MARKERS)
    has_romanian_date = "maine" in text_lower or "mâine" in text_lower or "azi" in text_lower or "astăzi" in text_lower or ROMANIAN_DAYS_RE.search(text_lower)
    
    # Split by delimiters and filter empty lines
    raw_parts = SPLIT_RE.split(input_text)
    
    # If we suspect this is a simple Romanian task, don't split too aggressively
    if len(raw_parts) == 1 and (has_romanian_markers or has_romanian_date):
        s = input_text.strip(" -•\t*")
        
        time = None
        deadline = None
        
        # Extract time
        time_prefix_match = TIME_PREFIX_RE.search(s)
        if time_prefix_match:
            time = time_prefix_match.group(1)
        else:
            time_match = TIME_RE.search(s)
            if time_match:
                time = time_match.group(1)
        
        # Extract deadline
        if "maine" in s.lower() or "mâine" in s.lower():
            deadline = "maine" if "maine" in s.lower() else "mâine"
            # Normalize the deadline to an actual date
            deadline = normalize_date(deadline)
        elif "azi" in s.lower() or "astăzi" in s.lower():
            deadline = "azi" if "azi" in s.lower() else "astăzi"
            # Normalize the deadline to an actual date
            deadline = normalize_date(deadline)
        else:
            # Check for Romanian days of the week
            day_match = ROMANIAN_DAYS_RE.search(s)
            if day_match:
                deadline = day_match.group(1)
                # Normalize the deadline to an actual date
                deadline = normalize_date(deadline)
            else:
                # Try other date patterns
                deadline_match = DEADLINE_PREFIX_RE.search(s) or DATE_RE.search(s) or RELATIVE_DATE_RE.search(s)
                if deadline_match:
                    deadline = deadline_match.group(1)
                    # Normalize the deadline to an actual date
                    deadline = normalize_date(deadline)
        
        # For Romanian, extract a reasonable task description
        if has_romanian_markers:
            category = "Shopping" if "magazin" in s.lower() else categorize_task(s)
            tasks.append({
                "task": s,
                "time": time,
                "deadline": deadline,
                "category": category
            })
            return tasks
    
    # Standard processing for other inputs
    for raw in raw_parts:
        s = raw.strip(" -•\t*")
        if not s:
            continue
            
        # Filter trivial tokens and common greetings/phrases
        if len(s) < 3 or re.fullmatch(r"[A-Za-z]", s) or s.lower() in {
            "hi", "hello", "salut", "hey", "thanks", "thank you", "mulțumesc", 
            "ok", "okay", "sure", "yes", "no", "da", "nu"
        }:
            continue

        time = None
        deadline = None
        
        # Extract time with priority to time with prefixes
        time_prefix_match = TIME_PREFIX_RE.search(s)
        if time_prefix_match:
            time = time_prefix_match.group(1)
            # Remove the matched part from task text
            s = s.replace(time_prefix_match.group(0), " ")
        else:
            time_match = TIME_RE.search(s)
            if time_match:
                time = time_match.group(1)
                # Keep time in task text as it might be part of the task description
        
        # Extract deadline with priority to deadlines with prefixes
        deadline_prefix_match = DEADLINE_PREFIX_RE.search(s)
        if deadline_prefix_match:
            deadline = deadline_prefix_match.group(1)
            # Normalize the deadline to an actual date
            deadline = normalize_date(deadline)
            # Remove the matched part from task text
            s = s.replace(deadline_prefix_match.group(0), " ")
        else:
            # Try matching a date without prefix
            date_match = DATE_RE.search(s)
            if date_match:
                deadline = date_match.group(1)
                # Normalize the deadline to an actual date
                deadline = normalize_date(deadline)
                # Keep date in task text as it might be part of the task description
            else:
                # Try relative dates
                relative_date_match = RELATIVE_DATE_RE.search(s)
                if relative_date_match:
                    deadline = relative_date_match.group(1)
                    # Normalize the deadline to an actual date
                    deadline = normalize_date(deadline)
                    # Keep date in task text as it might be part of the task description
        
        # Process the task text: normalize whitespace
        s = re.sub(r'\s+', ' ', s).strip()
        
        task = {
            "task": s,
            "time": time,
            "deadline": deadline,
            "category": categorize_task(s),
        }
        tasks.append(task)

    return tasks

def categorize_task(task: str) -> str:
    """
    Enhanced categorization logic based on keyword matching for both English and Romanian.
    """
    # Convert to lowercase for case-insensitive matching
    task_lower = task.lower()
    
    # Work/Office related keywords
    work_keywords = [
        # English
        "work", "meeting", "call", "project", "deadline", "presentation", "client", 
        "email", "report", "document", "office", "boss", "colleague", 
        # Romanian
        "muncă", "întâlnire", "apel", "proiect", "prezentare", "client", 
        "email", "raport", "document", "birou", "șef", "coleg"
    ]
    
    # Family/Home related keywords
    family_keywords = [
        # English
        "family", "kid", "child", "parent", "mom", "dad", "school", "homework",
        "house", "home", "clean", "cook", "dinner", "lunch", "breakfast",
        # Romanian
        "familie", "copil", "părinte", "mama", "tata", "școală", "temă", 
        "casă", "acasă", "curăț", "gătit", "cină", "prânz", "mic dejun"
    ]
    
    # Shopping/Errands keywords
    shopping_keywords = [
        # English
        "buy", "purchase", "shop", "store", "groceries", "market", "mall",
        "order", "deliver", "amazon", "online",
        # Romanian
        "cumpără", "achiziție", "magazin", "cumpărături", "piață", "mall",
        "comandă", "livrare", "online", "fructe", "legume"
    ]
    
    # Health/Medical keywords
    health_keywords = [
        # English
        "doctor", "appointment", "medicine", "prescription", "health", "medical",
        "workout", "exercise", "gym", "fitness", "dentist", "hospital",
        # Romanian
        "doctor", "medic", "programare", "medicament", "rețetă", "sănătate", 
        "antrenament", "exercițiu", "sală", "fitness", "dentist", "spital"
    ]
    
    # Finance/Bills keywords
    finance_keywords = [
        # English
        "pay", "bill", "invoice", "money", "bank", "account", "tax", "payment",
        "finance", "budget", "salary", "debt", "loan",
        # Romanian
        "plată", "factură", "bani", "bancă", "cont", "taxă", "impozit",
        "finanțe", "buget", "salariu", "datorie", "împrumut"
    ]
    
    # Travel/Transportation keywords
    travel_keywords = [
        # English
        "trip", "travel", "flight", "airport", "hotel", "vacation", "booking",
        "car", "drive", "bus", "train", "ticket", "reservation",
        # Romanian
        "călătorie", "zbor", "aeroport", "hotel", "vacanță", "rezervare",
        "mașină", "conducere", "autobuz", "tren", "bilet"
    ]
    
    # Social/Events keywords
    social_keywords = [
        # English
        "party", "event", "birthday", "celebration", "friend", "dinner", "lunch",
        "drink", "bar", "restaurant", "concert", "movie", "theater",
        # Romanian
        "petrecere", "eveniment", "ziua de naștere", "sărbătoare", "prieten",
        "cină", "prânz", "băutură", "bar", "restaurant", "concert", "film", "teatru"
    ]
    
    # Study/Education keywords
    study_keywords = [
        # English
        "study", "learn", "course", "class", "lecture", "exam", "test",
        "homework", "assignment", "book", "read", "research", "paper",
        # Romanian
        "studiu", "învăța", "curs", "clasă", "lecție", "examen", "test",
        "temă", "carte", "citit", "cercetare", "lucrare"
    ]
    
    # Check for each category
    for keyword in work_keywords:
        if keyword in task_lower:
            return "Work"
            
    for keyword in family_keywords:
        if keyword in task_lower:
            return "Family"
            
    for keyword in shopping_keywords:
        if keyword in task_lower:
            return "Shopping"
            
    for keyword in health_keywords:
        if keyword in task_lower:
            return "Health"
            
    for keyword in finance_keywords:
        if keyword in task_lower:
            return "Finance"
            
    for keyword in travel_keywords:
        if keyword in task_lower:
            return "Travel"
            
    for keyword in social_keywords:
        if keyword in task_lower:
            return "Social"
            
    for keyword in study_keywords:
        if keyword in task_lower:
            return "Study"
    
    # Check for specific categories based on task markers
    if "#work" in task_lower or "(work)" in task_lower:
        return "Work"
    elif "#home" in task_lower or "(home)" in task_lower:
        return "Family"
    elif "#shop" in task_lower or "(shop)" in task_lower:
        return "Shopping"
    elif "#health" in task_lower or "(health)" in task_lower:
        return "Health"
    elif "#finance" in task_lower or "(finance)" in task_lower:
        return "Finance"
    elif "#travel" in task_lower or "(travel)" in task_lower:
        return "Travel"
    elif "#social" in task_lower or "(social)" in task_lower:
        return "Social"
    elif "#study" in task_lower or "(study)" in task_lower:
        return "Study"
    
    # Default
    return "General"