"""
AgroScan AI - Agricultural Disease Detection and Advisory System
Main application integrating disease detection, weather forecasting, and AI chatbot
"""

import os
from disease_predictor import DiseasePredictor
from weather_forecaster import WeatherForecaster
from disease_climate_data import analyze_weather_risk
from ai_chatbot import AgriChatbot

class AgroScanApp:
    """
    Main application class coordinating all components
    """
    
    def __init__(self, model_path="plant_disease_model.keras", default_city="Thane"):
        print("=" * 60)
        print("🌱 AgroScan AI - Agricultural Advisory System")
        print("=" * 60)
        print("\nInitializing components...")
        
        # Initialize components
        self.disease_predictor = DiseasePredictor(model_path)
        self.weather_forecaster = WeatherForecaster()
        self.chatbot = AgriChatbot()
        self.default_city = default_city
        
        # Store current analysis
        self.current_disease = None
        self.current_weather = None
        self.current_risk = None
        
        print("\n✓ All systems ready!")
        print("=" * 60)
    
    def analyze_plant_image(self, image_path, city=None):
        """
        Complete analysis pipeline: Disease detection + Weather + Risk assessment
        """
        if city is None:
            city = self.default_city
        
        print(f"\n🔬 Analyzing plant image from {city}...\n")
        
        # Step 1: Detect disease
        print("Step 1: Detecting disease...")
        disease_result = self.disease_predictor.predict(image_path)
        
        if not disease_result["success"]:
            return {
                "success": False,
                "error": f"Disease detection failed: {disease_result['error']}"
            }
        
        self.current_disease = disease_result
        print(f"✓ Detection complete: {disease_result['plant']} - {disease_result['disease']}")
        print(f"  Confidence: {disease_result['confidence']}%")
        
        # Step 2: Get weather
        print("\nStep 2: Fetching weather data...")
        current_weather = self.weather_forecaster.get_current_weather(city)
        tomorrow_weather = self.weather_forecaster.get_tomorrow_weather(city)
        
        if not current_weather["success"]:
            print(f"⚠ Weather fetch failed: {current_weather['error']}")
            return {
                "success": True,
                "disease": disease_result,
                "weather_error": current_weather["error"]
            }
        
        self.current_weather = current_weather
        print(f"✓ Current: {current_weather['temperature']}°C, {current_weather['description']}")
        print(f"✓ Tomorrow: {tomorrow_weather.get('min_temp', 'N/A')}°C - {tomorrow_weather.get('max_temp', 'N/A')}°C")
        
        # Step 3: Risk analysis
        print("\nStep 3: Analyzing disease risk...")
        risk_analysis = analyze_weather_risk(
            disease_result['full_class'],
            current_weather['description'],
            current_weather['temperature'],
            current_weather['humidity']
        )
        
        self.current_risk = risk_analysis
        print(f"✓ Risk Level: {risk_analysis['risk'].upper()}")
        print(f"  {risk_analysis['message']}")
        
        # Step 4: Survival analysis
        print("\nStep 4: Calculating survival outlook...")
        survival_analysis = self.weather_forecaster.analyze_disease_survival(
            disease_result['full_class'],
            city,
            days_ahead=5
        )
        
        if survival_analysis["success"]:
            print(f"✓ Estimated safe days: {survival_analysis['survival_days']}")
            print(f"  Outlook: {survival_analysis['outlook'].upper()}")
        
        # Complete result
        result = {
            "success": True,
            "disease": disease_result,
            "current_weather": current_weather,
            "tomorrow_weather": tomorrow_weather,
            "risk_analysis": risk_analysis,
            "survival_analysis": survival_analysis
        }
        
        print("\n" + "=" * 60)
        print("📊 ANALYSIS COMPLETE")
        print("=" * 60)
        
        return result
    
    def chat_with_farmer(self, message):
        """
        Chat with the farmer using current context
        """
        # Build context from current analysis
        context = {}
        
        if self.current_disease:
            context["disease_detection"] = self.current_disease
        
        if self.current_weather:
            context["weather_current"] = self.current_weather
        
        if self.current_risk:
            context["risk_analysis"] = self.current_risk
        
        # Get AI response
        return self.chatbot.chat(message, context)
    
    def generate_full_report(self):
        """
        Generate a comprehensive report using AI
        """
        if not all([self.current_disease, self.current_weather, self.current_risk]):
            return {
                "success": False,
                "error": "No analysis data available. Please analyze an image first."
            }
        
        print("\n📝 Generating comprehensive report...")
        
        report = self.chatbot.generate_disease_report(
            self.current_disease,
            self.current_weather,
            self.current_risk
        )
        
        if report["success"]:
            print("\n" + "=" * 60)
            print("📋 DISEASE MANAGEMENT REPORT")
            print("=" * 60)
            print(report["report"])
            print("=" * 60)
        
        return report
    
    def interactive_mode(self):
        """
        Interactive command-line interface
        """
        print("\n🌾 Welcome to AgroScan AI Interactive Mode!")
        print("\nCommands:")
        print("  'analyze <image_path>' - Analyze a plant image")
        print("  'chat <message>' - Chat with AI assistant")
        print("  'report' - Generate full report")
        print("  'clear' - Clear chat history")
        print("  'quit' or 'exit' - Exit the program")
        print("\n")
        
        while True:
            try:
                user_input = input("🌱 You: ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.lower() in ['quit', 'exit']:
                    print("\n👋 Thank you for using AgroScan AI!")
                    break
                
                elif user_input.lower() == 'clear':
                    self.chatbot.clear_history()
                    print("✓ Chat history cleared")
                
                elif user_input.lower() == 'report':
                    self.generate_full_report()
                
                elif user_input.lower().startswith('analyze '):
                    image_path = user_input[8:].strip()
                    if os.path.exists(image_path):
                        result = self.analyze_plant_image(image_path)
                        if result["success"]:
                            print("\n💬 Ask me anything about this analysis!")
                    else:
                        print(f"❌ Image not found: {image_path}")
                
                elif user_input.lower().startswith('chat '):
                    message = user_input[5:].strip()
                    response = self.chat_with_farmer(message)
                    if response["success"]:
                        print(f"\n🤖 AgroScan AI: {response['response']}\n")
                    else:
                        print(f"❌ Error: {response['error']}")
                
                else:
                    # Treat everything else as a chat message
                    response = self.chat_with_farmer(user_input)
                    if response["success"]:
                        print(f"\n🤖 AgroScan AI: {response['response']}\n")
                    else:
                        print(f"❌ Error: {response['error']}")
                
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")


def main():
    """
    Main entry point
    """
    # Check for model file
    model_path = "trained_plant_disease_model.keras"
    
    if not os.path.exists(model_path):
        print(f"❌ Model file not found: {model_path}")
        print("Please ensure the .keras model file is in the current directory.")
        return
    
    # Initialize app
    try:
        app = AgroScanApp(model_path=model_path, default_city="Thane")
        
        # Run interactive mode
        app.interactive_mode()
        
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")


if __name__ == "__main__":
    main()