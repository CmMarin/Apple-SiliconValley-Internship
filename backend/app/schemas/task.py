from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Task(BaseModel):
    task: str
    time: Optional[datetime] = None
    category: Optional[str] = None
    deadline: Optional[datetime] = None

class TaskList(BaseModel):
    tasks: List[Task]