import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AgriChatbot:
    """
    Conversational AI chatbot using Google Gemini for farmer interactions
    """
    
    # Use the modern, fast, and capable model
    MODEL_NAME = 'gemini-2.5-flash' 
    
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        genai.configure(api_key=api_key)
        
        # System context defines the AI's persona and rules
        self.system_context = (
            "You are AgroScan AI, a helpful agricultural assistant for farmers. "
            "Your role is to: "
            "1. Help farmers understand plant diseases and their treatments "
            "2. Explain weather impacts on crop health "
            "3. Provide actionable farming advice "
            "4. Answer questions about plant care and disease management "
            "5. Be supportive, clear, and use simple language that farmers can understand. "
            "Keep responses concise but informative. Use emojis occasionally to make the conversation friendly. "
            "Always prioritize practical, actionable advice."
        )
        
        # Initialize model with the system instruction
        # FIX: Changed 'model' to 'model_name'
        self.model = genai.GenerativeModel(
            model_name=self.MODEL_NAME, 
            system_instruction=self.system_context
        )
        
        # Conversation history stored in the API's required format
        # [{ "role": "user"|"model", "parts": [{"text": "..."}] }]
        self.chat_history = []
        
        print(f"✓ AgriChatbot initialized with {self.MODEL_NAME} and System Instruction")
    
    def chat(self, user_message: str, context_data: dict = None) -> dict:
        """
        Have a conversation with the farmer.

        Args:
            user_message: The farmer's message.
            context_data: Optional dictionary with disease/weather context 
                          to be prepended to the current user message.
            
        Returns:
            Dictionary containing success status and the AI response text.
        """
        try:
            # 1. Format the auxiliary context data and user message
            full_user_text = self._format_context_message(user_message, context_data)
            
            # 2. Build the full list of contents for the API, including history
            # The current user message is added here as the last item.
            contents = self._create_api_contents(full_user_text)
            
            # 3. Generate response
            response = self.model.generate_content(
                contents=contents
            )
            
            # 4. Store the new exchange in history for the next turn
            self.chat_history.append({
                "role": "user",
                "parts": [{"text": full_user_text}]
            })
            self.chat_history.append({
                "role": "model",
                "parts": [{"text": response.text}]
            })
            
            return {
                "success": True,
                "response": response.text
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": "I'm having trouble connecting right now. Please try again."
            }
    
    def _format_context_message(self, user_message: str, context_data: dict) -> str:
        """
        Prepends the structured context data to the user's raw message.
        The system_instruction already guides the model on how to use this data.
        """
        prompt_parts = []
        
        # Add context if available
        if context_data:
            prompt_parts.append("=== CURRENT CONTEXT DATA ===\n")
            
            if "disease_detection" in context_data:
                disease = context_data["disease_detection"]
                prompt_parts.append(f"Disease Detection: Plant: {disease.get('plant', 'Unknown')}, Disease: {disease.get('disease', 'Unknown')}, Status: {'Healthy' if disease.get('is_healthy') else 'Diseased'}\n")
            
            if "weather_current" in context_data:
                weather = context_data["weather_current"]
                prompt_parts.append(f"Current Weather: Location: {weather.get('city', 'Unknown')}, Temp: {weather.get('temperature', 'N/A')}°C, Humidity: {weather.get('humidity', 'N/A')}%, Condition: {weather.get('description', 'N/A')}\n")
            
            if "risk_analysis" in context_data:
                risk = context_data["risk_analysis"]
                factors = ", ".join(risk.get('factors', []))
                prompt_parts.append(f"Disease Risk: Level: {risk.get('risk', 'Unknown').upper()}. Factors: {factors}\n")
            
            if "survival_analysis" in context_data:
                survival = context_data["survival_analysis"]
                prompt_parts.append(f"Survival Analysis: Safe Days: {survival.get('survival_days', 'Unknown')}, Outlook: {survival.get('outlook', 'Unknown').upper()}\n")
            
            prompt_parts.append("=== END CONTEXT DATA ===\n\n")
        
        prompt_parts.append(f"Farmer's Message: {user_message}")
        
        return "".join(prompt_parts)
    
    def _create_api_contents(self, current_user_text: str) -> list:
        """
        Transforms the stored history and the new message into the Gemini API 'contents' format.
        """
        # Start with historical messages
        contents = self.chat_history.copy()
        
        # Add the current user message
        contents.append({
            "role": "user",
            "parts": [{"text": current_user_text}]
        })
        
        return contents
    
    def clear_history(self):
        """Clear conversation history"""
        self.chat_history = []
        return "Conversation history cleared."
    
    def get_history(self):
        """Get conversation history"""
        return self.chat_history
    
    def generate_disease_report(self, disease_info: dict, weather_info: dict, risk_info: dict) -> dict:
        """
        Generate a comprehensive, non-conversational disease report.
        """
        report_prompt = (
            "Generate a detailed but easy-to-understand, numbered report for a farmer about their crop. "
            "Focus only on the report content, do not add conversational greetings or sign-offs.\n\n"
            f"**Disease Detection:**\n"
            f"- Plant: {disease_info.get('plant', 'N/A')}\n"
            f"- Disease: {disease_info.get('disease', 'N/A')}\n"
            f"- Confidence: {disease_info.get('confidence', 'N/A')}%\n\n"
            f"**Weather Conditions:**\n"
            f"- Temperature: {weather_info.get('temperature', 'N/A')}°C\n"
            f"- Humidity: {weather_info.get('humidity', 'N/A')}%\n"
            f"- Condition: {weather_info.get('description', 'N/A')}\n\n"
            f"**Risk Assessment:**\n"
            f"- Risk Level: {risk_info.get('risk', 'N/A').upper()}\n"
            f"- Message: {risk_info.get('message', 'N/A')}\n\n"
            "Please structure your report clearly with the following sections:\n"
            "1. **Understanding the Disease:** What this disease is and how it affects the plant.\n"
            "2. **Weather Impact:** Why the current/forecasted weather conditions matter for this specific disease.\n"
            "3. **Immediate Action Plan:** Crucial steps the farmer should take right now.\n"
            "4. **Future Prevention:** Long-term measures to prevent recurrence.\n"
        )

        try:
            # Generate response (using the same model, but we can set a different instruction if needed)
            # The system instruction from __init__ still applies, ensuring the persona remains agricultural.
            response = self.model.generate_content(report_prompt)
            return {
                "success": True,
                "report": response.text
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "report": "Failed to generate report due to an API error."
            }

if __name__ == '__main__':
    # Example usage (requires GEMINI_API_KEY in a .env file)
    try:
        chatbot = AgriChatbot()
    except ValueError as e:
        print(f"Error: {e}")
        exit()

    # Example 1: Simple Question
    print("\n--- Example 1: Simple Question ---")
    response = chatbot.chat("Hello AgroScan, what is the best way to water my tomato plants?")
    print(f"AgroScan: {response['response']}")

    # Example 2: Contextual Question (Simulation of a disease detection result)
    print("\n--- Example 2: Contextual Question ---")
    context = {
        "disease_detection": {
            "plant": "Tomato",
            "disease": "Early Blight",
            "confidence": 95,
            "is_healthy": False
        },
        "weather_current": {
            "city": "Farmville",
            "temperature": 28,
            "humidity": 85,
            "description": "Humid and overcast"
        },
        "risk_analysis": {
            "risk": "High",
            "message": "High humidity and warm temperatures significantly accelerate the spread of Early Blight.",
            "factors": ["High humidity", "Warm temperature", "Overcast skies"]
        }
    }
    
    response = chatbot.chat("I got a high risk alert for my tomatoes. What should I do *right now*?", context)
    print(f"AgroScan: {response['response']}")
    
    # Example 3: Full Report Generation
    print("\n--- Example 3: Comprehensive Report ---")
    report_response = chatbot.generate_disease_report(
        disease_info=context["disease_detection"],
        weather_info=context["weather_current"],
        risk_info=context["risk_analysis"]
    )
    if report_response['success']:
        print("\n*** DISEASE MANAGEMENT REPORT ***")
        print(report_response['report'])
    else:
        print(f"Report Error: {report_response['error']}")
        
    print("\n--- Final Chat History ---")
    for msg in chatbot.get_history():
        role = "User" if msg["role"] == "user" else "Model"
        text = msg["parts"][0]["text"].splitlines()[0] # Show only the first line if context was attached
        print(f"[{role}]: {text}...")