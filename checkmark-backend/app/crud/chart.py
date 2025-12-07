from sqlalchemy.orm import Session
from app.models import Chart
from app.schemas.chart import ChartCreate, ChartUpdate
from typing import List, Optional

def get_chart(db: Session, chart_id: str) -> Optional[Chart]:
    """Get a single chart by ID"""
    return db.query(Chart).filter(Chart.id == chart_id).first()

def get_charts_by_workspace(db: Session, workspace_id: str) -> List[Chart]:
    """Get all charts in a workspace"""
    return db.query(Chart).filter(Chart.workspace_id == workspace_id).all()

def create_chart(db: Session, chart: ChartCreate, created_by: str) -> Chart:
    """Create a new chart"""
    db_chart = Chart(
        name=chart.name,
        type=chart.type,
        workspace_id=chart.workspace_id,
        config=chart.config,
        data=chart.data,
        created_by=created_by
    )
    db.add(db_chart)
    db.commit()
    db.refresh(db_chart)
    return db_chart

def update_chart(
    db: Session, chart_id: str, chart_update: ChartUpdate
) -> Optional[Chart]:
    """Update chart configuration"""
    db_chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not db_chart:
        return None
    
    update_data = chart_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_chart, field, value)
    
    db.commit()
    db.refresh(db_chart)
    return db_chart

def delete_chart(db: Session, chart_id: str) -> bool:
    """Delete a chart"""
    db_chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not db_chart:
        return False
    
    db.delete(db_chart)
    db.commit()
    return True