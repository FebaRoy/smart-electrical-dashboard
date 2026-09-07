from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import random
import asyncio
import csv

from database import engine, SessionLocal
from models import Base, Reading
from ai_engine import AIEngine

from datetime import datetime

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

#Generate Data Function
def generate_data():
    voltage = round(random.uniform(210, 240), 1)
    current = round(random.uniform(4, 6), 2)
    power = round(voltage * current)
    
    ai_result = ai.analyze(voltage)
    
    prediction = ai_result["prediction"]
    anomaly = ai_result["anomaly"]  
    risk = ai_result["risk"]
    
    devices = [
        {
            "name": "Main Transformer",
            "status": "Online",
            "health": "good"
        },
        {
            "name": "Backup Generator",
            "status": "High Temperature" if voltage > 235 else "Stable",
            "health": "warning" if voltage > 235 else "good"
        },
        {
            "name": "Battery Bank",
            "status": "Offline" if voltage < 215 else "Online",
            "health": "danger" if voltage < 215 else "good"
        }
    ]
    
    #Status Logic
    if voltage > 238:
        status = "CRITICAL"
    elif voltage > 235:
        status = "WARNING"  
    else:
        status = "NORMAL"
    
    #Alerts
    if voltage > 235:
        alert = "High Voltage ⚠️"
    elif voltage < 210:
        alert = "Low Voltage ⚠️"
    else:
        alert = "System Normal ✅"
    
    #Save to DB
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
        "risk": risk,
        "devices": devices
    }

#Websocket Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = generate_data()
        await websocket.send_json(data)
        await asyncio.sleep(1)      

#History API
@app.get("/history")
def get_history():
    db = SessionLocal()
    
    data = db.query(Reading)\
        .order_by(Reading.id.desc())\
            .limit(20)\
                .all()
    db.close()

    return data[::-1]

@app.get("/export")
def export_data():
    db = SessionLocal()
    data = db.query(Reading).all()
    
    filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    with open(filename, mode = "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Voltage", "Current", "Power", "Status", "Alert", "Prediction", "Anomaly"])
        for row in data:
            writer.writerow([
                row.voltage,
                row.current,
                row.power,
                row.status,
                row.alert,
                row.prediction,
                row.anomaly
            ])
            
    db.close()

    return FileResponse(path=filename, filename=filename, media_type="text/csv")