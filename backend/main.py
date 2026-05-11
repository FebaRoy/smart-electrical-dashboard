from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

from database import engine, SessionLocal
from models import Base, Reading
from ai_engine import AIEngine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

ai = AIEngine()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data")
def get_data():
    voltage = round(random.uniform(210, 240), 1)
    current = round(random.uniform(4, 6), 2)
    power = round(voltage * current)

    ai_result = ai.analyze(voltage)
    
    prediction = ai_result["prediction"]
    anomaly = ai_result["anomaly"]
    risk = ai_result["risk"]

    # Status logic
    if voltage > 238:
        status = "CRITICAL"
    elif voltage > 235:
        status = "WARNING"
    else:
        status = "NORMAL"

    # Alert
    if voltage > 235:
        alert = "High Voltage ⚠️"
    elif voltage < 210:
        alert = "Low Voltage ⚠️"
    else:
        alert = "System Normal ✅"

    # ✅ SAVE TO DB (CORRECT PLACE)
    db = SessionLocal()

    reading = Reading(
        voltage=voltage,
        current=current,
        power=power,
        status=status,
        alert=alert,
        prediction=prediction,
        anomaly=anomaly
    )

    db.add(reading)
    db.commit()
    db.close()

    return {
        "voltage": voltage,
        "current": current,
        "power": power,
        "status": status,
        "alert": alert,
        "prediction": prediction,
        "anomaly": anomaly,
        "risk": risk
    }

@app.get("/history")
def get_history():
    db = SessionLocal()
    data = db.query(Reading).order_by(Reading.id.desc()).limit(20).all()
    db.close()

    return data[::-1]