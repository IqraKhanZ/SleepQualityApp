from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# Load trained model
MODEL_PATH = "sleep_model.pkl"
model = joblib.load(MODEL_PATH)


# -------- Helper Functions --------
def time_to_minutes(t):
    """Convert time string 'HH:MM' or integer minutes directly."""
    if isinstance(t, int) or isinstance(t, float):
        return t
    try:
        h, m = map(int, t.split(":"))
        return h * 60 + m
    except:
        raise ValueError(f"Invalid time format: {t}")


def encode_inputs(data):
    """Convert user-friendly inputs into numeric encodings (same as training)."""
    # Gender
    if isinstance(data["Gender"], str):
        gender = 0 if data["Gender"].lower() in ["m", "male"] else 1
    else:
        gender = int(data["Gender"])

    # Physical Activity Level
    if isinstance(data["Physical Activity Level"], str):
        activity = {"low": -1, "medium": 0, "high": 1}[data["Physical Activity Level"].lower()]
    else:
        activity = int(data["Physical Activity Level"])

    # Dietary Habits
    if isinstance(data["Dietary Habits"], str):
        diet = {"unhealthy": -1, "medium": 0, "healthy": 1}[data["Dietary Habits"].lower()]
    else:
        diet = int(data["Dietary Habits"])

    # Sleep Disorders
    if isinstance(data["Sleep Disorders"], str):
        sleep_dis = 1 if data["Sleep Disorders"].lower() == "yes" else 0
    else:
        sleep_dis = int(data["Sleep Disorders"])

    # Medication Usage
    if isinstance(data["Medication Usage"], str):
        meds = 1 if data["Medication Usage"].lower() == "yes" else 0
    else:
        meds = int(data["Medication Usage"])

    return gender, activity, diet, sleep_dis, meds


# -------- Main Prediction Endpoint --------
@app.route("/predict", methods=["POST"])
def predict_sleep_quality():
    try:
        data = request.get_json()

        # Encode categorical values
        gender, activity, diet, sleep_dis, meds = encode_inputs(data)

        # Convert bedtime/wakeup to minutes
        bedtime = time_to_minutes(data["Bedtime"])
        wakeup = time_to_minutes(data["Wake-up Time"])

        # Compute engineered features
        energy_balance = data["Calories Burned"] - (data["Daily Steps"] * 0.03)
        bedtime_wakeup_diff = wakeup - bedtime
        if bedtime_wakeup_diff < 0:
            bedtime_wakeup_diff += 24 * 60
        activity_diet_interaction = activity * diet
        age_sleep_interaction = data["Age"] * sleep_dis

        # Build DataFrame for model
        new_person = {
            "Age": data["Age"],
            "Gender": gender,
            "Bedtime": bedtime,
            "Wake-up Time": wakeup,
            "Daily Steps": data["Daily Steps"],
            "Calories Burned": data["Calories Burned"],
            "Physical Activity Level": activity,
            "Dietary Habits": diet,
            "Sleep Disorders": sleep_dis,
            "Medication Usage": meds,
            "EnergyBalance": energy_balance,
            "BedtimeWakeupDiff": bedtime_wakeup_diff,
            "ActivityDietInteraction": activity_diet_interaction,
            "AgeSleepInteraction": age_sleep_interaction
        }

        df = pd.DataFrame([new_person])

        # Make prediction
        prediction = model.predict(df)[0]

        # Round off to 2 decimal places
        rounded_prediction = round(float(prediction), 2)

        return jsonify({
            "Predicted Sleep Quality": rounded_prediction
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------- Run App on Render --------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))  # Use Render-assigned port
    app.run(host="0.0.0.0", port=port, debug=True)
