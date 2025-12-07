from sqlalchemy.orm import Session, joinedload
from app.models import Workspace, WorkspaceMember, WorkspaceRole
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate
from typing import List, Optional

def get_workspace(db: Session, workspace_id: str) -> Optional[Workspace]:
    """Get workspace with all related data"""
    return db.query(Workspace).options(
        joinedload(Workspace.owner),
        joinedload(Workspace.members).joinedload(WorkspaceMember.user),
        joinedload(Workspace.charts)
    ).filter(Workspace.id == workspace_id).first()

def get_workspaces_by_user(db: Session, user_id: str) -> List[Workspace]:
    """Get all workspaces where user is owner or member"""
    return db.query(Workspace).options(
        joinedload(Workspace.owner)
    ).filter(
        (Workspace.owner_id == user_id) |
        (Workspace.members.any(WorkspaceMember.user_id == user_id))
    ).all()

def create_workspace(db: Session, workspace: WorkspaceCreate, owner_id: str) -> Workspace:
    """Create a new workspace and add owner as member"""
    db_workspace = Workspace(
        name=workspace.name,
        description=workspace.description,
        owner_id=owner_id
    )
    db.add(db_workspace)
    db.flush()  # Get the workspace ID
    
    # Add owner as member with OWNER role
    db_member = WorkspaceMember(
        workspace_id=db_workspace.id,
        user_id=owner_id,
        role=WorkspaceRole.OWNER
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_workspace)
    
    return get_workspace(db, db_workspace.id)

def update_workspace(
    db: Session, workspace_id: str, workspace_update: WorkspaceUpdate
) -> Optional[Workspace]:
    """Update workspace details"""
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not db_workspace:
        return None
    
    update_data = workspace_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_workspace, field, value)
    
    db.commit()
    db.refresh(db_workspace)
    return get_workspace(db, workspace_id)

def delete_workspace(db: Session, workspace_id: str) -> bool:
    """Delete a workspace"""
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not db_workspace:
        return False
    
    db.delete(db_workspace)
    db.commit()
    return True