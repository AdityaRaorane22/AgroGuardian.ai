"""
Disease climate data extracted from your CSV
Maps diseases to their favorable climate conditions
"""

DISEASE_CLIMATE_DATA = {
    "Apple___Apple_scab": {
        "f1_score": 0.91,
        "climate": "Cool & Wet (Spring)",
        "key_factors": "Rain, long periods of leaf wetness",
        "worsening_conditions": ["rain", "wet", "humidity"],
        "safe_conditions": ["dry", "warm"]
    },
    "Apple___Black_rot": {
        "f1_score": 0.97,
        "climate": "Warm & Wet",
        "key_factors": "High humidity, rain, warm temperatures",
        "worsening_conditions": ["rain", "humidity", "warm"],
        "safe_conditions": ["dry", "cool"]
    },
    "Apple___Cedar_apple_rust": {
        "f1_score": 0.97,
        "climate": "Wet (Spring/Early Summer)",
        "key_factors": "Rain for spore transfer",
        "worsening_conditions": ["rain", "wet"],
        "safe_conditions": ["dry"]
    },
    "Apple___healthy": {
        "f1_score": 0.89,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Blueberry___healthy": {
        "f1_score": 0.92,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "f1_score": 0.94,
        "climate": "Warm, Humid, & Shady",
        "key_factors": "High humidity, but not free water",
        "worsening_conditions": ["humidity", "warm", "shade"],
        "safe_conditions": ["dry", "sunny"]
    },
    "Cherry_(including_sour)___healthy": {
        "f1_score": 0.96,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot": {
        "f1_score": 0.92,
        "climate": "Warm & Humid",
        "key_factors": "High humidity, moderate to high temperatures",
        "worsening_conditions": ["humidity", "warm"],
        "safe_conditions": ["dry", "cool"]
    },
    "Corn_(maize)___Common_rust_": {
        "f1_score": 0.99,
        "climate": "Cool & Wet",
        "key_factors": "Dew, cool nights, moderate days",
        "worsening_conditions": ["dew", "cool", "wet"],
        "safe_conditions": ["dry", "warm"]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "f1_score": 0.94,
        "climate": "Cool & Wet",
        "key_factors": "High humidity, moderate temperatures (18C to 26C)",
        "worsening_conditions": ["humidity", "cool", "wet"],
        "safe_conditions": ["dry", "warm"]
    },
    "Corn_(maize)___healthy": {
        "f1_score": 0.99,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Grape___Black_rot": {
        "f1_score": 0.97,
        "climate": "Warm & Wet",
        "key_factors": "Rain, temperatures over 10C",
        "worsening_conditions": ["rain", "warm", "wet"],
        "safe_conditions": ["dry", "cool"]
    },
    "Grape___Esca_(Black_Measles)": {
        "f1_score": 0.98,
        "climate": "N/A (Wood disease)",
        "key_factors": "High temperatures may increase symptoms",
        "worsening_conditions": ["warm", "hot"],
        "safe_conditions": ["cool"]
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "f1_score": 0.98,
        "climate": "Warm & Wet",
        "key_factors": "Rain, high humidity",
        "worsening_conditions": ["rain", "humidity", "warm"],
        "safe_conditions": ["dry"]
    },
    "Grape___healthy": {
        "f1_score": 0.99,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "f1_score": 0.96,
        "climate": "Warm (Vector spread)",
        "key_factors": "Warm conditions favor the insect vector (psyllid)",
        "worsening_conditions": ["warm"],
        "safe_conditions": ["cool"]
    },
    "Peach___Bacterial_spot": {
        "f1_score": 0.93,
        "climate": "Warm & Wet",
        "key_factors": "Rain, wind, high temperatures (24C to 30C)",
        "worsening_conditions": ["rain", "warm", "wind"],
        "safe_conditions": ["dry", "cool"]
    },
    "Peach___healthy": {
        "f1_score": 0.96,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Pepper,_bell___Bacterial_spot": {
        "f1_score": 0.93,
        "climate": "Warm & Wet",
        "key_factors": "Rain, high humidity",
        "worsening_conditions": ["rain", "humidity", "warm"],
        "safe_conditions": ["dry"]
    },
    "Pepper,_bell___healthy": {
        "f1_score": 0.89,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Potato___Early_blight": {
        "f1_score": 0.96,
        "climate": "Warm & Wet",
        "key_factors": "High temperatures (24C to 29C), leaf wetness",
        "worsening_conditions": ["warm", "wet", "humidity"],
        "safe_conditions": ["dry", "cool"]
    },
    "Potato___Late_blight": {
        "f1_score": 0.94,
        "climate": "Cool & Wet",
        "key_factors": "Long periods of 100% humidity, cool temperatures (10C to 20C)",
        "worsening_conditions": ["cool", "wet", "humidity"],
        "safe_conditions": ["dry", "warm"]
    },
    "Potato___healthy": {
        "f1_score": 0.94,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Raspberry___healthy": {
        "f1_score": 0.94,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Soybean___healthy": {
        "f1_score": 0.97,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Squash___Powdery_mildew": {
        "f1_score": 0.96,
        "climate": "Warm, Humid, & Shady",
        "key_factors": "High humidity, but not free water",
        "worsening_conditions": ["humidity", "warm"],
        "safe_conditions": ["dry"]
    },
    "Strawberry___Leaf_scorch": {
        "f1_score": 0.96,
        "climate": "Wet",
        "key_factors": "High humidity, frequent rainfall",
        "worsening_conditions": ["rain", "humidity", "wet"],
        "safe_conditions": ["dry"]
    },
    "Strawberry___healthy": {
        "f1_score": 0.98,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    },
    "Tomato___Bacterial_spot": {
        "f1_score": 0.96,
        "climate": "Warm & Wet",
        "key_factors": "High heat and high moisture (24C to 30C)",
        "worsening_conditions": ["warm", "humidity", "wet"],
        "safe_conditions": ["dry"]
    },
    "Tomato___Early_blight": {
        "f1_score": 0.87,
        "climate": "Warm & Wet",
        "key_factors": "High temperatures (24C to 29C), leaf wetness",
        "worsening_conditions": ["warm", "wet", "humidity"],
        "safe_conditions": ["dry", "cool"]
    },
    "Tomato___Late_blight": {
        "f1_score": 0.89,
        "climate": "Cool & Wet",
        "key_factors": "Long periods of 100% humidity, cool temperatures (10C to 20C)",
        "worsening_conditions": ["cool", "wet", "humidity"],
        "safe_conditions": ["dry", "warm"]
    },
    "Tomato___Leaf_Mold": {
        "f1_score": 0.96,
        "climate": "Warm & High Humidity",
        "key_factors": "Poor air circulation, high humidity",
        "worsening_conditions": ["humidity", "warm"],
        "safe_conditions": ["dry", "ventilated"]
    },
    "Tomato___Septoria_leaf_spot": {
        "f1_score": 0.88,
        "climate": "Warm & Wet",
        "key_factors": "Moderate temperatures (20C to 25C), rain/splash",
        "worsening_conditions": ["warm", "rain", "wet"],
        "safe_conditions": ["dry"]
    },
    "Tomato___Spider_mites_Two-spotted_spider_mite": {
        "f1_score": 0.93,
        "climate": "Hot & Dry",
        "key_factors": "Drought conditions, low humidity",
        "worsening_conditions": ["hot", "dry"],
        "safe_conditions": ["cool", "humid"]
    },
    "Tomato___Target_Spot": {
        "f1_score": 0.90,
        "climate": "Warm & Wet",
        "key_factors": "High temperatures, high humidity",
        "worsening_conditions": ["warm", "humidity", "wet"],
        "safe_conditions": ["dry"]
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "f1_score": 0.99,
        "climate": "Hot & Dry (Vector spread)",
        "key_factors": "High temperatures favor the insect vector (Whitefly)",
        "worsening_conditions": ["hot", "dry"],
        "safe_conditions": ["cool"]
    },
    "Tomato___Tomato_mosaic_virus": {
        "f1_score": 0.95,
        "climate": "N/A (Mechanical transfer)",
        "key_factors": "Virus not highly climate dependent, but stress worsens symptoms",
        "worsening_conditions": ["stress"],
        "safe_conditions": ["stable"]
    },
    "Tomato___healthy": {
        "f1_score": 0.98,
        "climate": "N/A (Favored by Dry)",
        "key_factors": "N/A",
        "worsening_conditions": [],
        "safe_conditions": ["dry"]
    }
}


def get_disease_info(disease_class):
    """
    Get climate information for a specific disease
    
    Args:
        disease_class: Full class name (e.g., "Tomato___Early_blight")
        
    Returns:
        Dictionary with disease climate information
    """
    return DISEASE_CLIMATE_DATA.get(disease_class, None)


def analyze_weather_risk(disease_class, weather_condition, temperature, humidity):
    """
    Analyze if weather conditions will worsen the disease
    
    Args:
        disease_class: Full disease class name
        weather_condition: Weather description (e.g., "Rain", "Clear")
        temperature: Temperature in Celsius
        humidity: Humidity percentage
        
    Returns:
        Dictionary with risk analysis
    """
    disease_info = get_disease_info(disease_class)
    
    if not disease_info:
        return {"risk": "unknown", "message": "Disease information not available"}
    
    # If healthy, return favorable conditions
    if "healthy" in disease_class.lower():
        return {
            "risk": "low",
            "message": "Plant is healthy. Maintain good practices.",
            "recommendation": "Keep plants dry and well-ventilated"
        }
    
    # Check worsening conditions
    risk_score = 0
    risk_factors = []
    
    weather_lower = weather_condition.lower()
    worsening = disease_info["worsening_conditions"]
    
    # Check weather conditions
    if any(cond in weather_lower for cond in ["rain", "drizzle", "shower"]):
        if "rain" in worsening or "wet" in worsening:
            risk_score += 2
            risk_factors.append("Rainfall will increase disease spread")
    
    # Check humidity
    if humidity > 80 and "humidity" in worsening:
        risk_score += 2
        risk_factors.append(f"High humidity ({humidity}%) favors disease")
    
    # Check temperature ranges
    if temperature > 24 and "warm" in worsening:
        risk_score += 1
        risk_factors.append("Warm temperatures favor disease development")
    elif temperature < 20 and "cool" in worsening:
        risk_score += 1
        risk_factors.append("Cool temperatures favor disease development")
    elif temperature > 30 and "hot" in worsening:
        risk_score += 2
        risk_factors.append("Hot conditions favor disease/pest activity")
    
    # Determine risk level
    if risk_score >= 4:
        risk_level = "high"
        message = "⚠️ HIGH RISK: Weather conditions strongly favor disease progression"
    elif risk_score >= 2:
        risk_level = "moderate"
        message = "⚡ MODERATE RISK: Some weather conditions may worsen disease"
    else:
        risk_level = "low"
        message = "✓ LOW RISK: Weather conditions are relatively favorable"
    
    return {
        "risk": risk_level,
        "risk_score": risk_score,
        "message": message,
        "factors": risk_factors,
        "disease_climate": disease_info["climate"],
        "key_factors": disease_info["key_factors"]
    }