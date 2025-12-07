from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base

class ChartType(str, enum.Enum):
    SCATTER_3D = "3d_scatter"
    BAR_3D = "3d_bar"
    SURFACE_3D = "3d_surface"
    LINE = "line"
    BAR = "bar"

class Chart(Base):
    __tablename__ = "charts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False)
    type = Column(Enum(ChartType), nullable=False)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    config = Column(JSON)  # ECharts configuration
    data = Column(JSON)    # Chart data
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workspace = relationship("Workspace", back_populates="charts")
    creator = relationship("User", back_populates="created_charts")