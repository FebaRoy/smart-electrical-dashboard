from sqlalchemy import Column, Integer, Float, String
from database import Base

class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    voltage = Column(Float)
    current = Column(Float)
    power = Column(Float)
    status = Column(String)
    alert = Column(String)
    prediction = Column(String)
    anomaly = Column(String)