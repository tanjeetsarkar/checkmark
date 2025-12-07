# app/api/charts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.chart import Chart, ChartCreate, ChartUpdate
from app.crud import chart as crud

router = APIRouter(prefix="/api", tags=["charts"])

@router.get("/workspaces/{workspace_id}/charts", response_model=List[Chart])
def list_charts(workspace_id: str, db: Session = Depends(get_db)):
    """Get all charts in a workspace"""
    return crud.get_charts_by_workspace(db, workspace_id)

@router.post("/workspaces/{workspace_id}/charts", response_model=Chart, status_code=201)
def create_chart(
    workspace_id: str,
    chart: ChartCreate,
    user_id: str = "user-1",
    db: Session = Depends(get_db)
):
    """Create a new chart"""
    # Ensure workspace_id matches
    chart.workspace_id = workspace_id
    return crud.create_chart(db, chart, user_id)

@router.get("/charts/{chart_id}", response_model=Chart)
def get_chart(chart_id: str, db: Session = Depends(get_db)):
    """Get a specific chart"""
    chart = crud.get_chart(db, chart_id)
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")
    return chart

@router.put("/charts/{chart_id}", response_model=Chart)
def update_chart(
    chart_id: str,
    chart_update: ChartUpdate,
    db: Session = Depends(get_db)
):
    """Update chart configuration"""
    chart = crud.update_chart(db, chart_id, chart_update)
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")
    return chart

@router.delete("/charts/{chart_id}", status_code=204)
def delete_chart(chart_id: str, db: Session = Depends(get_db)):
    """Delete a chart"""
    if not crud.delete_chart(db, chart_id):
        raise HTTPException(status_code=404, detail="Chart not found")
    return None