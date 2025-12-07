from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any, Dict

class ChartBase(BaseModel):
    name: str
    type: str
    config: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None

class ChartCreate(ChartBase):
    workspace_id: str

class ChartUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None

class Chart(ChartBase):
    id: str
    workspace_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True