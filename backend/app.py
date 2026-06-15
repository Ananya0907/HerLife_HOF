from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
import os
import joblib
import numpy as np
import pandas as pd
from datetime import date, timedelta, datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# ── Supabase ──
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# ── Load ML Models ──
pcos_model      = joblib.load("models/herlife_pcos_xgb_model.pkl")
svr_model       = joblib.load("models/herlife_period_svr_model.pkl")
scaler          = joblib.load("models/herlife_period_scaler.pkl")
pcos_features   = joblib.load("models/herlife_pcos_features.pkl")
period_features = joblib.load("models/herlife_period_features.pkl")

print("OK: Models loaded successfully")

# ── Helpers ──
ordinal_maps = {
    "exercise": {"Never": 0, "Sometimes": 1, "Regularly": 2},
    "sleep":    {"Less than 5 hrs": 0, "5-7 hrs": 1, "7-9 hrs": 2, "More than 9 hrs": 3},
    "flow":     {"None": 0, "Light": 1, "Moderate": 2, "Heavy": 3, "Very Heavy": 4},
    "energy":   {"Low": 0, "Medium": 1, "High": 2},
    "missed":   {"Never": 0, "Occasionally": 1, "Frequently": 2},
    "caffeine": {"Never": 0, "Rarely": 1, "Sometimes": 2, "Daily": 3},
    "skin":     {"Clear": 0, "Mild breakout": 1, "Moderate breakout": 2, "Severe breakout": 3},
    "hair":     {"None": 0, "Mild": 1, "Moderate": 2, "Severe": 3},
}

def get_cycle_phase(days_since, cycle_len=28):
    if cycle_len == 0:
        return "Post-Menopause"
    d = int(days_since) % cycle_len
    if d <= 5:    return "Menstrual"
    elif d <= 13: return "Follicular"
    elif d <= 16: return "Ovulation"
    else:         return "Luteal"

# ── Health Tips ──
phase_tips = {
    "Menstrual": {
        "exercise": "Focus on low-impact movement like walking or restorative yoga.",
        "nutrition": "Boost iron intake with leafy greens and beans; stay hydrated with warm teas.",
        "wellbeing": "Prioritize rest and gentle self-care; your energy is naturally lowest now."
    },
    "Follicular": {
        "exercise": "Great time for strength training and trying new workout routines.",
        "nutrition": "Incorporate fermented foods and fresh salads to support hormonal metabolism.",
        "wellbeing": "Creativity and social energy are rising; perfect for planning new projects."
    },
    "Ovulation": {
        "exercise": "Peak energy phase! High-intensity interval training (HIIT) or cardio is ideal.",
        "nutrition": "Focus on anti-inflammatory foods like berries and omega-3 rich seeds.",
        "wellbeing": "You're likely feeling most confident and social; great for important meetings."
    },
    "Luteal": {
        "exercise": "Transition to moderate exercise like Pilates or steady-state cardio.",
        "nutrition": "Combat cravings with magnesium-rich foods like dark chocolate and avocados.",
        "wellbeing": "Slow down and focus on completed tasks; prioritize 7-9 hours of quality sleep."
    },
    "Post-Menopause": {
        "exercise": "Weight-bearing exercises are key for bone health.",
        "nutrition": "Prioritize calcium and Vitamin D; focus on whole-food sources.",
        "wellbeing": "Consistency in routine helps maintain hormonal balance and sleep quality."
    }
}

def build_model_input(profile, daily):
    last_period = profile.get("last_period_date")
    if last_period:
        days_since = (date.today() - date.fromisoformat(str(last_period))).days
    else:
        days_since = 14

    cycle_len = profile.get("cycle_length", 28) or 28
    stress    = daily.get("stress_level", 3)
    sleep_q   = daily.get("sleep_quality", 3)
    sleep_d   = profile.get("sleep_duration", 1) or 1

    hormonal_stress = stress * (1 + (2 - sleep_d) * 0.3)
    wellness = (
        sleep_q +
        daily.get("mood", 3) +
        (profile.get("flow_intensity", 1) or 1) +
        min(daily.get("water_glasses", 6), 8) / 2 +
        (profile.get("exercise_frequency", 1) or 1)
        - stress
        - (profile.get("junk_food_frequency", 3) or 3) / 2
    )
    cycle_irr = (
        (1 - (profile.get("periods_regular", 1) or 1)) +
        (profile.get("missed_periods_frequency", 0) or 0) +
        (1 if cycle_len < 21 or cycle_len > 35 else 0)
    )

    base_input = {
        "Age":                           float(profile.get("age") or 22),
        "BMI":                           float(profile.get("bmi") or 22),
        "Weight_kg":                     float(profile.get("weight_kg") or 60),
        "Exercise_Frequency":            float(profile.get("exercise_frequency") or 1),
        "Sleep_Duration":                float(sleep_d),
        "Stress_Level_1to5":             float(stress),
        "Avg_Cycle_Length_days":         float(cycle_len),
        "Periods_Regular":               float(profile.get("periods_regular") or 1),
        "Bleeding_Duration_days":        float(profile.get("bleeding_duration") or 4),
        "Flow_Intensity":                float(profile.get("flow_intensity") or 2),
        "Clotting":                      float(profile.get("clotting") or 0),
        "Pain_Level_1to5":               float(profile.get("pain_level") or 2),
        "Missed_Periods_Frequency":      float(profile.get("missed_periods_frequency") or 0),
        "Difficulty_Losing_Weight":      float(profile.get("difficulty_losing_weight") or 0),
        "Junk_Food_Frequency_1to5":      float(profile.get("junk_food_frequency") or 3),
        "Sugar_Intake_Frequency_1to5":   float(profile.get("sugar_intake") or 3),
        "Caffeine_Intake":               float(profile.get("caffeine_intake") or 2),
        "Water_Intake_Litres":           float(profile.get("water_intake") or 2.0),
        "Overall_Energy_Level":          float(daily.get("energy_level") or 1),
        "Skin_Condition_During_Cycle":   float(profile.get("skin_condition") or 1),
        "Hair_Fall_Level":               float(profile.get("hair_fall") or 1),
        "Hormonal_Contraceptive_Use":    float(profile.get("hormonal_contraceptive") or 0),
        "Cycle_Irregularity_Score":      float(cycle_irr),
        "Hormonal_Stress_Index":         float(hormonal_stress),
        "Wellness_Score":                float(wellness),
        "Days_Since_Last_Period":        float(days_since),
        "Sleep_Quality_Last_Night_1to5": float(sleep_q),
        "Mood_Today_1to5":               float(daily.get("mood") or 3),
        "Hydration_Glasses_Today":       float(daily.get("water_glasses") or 6),
        "PCOS_PCOD_Diagnosed":           float(profile.get("pcos_diagnosed") or 0),
    }

    # Merge dynamic ML symptoms explicitly recorded by the user (or default empty)
    symptoms = profile.get("model_symptoms") or {}
    for sym_key, sym_val in symptoms.items():
        if sym_key in ["pcos_active", "pcos_history"]:
            continue
        try:
            base_input[sym_key] = float(sym_val)
        except (ValueError, TypeError):
            pass

    return base_input

def add_manual_correction(user_id, correct_date):
    try:
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if not prof_res.data:
            return
        profile = prof_res.data[0]
        model_symptoms = profile.get("model_symptoms") or {}
        
        # Store in period_corrections list
        corrections = model_symptoms.get("period_corrections") or []
        
        # Avoid duplicate date entries
        if correct_date not in corrections:
            corrections.append(correct_date)
            
        model_symptoms["period_corrections"] = corrections
        
        supabase.table("health_profile").update({
            "model_symptoms": model_symptoms,
            "last_period_date": correct_date
        }).eq("user_id", user_id).execute()
        
    except Exception as e:
        print(f"Error adding manual correction: {e}")

def calculate_rolling_cycle_length(user_id):
    try:
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if not prof_res.data:
            return 28

        profile = prof_res.data[0]
        
        dates = set()
        
        # Add configured last period date
        last_period = profile.get("last_period_date")
        if last_period:
            dates.add(last_period)
            
        # Add dates from daily_logs where period_started is True
        logs_res = supabase.table("daily_logs").select("log_date").eq("user_id", user_id).eq("period_started", True).execute()
        if logs_res.data:
            for log in logs_res.data:
                if log.get("log_date"):
                    dates.add(log["log_date"])
                    
        # Add manual correction history if stored in model_symptoms
        model_symptoms = profile.get("model_symptoms") or {}
        corrections = model_symptoms.get("period_corrections") or []
        for d in corrections:
            dates.add(d)

        # Sort dates
        sorted_dates = sorted(list(dates))
        if len(sorted_dates) < 2:
            return profile.get("cycle_length") or 28

        cycle_lengths = []
        for i in range(1, len(sorted_dates)):
            d1 = date.fromisoformat(sorted_dates[i-1])
            d2 = date.fromisoformat(sorted_dates[i])
            diff = (d2 - d1).days
            # Filter biologically plausible values (18 to 45 days)
            if 18 <= diff <= 45:
                cycle_lengths.append(diff)

        if not cycle_lengths:
            return profile.get("cycle_length") or 28

        # Weighted rolling average
        weighted_sum = 0
        total_weight = 0
        for idx, length in enumerate(cycle_lengths):
            weight = idx + 1
            weighted_sum += length * weight
            total_weight += weight

        avg_cycle = round(weighted_sum / total_weight)
        
        # Update health_profile in database
        supabase.table("health_profile").update({
            "cycle_length": avg_cycle
        }).eq("user_id", user_id).execute()
        
        return avg_cycle
    except Exception as e:
        print(f"Error calculating rolling cycle: {e}")
        return 28

def is_lifestyle_irregular(user_id):
    try:
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if not prof_res.data:
            return False
        profile = prof_res.data[0]
        
        model_symptoms = profile.get("model_symptoms") or {}
        tracker_logs = model_symptoms.get("tracker_logs") or []
        
        sugar_levels = []
        junk_levels = []
        caffeine_levels = []
        
        for entry in tracker_logs[-10:]:
            lifestyle = entry.get("lifestyle", {})
            if "sugar" in lifestyle:
                sugar_levels.append(float(lifestyle["sugar"]))
            if "junk_food" in lifestyle:
                junk_levels.append(float(lifestyle["junk_food"]))
            if "caffeine" in lifestyle:
                caffeine_levels.append(float(lifestyle["caffeine"]))
                
        if not sugar_levels and profile.get("sugar_intake") is not None:
            sugar_levels.append(float(profile["sugar_intake"]))
        if not junk_levels and profile.get("junk_food_frequency") is not None:
            junk_levels.append(float(profile["junk_food_frequency"]))
        if not caffeine_levels and profile.get("caffeine_intake") is not None:
            caffeine_levels.append(float(profile["caffeine_intake"]))
            
        avg_sugar = sum(sugar_levels) / len(sugar_levels) if sugar_levels else 3.0
        avg_junk = sum(junk_levels) / len(junk_levels) if junk_levels else 3.0
        avg_caffeine = sum(caffeine_levels) / len(caffeine_levels) if caffeine_levels else 2.0
        
        return (avg_sugar >= 4.0) or (avg_junk >= 4.0) or (avg_caffeine >= 2.5) or (avg_sugar + avg_junk + avg_caffeine >= 9.5)
    except Exception as e:
        print(f"Error checking lifestyle: {e}")
        return False

def format_prediction_response(user_id, days_left, next_period_date_str):
    try:
        # Convert days_left to float then round to int
        d_val = round(float(days_left))
    except (ValueError, TypeError):
        d_val = 28
        
    if is_lifestyle_irregular(user_id):
        days_min = max(0, d_val - 3)
        days_max = d_val + 3
        
        today = date.today()
        date_min = (today + timedelta(days=days_min)).isoformat()
        date_max = (today + timedelta(days=days_max)).isoformat()
        
        return {
            "days_until_period": f"{days_min} to {days_max}",
            "next_period_date": f"{date_min} to {date_max}"
        }
    else:
        return {
            "days_until_period": d_val,
            "next_period_date": next_period_date_str
        }

# ────────────────────────────────────────────────────────────
# ROUTES
# ────────────────────────────────────────────────────────────

@app.route('/')
def home():
    return jsonify({"status": "HerLife backend is running ✅"})


# ── 1. SIGNUP ──
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        # Check if email already exists
        existing = supabase.table("users").select("id").eq("email", data["email"]).execute()
        if existing.data:
            return jsonify({"error": "An account with this email already exists. Please login."}), 400

        # Hash password
        pw_hash = generate_password_hash(data.get("password", ""))

        result = supabase.table("users").insert({
            "email":         data["email"],
            "name":          data["name"],
            "dob":           data["dob"],
            "age":           data["age"],
            "life_phase":    data.get("life_phase", "pending"),
            "password_hash": pw_hash,
        }).execute()
        return jsonify({"success": True, "user": result.data[0]}), 201
    except Exception as e:
        print(f"ERROR in signup: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 1.1 LOGIN ──
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    try:
        identifier = data.get('email') or data.get('username', '')
        if not identifier:
            return jsonify({"error": "Please enter your email or username"}), 400

        # Look up by email or name
        result = supabase.table("users").select("*")\
            .or_(f"email.eq.{identifier},name.eq.{identifier}")\
            .execute()

        if not result.data:
            return jsonify({"error": "No account found. Please sign up first."}), 404

        user = result.data[0]

        # Verify password
        stored_hash = user.get("password_hash", "")
        if stored_hash and not check_password_hash(stored_hash, data.get('password', '')):
            return jsonify({"error": "Incorrect password"}), 401

        # Don't return password_hash to frontend
        user.pop("password_hash", None)
        return jsonify({"success": True, "user": user}), 200
    except Exception as e:
        print(f"ERROR in login: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 1.2 GOOGLE LOGIN ──
@app.route('/api/google-login', methods=['POST'])
def google_login():
    data = request.json
    email = data.get("email")
    name  = data.get("name", "")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        # Check if user exists
        result = supabase.table("users").select("*").eq("email", email).execute()

        if result.data:
            user = result.data[0]
        else:
            # Auto-create account for Google users
            res = supabase.table("users").insert({
                "email":      email,
                "name":       name or email.split('@')[0],
                "life_phase": "pending",
                "age":        0,
                "dob":        "2000-01-01",
            }).execute()
            user = res.data[0]

        user.pop("password_hash", None)
        return jsonify({"success": True, "user": user}), 200
    except Exception as e:
        print(f"ERROR in google-login: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 2. UPDATE PHASE ── ← NEW
@app.route('/api/update-phase', methods=['POST'])
def update_phase():
    data = request.json
    try:
        supabase.table("users").update({
            "life_phase": data["life_phase"],
            "name":       data["name"],
        }).eq("id", data["user_id"]).execute()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 3. ONBOARDING ──
@app.route('/api/onboarding', methods=['POST'])
def onboarding():
    data    = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
        
    try:
        last_period = data.get("last_period_date")
        h   = float(data.get("height_cm") or 160)
        w   = float(data.get("weight_kg") or 60)
        bmi = round(w / (h / 100) ** 2, 1)

        print(f"DEBUG: Processing onboarding for user {user_id}")

        # Update user height/weight/bmi
        supabase.table("users").update({
            "height_cm": h,
            "weight_kg": w,
            "bmi":       bmi
        }).eq("id", user_id).execute()

        model_symptoms = data.get("model_symptoms", {})
        model_symptoms.update({
            "Clotting":                   1 if data.get("clotting") == "Yes" else 0,
            "Difficulty_Losing_Weight":   1 if data.get("difficulty_losing_weight") == "Yes" else 0,
            "Hormonal_Contraceptive_Use": 1 if data.get("hormonal_contraceptive") == "Yes" else 0,
            "Skin_Condition_During_Cycle":ordinal_maps["skin"].get(data.get("skin_condition", "Clear"), 0),
            "Hair_Fall_Level":            ordinal_maps["hair"].get(data.get("hair_fall", "None"), 0),
        })

        # Insert or Update health profile (using upsert to be safe)
        profile_data = {
            "user_id":                  user_id,
            "last_period_date":         last_period or date.today().isoformat(),
            "cycle_length":             int(data.get("cycle_length") or 28),
            "flow_intensity":           ordinal_maps["flow"].get(data.get("flow_intensity", "Moderate"), 2),
            "pcos_diagnosed":           1 if data.get("pcos_diagnosed") == "Yes" else (0 if data.get("pcos_diagnosed") == "No" else -1),
            "periods_regular":          1 if data.get("periods_regular") == "Yes" else 0,
            "bleeding_duration":        int(data.get("bleeding_duration") or 4),
            "pain_level":               int(data.get("pain_level") or 2),
            "missed_periods_frequency": ordinal_maps["missed"].get(data.get("missed_periods_frequency", "Never"), 0),
            "model_symptoms":           model_symptoms,
        }
        
        supabase.table("health_profile").upsert(profile_data).execute()

        return jsonify({"success": True, "bmi": bmi}), 201
    except Exception as e:
        print(f"ERROR in onboarding: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 4. PROFILE UPDATE ──
@app.route('/api/profile', methods=['POST'])
def update_profile():
    data    = request.json
    user_id = data["user_id"]
    try:
        # 1. Update height, weight, and BMI if present
        if "height_cm" in data or "weight_kg" in data:
            user_res = supabase.table("users").select("height_cm", "weight_kg").eq("id", user_id).execute()
            h = data.get("height_cm")
            w = data.get("weight_kg")
            if user_res.data:
                if h is None:
                    h = user_res.data[0].get("height_cm") or 160
                if w is None:
                    w = user_res.data[0].get("weight_kg") or 60
            h = float(h)
            w = float(w)
            bmi = round(w / (h / 100) ** 2, 1)
            supabase.table("users").update({
                "height_cm": h,
                "weight_kg": w,
                "bmi":       bmi
            }).eq("id", user_id).execute()

        # 2. Get existing health profile to update model_symptoms
        prof_res = supabase.table("health_profile").select("model_symptoms").eq("user_id", user_id).execute()
        model_symptoms = {}
        has_profile = False
        if prof_res.data:
            model_symptoms = prof_res.data[0].get("model_symptoms") or {}
            has_profile = True

        if "pregnancy_week_start" in data:
            model_symptoms["pregnancy_week_start"] = data["pregnancy_week_start"]
        if "pregnancy_start_date" in data:
            model_symptoms["pregnancy_start_date"] = data["pregnancy_start_date"]
        if "pregnancy_logs" in data:
            model_symptoms["pregnancy_logs"] = data["pregnancy_logs"]

        if "trimester" in data:
            model_symptoms["trimester"] = data["trimester"]
        if "exercise_frequency" in data:
            model_symptoms["Exercise_Frequency"] = data["exercise_frequency"]
        if "sleep_duration" in data:
            model_symptoms["Sleep_Duration"] = data["sleep_duration"]
        if "junk_food_frequency" in data:
            model_symptoms["Junk_Food_Frequency_1to5"] = data["junk_food_frequency"]
        if "sugar_intake" in data:
            model_symptoms["Sugar_Intake_Frequency_1to5"] = data["sugar_intake"]
        if "caffeine_intake" in data:
            model_symptoms["Caffeine_Intake"] = data["caffeine_intake"]
        if "water_intake" in data:
            model_symptoms["Water_Intake_Litres"] = data["water_intake"]

        db_updates = {}
        if "exercise_frequency" in data:
            db_updates["exercise_frequency"] = ordinal_maps["exercise"].get(data["exercise_frequency"], 1)
        if "sleep_duration" in data:
            db_updates["sleep_duration"] = ordinal_maps["sleep"].get(data["sleep_duration"], 2)
        if "diet_type" in data:
            db_updates["diet_type"] = data["diet_type"]
        if "caffeine_intake" in data:
            db_updates["caffeine_intake"] = ordinal_maps["caffeine"].get(data["caffeine_intake"], 2)
        if "junk_food_frequency" in data:
            db_updates["junk_food_frequency"] = data["junk_food_frequency"]
        if "sugar_intake" in data:
            db_updates["sugar_intake"] = data["sugar_intake"]
        if "water_intake" in data:
            db_updates["water_intake"] = data["water_intake"]
        if "missed_periods_frequency" in data:
            db_updates["missed_periods_frequency"] = ordinal_maps["missed"].get(data["missed_periods_frequency"], 0)
        
        # Always update model_symptoms
        db_updates["model_symptoms"] = model_symptoms

        if has_profile:
            supabase.table("health_profile").update(db_updates).eq("user_id", user_id).execute()
        else:
            db_updates["user_id"] = user_id
            db_updates["cycle_length"] = 28
            db_updates["periods_regular"] = 1
            supabase.table("health_profile").insert(db_updates).execute()
            
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"ERROR in profile update: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 5. DAILY LOG + PREDICT ──
@app.route('/api/daily-log', methods=['POST'])
def daily_log():
    data    = request.json
    user_id = data["user_id"]
    try:
        # Save daily log
        supabase.table("daily_logs").insert({
            "user_id":        user_id,
            "mood":           data.get("mood", 3),
            "stress_level":   data.get("stress_level", 3),
            "sleep_quality":  data.get("sleep_quality", 3),
            "water_glasses":  data.get("water_glasses", 6),
            "period_started": data.get("period_started", False),
            "energy_level":   ordinal_maps["energy"].get(data.get("energy_level", "Medium"), 1),
        }).execute()

        # Update weight in users table if passed
        weight_kg = data.get("weight_kg")
        user_res = supabase.table("users").select("height_cm", "life_phase").eq("id", user_id).execute()
        is_pregnant = False
        if user_res.data:
            is_pregnant = (user_res.data[0].get("life_phase") == "pregnant")

        if weight_kg:
            h = 160.0
            if user_res.data:
                h = user_res.data[0].get("height_cm") or 160.0
            h = float(h)
            w = float(weight_kg)
            bmi = round(w / (h / 100) ** 2, 1)
            supabase.table("users").update({
                "weight_kg": w,
                "bmi":       bmi
            }).eq("id", user_id).execute()

        # Save pregnancy log inside model_symptoms in health_profile
        if is_pregnant:
            prof_res = supabase.table("health_profile").select("model_symptoms").eq("user_id", user_id).execute()
            
            has_profile = False
            model_symptoms = {}
            pregnancy_logs = []
            
            if prof_res.data:
                profile = prof_res.data[0]
                model_symptoms = profile.get("model_symptoms") or {}
                pregnancy_logs = model_symptoms.get("pregnancy_logs", [])
                has_profile = True
                
            today_str = date.today().isoformat()
            
            # Find and update existing log for today, or append new one
            existing_log = next((log for log in pregnancy_logs if log.get("date") == today_str), None)
            
            log_entry = {
                "date":                 today_str,
                "pregnancy_week_start": data.get("pregnancy_week_start"),
                "weight_kg":            data.get("weight_kg"),
                "bp":                   data.get("bp"),
                "symptoms":             data.get("symptoms"),
                "felt_movement":        data.get("felt_movement"),
                "kick_count":           data.get("kick_count"),
                "movement_type":        data.get("movement_type"),
                "sleep_hours":          data.get("sleep_hours"),
                "sleep_rating":         data.get("sleep_rating"),
                "water_glasses":        data.get("water_glasses"),
                "meals_count":          data.get("meals_count"),
                "took_vitamins":        data.get("took_vitamins"),
                "avoided_cravings":     data.get("avoided_cravings"),
                "mood":                 data.get("mood_label"),
                "stress_score":         data.get("stress_score"),
                "emotional_notes":      data.get("emotional_notes"),
                "exercise":             data.get("exercise"),
                "activity_type":        data.get("activity_type"),
                "activity_duration":    data.get("activity_duration"),
                "bleeding":             data.get("bleeding"),
                "fluid_leakage":        data.get("fluid_leakage"),
                "contractions":         data.get("contractions"),
                "unusual_symptoms":     data.get("unusual_symptoms"),
                "notes":                data.get("notes")
            }
            
            if existing_log:
                existing_log.update(log_entry)
            else:
                pregnancy_logs.insert(0, log_entry) # newest first
                
            model_symptoms["pregnancy_logs"] = pregnancy_logs
            
            if has_profile:
                supabase.table("health_profile").update({
                    "model_symptoms": model_symptoms
                }).eq("user_id", user_id).execute()
            else:
                supabase.table("health_profile").insert({
                    "user_id": user_id,
                    "cycle_length": 28,
                    "periods_regular": 1,
                    "model_symptoms": model_symptoms
                }).execute()

        # If period started today → update last_period_date, log it as a correction, and recalculate rolling average
        if data.get("period_started"):
            add_manual_correction(user_id, date.today().isoformat())
            calculate_rolling_cycle_length(user_id)

        # Fetch last 7 days logs for averaging
        recent_logs = supabase.table("daily_logs")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("log_date", desc=True)\
            .limit(7)\
            .execute()

        if recent_logs.data and len(recent_logs.data) > 1:
            logs    = recent_logs.data
            stress  = sum(l["stress_level"]  or 3 for l in logs) / len(logs)
            sleep_q = sum(l["sleep_quality"] or 3 for l in logs) / len(logs)
            mood    = sum(l["mood"]          or 3 for l in logs) / len(logs)
            water   = sum(l["water_glasses"] or 6 for l in logs) / len(logs)
        else:
            stress  = data.get("stress_level", 3)
            sleep_q = data.get("sleep_quality", 3)
            mood    = data.get("mood", 3)
            water   = data.get("water_glasses", 6)

        # Fetch profile
        profile_res = supabase.table("health_profile")\
            .select("*").eq("user_id", user_id).execute()
        user_res = supabase.table("users")\
            .select("*").eq("id", user_id).execute()

        if not profile_res.data:
            print(f"DEBUG: Profile missing for user {user_id}. Auto-creating basic profile...")
            # Auto-create basic profile as healing step
            profile_data = {
                "user_id": user_id,
                "last_period_date": date.today().isoformat(),
                "cycle_length": 28,
                "periods_regular": 1
            }
            supabase.table("health_profile").insert(profile_data).execute()
            
            # Fetch again
            profile_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
            if not profile_res.data:
                 return jsonify({"error": "Failed to create auto-healing profile"}), 500

        profile = {**profile_res.data[0], **user_res.data[0]}
        daily   = {
            "stress_level":  stress,
            "sleep_quality": sleep_q,
            "mood":          mood,
            "water_glasses": water,
            "energy_level":  ordinal_maps["energy"].get(data.get("energy_level", "Medium"), 1),
        }

        model_input = build_model_input(profile, daily)

        # Model A — PCOS
        pcos_input = pd.DataFrame([{col: model_input.get(col, 0) for col in pcos_features}]).astype(float)
        pcos_risk  = round(float(pcos_model.predict_proba(pcos_input)[0][1]) * 100, 1)

        # Model B — Period
        period_input  = pd.DataFrame([{col: model_input.get(col, 0) for col in period_features}]).astype(float)
        period_scaled = scaler.transform(period_input)
        days_left     = max(0, round(float(svr_model.predict(period_scaled)[0])))
        next_period   = (date.today() + timedelta(days=days_left)).isoformat()
        cycle_phase   = get_cycle_phase(
            model_input["Days_Since_Last_Period"],
            model_input["Avg_Cycle_Length_days"]
        )

        # Save predictions (store nominal values in DB)
        supabase.table("predictions").upsert({
            "user_id":           user_id,
            "cycle_phase":       cycle_phase,
            "days_until_period": days_left,
            "pcos_risk_score":   pcos_risk,
            "next_period_date":  next_period,
        }).execute()

        formatted_pred = format_prediction_response(user_id, days_left, next_period)
        return jsonify({
            "success":           True,
            "cycle_phase":       cycle_phase,
            "days_until_period": formatted_pred["days_until_period"],
            "next_period_date":  formatted_pred["next_period_date"],
            "pcos_risk_score":   pcos_risk,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 6. GET PREDICTIONS ──
@app.route('/api/predictions/<user_id>', methods=['GET'])
def get_predictions(user_id):
    try:
        result = supabase.table("predictions")\
            .select("*").eq("user_id", user_id).execute()
        if not result.data:
            return jsonify({"error": "No predictions yet"}), 404
        pred = result.data[0]
        formatted = format_prediction_response(user_id, pred["days_until_period"], pred["next_period_date"])
        pred["days_until_period"] = formatted["days_until_period"]
        pred["next_period_date"] = formatted["next_period_date"]
        return jsonify(pred), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 7. DASHBOARD DATA ──
@app.route('/api/dashboard-data/<user_id>', methods=['GET'])
def get_dashboard_data(user_id):
    try:
        # 1. Fetch User Profile
        user_res = supabase.table("users").select("*").eq("id", user_id).execute()
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        
        if not user_res.data:
            return jsonify({"error": "User not found"}), 404

        # Auto-heal: If user signed up but has NO profile, create a dummy one
        if not prof_res.data:
            print(f"DEBUG: Auto-healing profile for {user_id} in dashboard view")
            supabase.table("health_profile").insert({
                "user_id":          user_id,
                "last_period_date": date.today().isoformat(),
                "cycle_length":     28,
                "periods_regular":  1
            }).execute()
            prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()

        user    = user_res.data[0]
        profile = prof_res.data[0]
        
        # Calculate Cycle Day
        last_period_str = profile.get("last_period_date")
        cycle_day = 1
        if last_period_str:
            cycle_day = (date.today() - date.fromisoformat(str(last_period_str))).days + 1

        # 3. Model Logic (Live Prediction if missing)
        pred_res = supabase.table("predictions")\
            .select("*").eq("user_id", user_id)\
            .order("updated_at", desc=True).limit(1).execute()
        
        cached = pred_res.data[0] if pred_res.data else None
        # Re-run if no prediction or if cached data is stale (0 days is clearly wrong)
        if cached and cached.get("days_until_period", 0) > 0:
            prediction = cached
        else:
            print(f"DEBUG: Running on-the-fly ML prediction using trained models for {user_id}")
            # Run models live using profile data
            daily_mock = {"stress_level": 3, "sleep_quality": 3, "mood": 3, "water_glasses": 6}
            model_input = build_model_input(profile, daily_mock)
            
            # PCOS Prediction (XGBoost)
            pcos_df   = pd.DataFrame([{col: model_input.get(col, 0) for col in pcos_features}]).astype(float)
            pcos_risk = round(float(pcos_model.predict_proba(pcos_df)[0][1]) * 100, 1)
            
            # Period Prediction (SVR)
            period_df = pd.DataFrame([{col: model_input.get(col, 0) for col in period_features}]).astype(float)
            period_sc = scaler.transform(period_df)
            days_left = max(1, round(float(svr_model.predict(period_sc)[0])))
            
            prediction = {
                "cycle_phase":       get_cycle_phase(model_input["Days_Since_Last_Period"], model_input["Avg_Cycle_Length_days"]),
                "days_until_period": days_left,
                "pcos_risk_score":   pcos_risk,
                "next_period_date":  (date.today() + timedelta(days=days_left)).isoformat()
            }
            # Cache it
            supabase.table("predictions").upsert({**prediction, "user_id": user_id}).execute()

        # Check if more details needed
        needs_details = False
        if profile.get("exercise_frequency") is None or profile.get("sleep_duration") is None:
            needs_details = True

        # Format prediction response dynamically
        if prediction:
            prediction = dict(prediction)
            formatted = format_prediction_response(user_id, prediction["days_until_period"], prediction["next_period_date"])
            prediction["days_until_period"] = formatted["days_until_period"]
            prediction["next_period_date"] = formatted["next_period_date"]

        return jsonify({
            "userName":    user.get("name"),
            "cycleDay":    cycle_day,
            "prediction":  prediction,
            "needs_details": needs_details,
            "wellness": {
                "bmi": user.get("bmi", 22.0),
                "height_cm": user.get("height_cm"),
                "weight_kg": user.get("weight_kg"),
                "riskScore": prediction.get("pcos_risk_score", 0)
            }
        }), 200
    except Exception as e:
        print(f"ERROR in dashboard-data: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 8. RECOMMENDATIONS ──
@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        # Fetch latest phase prediction
        pred_res = supabase.table("predictions")\
            .select("cycle_phase").eq("user_id", user_id)\
            .order("updated_at", desc=True).limit(1).execute()
        
        phase = "Follicular" # Default
        if pred_res.data:
            phase = pred_res.data[0]["cycle_phase"]
        
        tips = phase_tips.get(phase, phase_tips["Follicular"])
        
        return jsonify({
            "phase": phase,
            "recommendations": [
                {"title": "Exercise Plan", "content": tips["exercise"], "type": "fitness"},
                {"title": "Nutrition Guide", "content": tips["nutrition"], "type": "diet"},
                {"title": "Daily Wellbeing", "content": tips["wellbeing"], "type": "mental"}
            ]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 9. LOG HISTORY ──
@app.route('/api/logs/<user_id>', methods=['GET'])
def get_logs(user_id):
    try:
        logs = supabase.table("daily_logs")\
            .select("*").eq("user_id", user_id)\
            .order("log_date", desc=True).limit(30).execute()

        pred = supabase.table("predictions")\
            .select("*").eq("user_id", user_id)\
            .order("updated_at", desc=True).limit(1).execute()

        return jsonify({
            "logs": logs.data or [],
            "latestPrediction": pred.data[0] if pred.data else None
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 10. USER PROFILE (full) ──
@app.route('/api/user-profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    try:
        user_res = supabase.table("users").select("*").eq("id", user_id).execute()
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        pred_res = supabase.table("predictions")\
            .select("*").eq("user_id", user_id)\
            .order("updated_at", desc=True).limit(1).execute()
        logs_res = supabase.table("daily_logs")\
            .select("*").eq("user_id", user_id)\
            .order("log_date", desc=True).limit(30).execute()

        if not user_res.data:
            return jsonify({"error": "User not found"}), 404

        user    = user_res.data[0]
        profile = prof_res.data[0] if prof_res.data else {}
        pred    = pred_res.data[0] if pred_res.data else {}

        return jsonify({
            "user": {
                "name":       user.get("name"),
                "email":      user.get("email"),
                "age":        user.get("age"),
                "life_phase": user.get("life_phase"),
                "bmi":        user.get("bmi"),
                "height_cm":  user.get("height_cm"),
                "weight_kg":  user.get("weight_kg"),
            },
            "health": {
                "cycle_length":      profile.get("cycle_length"),
                "last_period_date":  profile.get("last_period_date"),
                "flow_intensity":    profile.get("flow_intensity"),
                "periods_regular":   profile.get("periods_regular"),
                "pcos_diagnosed":    profile.get("pcos_diagnosed"),
                "bleeding_duration": profile.get("bleeding_duration"),
                "model_symptoms":    profile.get("model_symptoms") or {},
            },
            "prediction": {
                "cycle_phase":       pred.get("cycle_phase") if pred else None,
                "days_until_period": format_prediction_response(user_id, pred.get("days_until_period", 28), pred.get("next_period_date", ""))["days_until_period"] if pred else None,
                "pcos_risk_score":   pred.get("pcos_risk_score") if pred else 0,
                "next_period_date":  format_prediction_response(user_id, pred.get("days_until_period", 28), pred.get("next_period_date", ""))["next_period_date"] if pred else None,
            },
            "logs": logs_res.data or []
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 11. UPDATE TRACKER SETTINGS + RUN ML ──
@app.route('/api/update-tracker', methods=['POST'])
def update_tracker():
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    try:
        last_period = data.get("last_period_date")
        cycle_length = int(data.get("cycle_length", 28))
        period_length = int(data.get("period_length", 5))

        # Record this update as a manual correction data point and update rolling average
        computed_cycle_length = cycle_length
        if last_period:
            add_manual_correction(user_id, last_period)
            computed_cycle_length = calculate_rolling_cycle_length(user_id)

        # Update health_profile
        supabase.table("health_profile").update({
            "last_period_date": last_period,
            "cycle_length": computed_cycle_length,
            "bleeding_duration": period_length
        }).eq("user_id", user_id).execute()

        # Re-run ML predictions
        profile_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        user_res = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if profile_res.data and user_res.data:
            profile = {**profile_res.data[0], **user_res.data[0]}
            daily_mock = {"stress_level": 3, "sleep_quality": 3, "mood": 3, "water_glasses": 6}
            model_input = build_model_input(profile, daily_mock)
            
            # PCOS Prediction (XGBoost)
            pcos_df   = pd.DataFrame([{col: model_input.get(col, 0) for col in pcos_features}]).astype(float)
            pcos_risk = round(float(pcos_model.predict_proba(pcos_df)[0][1]) * 100, 1)
            
            # Period Prediction (SVR)
            period_df = pd.DataFrame([{col: model_input.get(col, 0) for col in period_features}]).astype(float)
            period_sc = scaler.transform(period_df)
            days_left = max(0, round(float(svr_model.predict(period_sc)[0])))
            next_period = (date.today() + timedelta(days=days_left)).isoformat()
            cycle_phase = get_cycle_phase(model_input["Days_Since_Last_Period"], model_input["Avg_Cycle_Length_days"])
            
            prediction = {
                "user_id": user_id,
                "cycle_phase": cycle_phase,
                "days_until_period": days_left,
                "pcos_risk_score": pcos_risk,
                "next_period_date": next_period
            }
            supabase.table("predictions").upsert(prediction).execute()
            
            formatted = format_prediction_response(user_id, days_left, next_period)
            prediction_resp = {
                "user_id": user_id,
                "cycle_phase": cycle_phase,
                "days_until_period": formatted["days_until_period"],
                "pcos_risk_score": pcos_risk,
                "next_period_date": formatted["next_period_date"]
            }
            return jsonify({"success": True, "prediction": prediction_resp}), 200
        else:
            return jsonify({"success": True}), 200
    except Exception as e:
        print(f"ERROR in update-tracker: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 11.1 PCOS SYMPTOMS GET & POST ──
@app.route('/api/pcos-symptoms/<user_id>', methods=['GET'])
def get_pcos_symptoms(user_id):
    try:
        # Fetch profile
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if not prof_res.data:
            # Auto-heal profile
            supabase.table("health_profile").insert({
                "user_id": user_id,
                "last_period_date": date.today().isoformat(),
                "cycle_length": 28,
                "periods_regular": 1,
                "model_symptoms": {}
            }).execute()
            prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()

        profile = prof_res.data[0]
        model_symptoms = profile.get("model_symptoms") or {}
        
        # Get active symptoms and history log
        pcos_active = model_symptoms.get("pcos_active", {
            "Irregular periods": True,
            "Excessive hair growth": False,
            "Weight gain": True,
            "Acne": False,
            "Hair thinning": False
        })
        pcos_history = model_symptoms.get("pcos_history", [])

        return jsonify({
            "pcos_active": pcos_active,
            "pcos_history": pcos_history
        }), 200
    except Exception as e:
        print(f"ERROR in get_pcos_symptoms: {str(e)}")
        return jsonify({"error": str(e)}), 400


@app.route('/api/pcos-symptoms', methods=['POST'])
def save_pcos_symptoms():
    data = request.json
    user_id = data.get("user_id")
    symptoms = data.get("symptoms") # a dict like {"Irregular periods": true, ...}
    if not user_id or symptoms is None:
        return jsonify({"error": "user_id and symptoms are required"}), 400

    try:
        # Fetch existing profile
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if not prof_res.data:
            return jsonify({"error": "Profile not found"}), 404

        profile = prof_res.data[0]
        model_symptoms = profile.get("model_symptoms") or {}

        # Add to history
        pcos_history = model_symptoms.get("pcos_history", [])
        
        # Get current time string in ISO format
        from datetime import datetime
        now_str = datetime.utcnow().isoformat() + "Z"
        
        # Build new entry
        new_entry = {
            "date": now_str,
            "symptoms": symptoms
        }
        pcos_history.insert(0, new_entry) # Put newest on top

        # Save to model_symptoms
        model_symptoms["pcos_active"] = symptoms
        model_symptoms["pcos_history"] = pcos_history

        # Update model features mapped from symptoms
        model_symptoms.update({
            "Difficulty_Losing_Weight": 1.0 if symptoms.get("Weight gain") else 0.0,
            "Skin_Condition_During_Cycle": 2.0 if symptoms.get("Acne") else 0.0,
            "Hair_Fall_Level": 2.0 if symptoms.get("Hair thinning") else 0.0,
        })

        # Update in DB
        supabase.table("health_profile").update({
            "model_symptoms": model_symptoms
        }).eq("user_id", user_id).execute()

        # Re-run predictions to calculate new PCOS risk
        user_res = supabase.table("users").select("*").eq("id", user_id).execute()
        if user_res.data:
            user = user_res.data[0]
            profile_combined = {**profile, **user, "model_symptoms": model_symptoms}
            daily_mock = {"stress_level": 3, "sleep_quality": 3, "mood": 3, "water_glasses": 6}
            model_input = build_model_input(profile_combined, daily_mock)
            
            # PCOS Prediction (XGBoost)
            pcos_df = pd.DataFrame([{col: model_input.get(col, 0) for col in pcos_features}]).astype(float)
            pcos_risk = round(float(pcos_model.predict_proba(pcos_df)[0][1]) * 100, 1)
            
            # Period Prediction (SVR)
            period_df = pd.DataFrame([{col: model_input.get(col, 0) for col in period_features}]).astype(float)
            period_sc = scaler.transform(period_df)
            days_left = max(0, round(float(svr_model.predict(period_sc)[0])))
            next_period = (date.today() + timedelta(days=days_left)).isoformat()
            cycle_phase = get_cycle_phase(model_input["Days_Since_Last_Period"], model_input["Avg_Cycle_Length_days"])
            
            prediction = {
                "user_id": user_id,
                "cycle_phase": cycle_phase,
                "days_until_period": days_left,
                "pcos_risk_score": pcos_risk,
                "next_period_date": next_period
            }
            supabase.table("predictions").upsert(prediction).execute()

        return jsonify({
            "success": True,
            "pcos_active": symptoms,
            "pcos_history": pcos_history
        }), 200

    except Exception as e:
        print(f"ERROR in save_pcos_symptoms: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 12. DELETE PERIOD LOG ──
@app.route('/api/delete-period-log', methods=['POST'])
def delete_period_log():
    data = request.json
    user_id = data.get("user_id")
    log_date = data.get("log_date")
    if not user_id or not log_date:
        return jsonify({"error": "user_id and log_date are required"}), 400
    try:
        # Check and clear in health_profile if it matches
        profile_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if profile_res.data:
            profile = profile_res.data[0]
            if profile.get("last_period_date") == log_date:
                supabase.table("health_profile").update({"last_period_date": None}).eq("user_id", user_id).execute()
        
        # Update daily_logs on that date to set period_started = False
        supabase.table("daily_logs").update({"period_started": False})\
            .eq("user_id", user_id).eq("log_date", log_date).execute()

        # Re-run predictions based on new state
        profile_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        user_res = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if profile_res.data and user_res.data:
            profile = {**profile_res.data[0], **user_res.data[0]}
            daily_mock = {"stress_level": 3, "sleep_quality": 3, "mood": 3, "water_glasses": 6}
            model_input = build_model_input(profile, daily_mock)
            
            # PCOS Prediction (XGBoost)
            pcos_df   = pd.DataFrame([{col: model_input.get(col, 0) for col in pcos_features}]).astype(float)
            pcos_risk = round(float(pcos_model.predict_proba(pcos_df)[0][1]) * 100, 1)
            
            # Period Prediction (SVR)
            period_df = pd.DataFrame([{col: model_input.get(col, 0) for col in period_features}]).astype(float)
            period_sc = scaler.transform(period_df)
            days_left = max(0, round(float(svr_model.predict(period_sc)[0])))
            next_period = (date.today() + timedelta(days=days_left)).isoformat()
            cycle_phase = get_cycle_phase(model_input["Days_Since_Last_Period"], model_input["Avg_Cycle_Length_days"])
            
            prediction = {
                "user_id": user_id,
                "cycle_phase": cycle_phase,
                "days_until_period": days_left,
                "pcos_risk_score": pcos_risk,
                "next_period_date": next_period
            }
            supabase.table("predictions").upsert(prediction).execute()

        # Recalculate rolling average after deletion
        calculate_rolling_cycle_length(user_id)

        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"ERROR in delete-period-log: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 13. EDIT PERIOD LOG ──
@app.route('/api/edit-period-log', methods=['POST'])
def edit_period_log():
    data = request.json
    user_id = data.get("user_id")
    old_date = data.get("old_date")
    new_date = data.get("new_date")
    if not user_id or not old_date or not new_date:
        return jsonify({"error": "user_id, old_date, and new_date are required"}), 400
    try:
        # 1. Record the edit as a manual correction data point and recalculate rolling average
        add_manual_correction(user_id, new_date)
        calculate_rolling_cycle_length(user_id)

        # 2. Check and update in health_profile if it matches old_date
        profile_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if profile_res.data:
            profile = profile_res.data[0]
            if profile.get("last_period_date") == old_date:
                supabase.table("health_profile").update({"last_period_date": new_date}).eq("user_id", user_id).execute()
        
        # 3. Update daily_logs: old_date set period_started = False
        supabase.table("daily_logs").update({"period_started": False})\
            .eq("user_id", user_id).eq("log_date", old_date).execute()

        # 4. Check if new_date daily log exists
        new_log_res = supabase.table("daily_logs").select("*")\
            .eq("user_id", user_id).eq("log_date", new_date).execute()
        
        if new_log_res.data:
            supabase.table("daily_logs").update({"period_started": True})\
                .eq("user_id", user_id).eq("log_date", new_date).execute()
        else:
            supabase.table("daily_logs").insert({
                "user_id": user_id,
                "log_date": new_date,
                "period_started": True,
                "mood": 3,
                "stress_level": 3,
                "sleep_quality": 3,
                "water_glasses": 6,
                "energy_level": 1
            }).execute()

        # 5. Re-run predictions based on new state
        profile_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        user_res = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if profile_res.data and user_res.data:
            profile = {**profile_res.data[0], **user_res.data[0]}
            daily_mock = {"stress_level": 3, "sleep_quality": 3, "mood": 3, "water_glasses": 6}
            model_input = build_model_input(profile, daily_mock)
            
            # PCOS Prediction (XGBoost)
            pcos_df   = pd.DataFrame([{col: model_input.get(col, 0) for col in pcos_features}]).astype(float)
            pcos_risk = round(float(pcos_model.predict_proba(pcos_df)[0][1]) * 100, 1)
            
            # Period Prediction (SVR)
            period_df = pd.DataFrame([{col: model_input.get(col, 0) for col in period_features}]).astype(float)
            period_sc = scaler.transform(period_df)
            days_left = max(0, round(float(svr_model.predict(period_sc)[0])))
            next_period = (date.today() + timedelta(days=days_left)).isoformat()
            cycle_phase = get_cycle_phase(model_input["Days_Since_Last_Period"], model_input["Avg_Cycle_Length_days"])
            
            prediction = {
                "user_id": user_id,
                "cycle_phase": cycle_phase,
                "days_until_period": days_left,
                "pcos_risk_score": pcos_risk,
                "next_period_date": next_period
            }
            supabase.table("predictions").upsert(prediction).execute()

        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"ERROR in edit-period-log: {str(e)}")
        return jsonify({"error": str(e)}), 400


# ── 14. LIGHTWEIGHT TRACKER LOGGING ENDPOINT ──
@app.route('/api/tracker/log', methods=['POST'])
def log_tracker():
    data = request.json
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
        
    symptoms = data.get("symptoms", {})
    lifestyle = data.get("lifestyle", {})
    timestamp = data.get("timestamp") or (datetime.utcnow().isoformat() + "Z")
    
    try:
        prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
        if not prof_res.data:
            supabase.table("health_profile").insert({
                "user_id": user_id,
                "last_period_date": date.today().isoformat(),
                "cycle_length": 28,
                "periods_regular": 1
            }).execute()
            prof_res = supabase.table("health_profile").select("*").eq("user_id", user_id).execute()
            
        profile = prof_res.data[0]
        model_symptoms = profile.get("model_symptoms") or {}
        
        tracker_logs = model_symptoms.get("tracker_logs") or []
        new_log = {
            "timestamp": timestamp,
            "symptoms": symptoms,
            "lifestyle": lifestyle
        }
        tracker_logs.append(new_log)
        model_symptoms["tracker_logs"] = tracker_logs
        
        update_data = {"model_symptoms": model_symptoms}
        if "sugar" in lifestyle:
            update_data["sugar_intake"] = int(lifestyle["sugar"])
        if "junk_food" in lifestyle:
            update_data["junk_food_frequency"] = int(lifestyle["junk_food"])
        if "caffeine" in lifestyle:
            update_data["caffeine_intake"] = int(lifestyle["caffeine"])
            
        supabase.table("health_profile").update(update_data).eq("user_id", user_id).execute()
        
        user_res = supabase.table("users").select("*").eq("id", user_id).execute()
        if user_res.data:
            user = user_res.data[0]
            profile_combined = {**profile, **user, **update_data}
            daily_mock = {"stress_level": 3, "sleep_quality": 3, "mood": 3, "water_glasses": 6}
            model_input = build_model_input(profile_combined, daily_mock)
            
            pcos_df = pd.DataFrame([{col: model_input.get(col, 0) for col in pcos_features}]).astype(float)
            pcos_risk = round(float(pcos_model.predict_proba(pcos_df)[0][1]) * 100, 1)
            
            period_df = pd.DataFrame([{col: model_input.get(col, 0) for col in period_features}]).astype(float)
            period_sc = scaler.transform(period_df)
            days_left = max(0, round(float(svr_model.predict(period_sc)[0])))
            next_period = (date.today() + timedelta(days=days_left)).isoformat()
            cycle_phase = get_cycle_phase(model_input["Days_Since_Last_Period"], model_input["Avg_Cycle_Length_days"])
            
            prediction = {
                "user_id": user_id,
                "cycle_phase": cycle_phase,
                "days_until_period": days_left,
                "pcos_risk_score": pcos_risk,
                "next_period_date": next_period
            }
            supabase.table("predictions").upsert(prediction).execute()
            
            formatted = format_prediction_response(user_id, days_left, next_period)
            return jsonify({
                "success": True,
                "cycle_phase": cycle_phase,
                "days_until_period": formatted["days_until_period"],
                "next_period_date": formatted["next_period_date"],
                "pcos_risk_score": pcos_risk
            }), 200
        else:
            return jsonify({"success": True}), 200
            
    except Exception as e:
        print(f"ERROR in tracker_log: {str(e)}")
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)