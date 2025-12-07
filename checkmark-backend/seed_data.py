# seed_data.py
from app.database import SessionLocal, engine, Base
from app.models import User, Workspace, WorkspaceMember, WorkspaceRole

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.id == "user-1").first()
        if existing_user:
            print("Seed data already exists!")
            return
        
        # Create user
        user = User(
            id="user-1",
            name="John Doe",
            email="john@example.com",
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        )
        db.add(user)
        db.flush()
        
        # Create workspaces
        workspaces_data = [
            {
                "id": "ws-1",
                "name": "Sales Analytics Q4",
                "description": "Real-time sales data visualization and team collaboration"
            },
            {
                "id": "ws-2",
                "name": "Marketing Dashboard",
                "description": "Campaign performance metrics with 3D charts"
            },
            {
                "id": "ws-3",
                "name": "Engineering Metrics",
                "description": "Code quality and deployment visualization"
            }
        ]
        
        for ws_data in workspaces_data:
            workspace = Workspace(
                id=ws_data["id"],
                name=ws_data["name"],
                description=ws_data["description"],
                owner_id=user.id
            )
            db.add(workspace)
            db.flush()
            
            # Add owner as member
            member = WorkspaceMember(
                workspace_id=workspace.id,
                user_id=user.id,
                role=WorkspaceRole.OWNER
            )
            db.add(member)
        
        db.commit()
        print("✅ Seed data created successfully!")
        print(f"   - Created user: {user.email}")
        print(f"   - Created {len(workspaces_data)} workspaces")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()