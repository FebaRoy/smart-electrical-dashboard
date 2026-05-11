from collections import deque
import statistics

class AIEngine:
    def __init__(self):
        self.history = deque(maxlen=20)

    def analyze(self, voltage):
        self.history.append(voltage)

        if len(self.history) < 5:
            return {
                "prediction": "Collecting Data",
                "anomaly": "Normal",
                "risk": "Low"
            }

        avg = statistics.mean(self.history)
        std_dev = statistics.stdev(self.history)

        deviation = abs(voltage - avg)

        # Spike detection
        if deviation > std_dev * 2:
            return {
                "prediction": "Voltage Spike Risk",
                "anomaly": "Anomaly 🚨",
                "risk": "High"
            }

        # Rising trend
        if voltage > avg + 5:
            return {
                "prediction": "System Load Increasing",
                "anomaly": "Normal",
                "risk": "Medium"
            }

        # Stable
        return {
            "prediction": "Stable",
            "anomaly": "Normal",
            "risk": "Low"
        }