from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.workspace import Workspace, WorkspaceList, WorkspaceCreate, WorkspaceUpdate
from app.crud import workspace as crud

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])

@router.get("/", response_model=List[WorkspaceList])
def list_workspaces(user_id: str = "user-1", db: Session = Depends(get_db)):
    """Get all workspaces for a user"""
    workspaces = crud.get_workspaces_by_user(db, user_id)
    return workspaces

@router.get("/{workspace_id}", response_model=Workspace)
def get_workspace(workspace_id: str, db: Session = Depends(get_db)):
    """Get a specific workspace with all details"""
    workspace = crud.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.post("/", response_model=Workspace, status_code=201)
def create_workspace(
    workspace: WorkspaceCreate,
    user_id: str = "user-1",
    db: Session = Depends(get_db)
):
    """Create a new workspace"""
    return crud.create_workspace(db, workspace, user_id)

@router.put("/{workspace_id}", response_model=Workspace)
def update_workspace(
    workspace_id: str,
    workspace_update: WorkspaceUpdate,
    db: Session = Depends(get_db)
):
    """Update workspace details"""
    workspace = crud.update_workspace(db, workspace_id, workspace_update)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@router.delete("/{workspace_id}", status_code=204)
def delete_workspace(workspace_id: str, db: Session = Depends(get_db)):
    """Delete a workspace"""
    if not crud.delete_workspace(db, workspace_id):
        raise HTTPException(status_code=404, detail="Workspace not found")
    return None