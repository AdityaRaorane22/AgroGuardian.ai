"""
Flask Backend API for AgroScan AI
Handles image uploads, disease detection, weather, and AI chat
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import base64
from io import BytesIO
from PIL import Image

from disease_predictor import DiseasePredictor
from weather_forecaster import WeatherForecaster
from disease_climate_data import analyze_weather_risk
from ai_chatbot_with_knowledge import AgriChatbotWithKnowledge

# print("TEST WEATHER:", WeatherForecaster().get_current_weather("Mumbai"))

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize components
try:
    disease_predictor = DiseasePredictor("trained_plant_disease_model.keras")
    weather_forecaster = WeatherForecaster()
    # chatbot = AgriChatbot()
    chatbot = AgriChatbotWithKnowledge()

    print("✓ All components initialized successfully")
except Exception as e:
    print(f"❌ Initialization error: {e}")
    disease_predictor = None
    weather_forecaster = None
    chatbot = None

# Store chat sessions
chat_sessions = {}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "components": {
            "disease_predictor": disease_predictor is not None,
            "weather_forecaster": weather_forecaster is not None,
            "chatbot": chatbot is not None
        }
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_plant():
    """
    Analyze plant image with disease detection and weather risk
    Expects: image file or base64 image, city (optional)
    """
    try:
        # Debug: print incoming request meta to help diagnose missing file issues
        print("---- /api/analyze called ----")
        print("Content-Type:", request.headers.get('Content-Type'))
        print("Request.files keys:", list(request.files.keys()))
        print("Request.form keys:", list(request.form.keys()))

        # quick component availability checks
        if disease_predictor is None:
            return jsonify({"success": False, "error": "Disease model not loaded on server."}), 500
        if weather_forecaster is None:
            return jsonify({"success": False, "error": "Weather forecaster not initialized."}), 500

        city = request.form.get('city', 'Thane')

        filepath = None

        # Accept multiple possible keys for file upload (image, file, photo)
        file_obj = None
        for key in ('image', 'file', 'photo'):
            if key in request.files:
                file_obj = request.files.get(key)
                break

        if file_obj and file_obj.filename:
            if file_obj and allowed_file(file_obj.filename):
                filename = secure_filename(file_obj.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file_obj.save(filepath)
            else:
                return jsonify({"success": False, "error": "Uploaded file has unsupported extension."}), 400

        elif 'imageData' in request.form:
            # Handle base64 image
            image_data = request.form['imageData']
            if ',' in image_data:
                image_data = image_data.split(',')[1]

            image_bytes = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_bytes)).convert('RGB')

            filename = 'upload.jpg'
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(filepath)

        else:
            # No file found - helpful debug response
            print("No image found in request.files or imageData in request.form.")
            return jsonify({"success": False, "error": "No image provided. Please upload with form field named 'image' (multipart/form-data)."}), 400

        # Disease detection
        disease_result = disease_predictor.predict(filepath)

        if not disease_result.get("success", False):
            # Clean up before returning
            try:
                if filepath and os.path.exists(filepath):
                    os.remove(filepath)
            except Exception:
                pass
            return jsonify(disease_result), 400

        # Get weather data
        current_weather = weather_forecaster.get_current_weather(city)
        tomorrow_weather = weather_forecaster.get_tomorrow_weather(city)

        # Risk analysis
        risk_analysis = None
        survival_analysis = None

        if current_weather.get("success"):
            risk_analysis = analyze_weather_risk(
                disease_result['full_class'],
                current_weather.get('description', ''),
                current_weather.get('temperature', 0),
                current_weather.get('humidity', 0)
            )

            # Survival analysis
            survival_analysis = weather_forecaster.analyze_disease_survival(
                disease_result['full_class'],
                city,
                days_ahead=5
            )

        # Clean up uploaded file
        try:
            if filepath and os.path.exists(filepath):
                os.remove(filepath)
        except Exception:
            pass

        return jsonify({
            "success": True,
            "disease": disease_result,
            "weather": {
                "current": current_weather if current_weather.get("success") else None,
                "tomorrow": tomorrow_weather if isinstance(tomorrow_weather, dict) and tomorrow_weather.get("success") else None
            },
            "risk": risk_analysis,
            "survival": survival_analysis if isinstance(survival_analysis, dict) and survival_analysis.get("success") else None
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather data for a city"""
    city = request.args.get('city', 'Thane')
    
    try:
        current = weather_forecaster.get_current_weather(city)
        forecast = weather_forecaster.get_5day_forecast(city)
        
        return jsonify({
            "success": True,
            "current": current,
            "forecast": forecast
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Chat with AI assistant
    Expects: message, sessionId, context (optional)
    """
    try:
        data = request.json
        message = data.get('message')
        session_id = data.get('sessionId', 'default')
        context = data.get('context', {})
        
        if not message:
            return jsonify({
                "success": False,
                "error": "No message provided"
            }), 400
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = AgriChatbotWithKnowledge()
        
        bot = chat_sessions[session_id]
        
        # Get response
        response = bot.chat(message, context)
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/chat/clear', methods=['POST'])
def clear_chat():
    """Clear chat history for a session"""
    data = request.json
    session_id = data.get('sessionId', 'default')
    
    if session_id in chat_sessions:
        chat_sessions[session_id].clear_history()
    
    return jsonify({"success": True, "message": "Chat history cleared"})


@app.route('/api/report', methods=['POST'])
def generate_report():
    """
    Generate comprehensive disease report
    Expects: disease_info, weather_info, risk_info
    """
    try:
        data = request.json
        disease_info = data.get('disease_info')
        weather_info = data.get('weather_info')
        risk_info = data.get('risk_info')
        
        if not all([disease_info, weather_info, risk_info]):
            return jsonify({
                "success": False,
                "error": "Missing required information"
            }), 400
        
        report = chatbot.generate_disease_report(
            disease_info,
            weather_info,
            risk_info
        )
        
        return jsonify(report)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🌱 AgroScan AI Backend Server")
    print("=" * 60)
    print("\nServer starting on http://localhost:5000")
    print("React frontend should connect to this URL")
    print("\nPress Ctrl+C to stop\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)