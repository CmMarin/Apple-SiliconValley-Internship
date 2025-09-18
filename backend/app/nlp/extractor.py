from typing import List, Dict
import re

SPLIT_RE = re.compile(r"[\.\n;]+")
TIME_RE = re.compile(r"\b(\d{1,2}[:\.]\d{2}\s*(?:am|pm|AM|PM)?)\b")
DATE_RE = re.compile(r"\b(\d{1,2}\s+[A-Za-zăâîșțA-ZĂÂÎȘȚ]+|tomorrow|mâine)\b")


def extract_tasks(input_text: str) -> List[Dict[str, str]]:
    tasks: List[Dict[str, str]] = []
    for raw in SPLIT_RE.split(input_text):
        s = raw.strip(" -•\t")
        if not s:
            continue
        # Filter trivial tokens and greetings
        if len(s) < 3 or re.fullmatch(r"[A-Za-z]", s) or s.lower() in {"hi", "hello", "salut", "hey"}:
            continue

        time = None
        deadline = None
        m_time = TIME_RE.search(s)
        if m_time:
            time = m_time.group(1)
        m_date = DATE_RE.search(s)
        if m_date:
            deadline = m_date.group(1)

        task = {
            "task": s,
            "time": time,
            "deadline": deadline,
            "category": categorize_task(s),
        }
        tasks.append(task)

    return tasks

def categorize_task(task: str) -> str:
    # Simple categorization logic based on keywords
    if "școală" in task or "copii" in task:
        return "Family"
    elif "cumpăra" in task or "fructe" in task:
        return "Shopping"
    elif "factura" in task or "plăti" in task:
        return "Utilities"
    else:
        return "General"