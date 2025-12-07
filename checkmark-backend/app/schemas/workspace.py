from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.user import User

class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class WorkspaceMemberInfo(BaseModel):
    id: str
    user_id: str
    role: str
    joined_at: datetime
    user: User

    class Config:
        from_attributes = True

class Workspace(WorkspaceBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
    owner: User
    members: List[WorkspaceMemberInfo] = []

    class Config:
        from_attributes = True

class WorkspaceList(WorkspaceBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
    owner: User

    class Config:
        from_attributes = True