# ai_chatbot_with_knowledge.py
import os
import google.generativeai as genai
from dotenv import load_dotenv
from disease_climate_data import DISEASE_CLIMATE_DATA, get_disease_info

load_dotenv()

class AgriChatbotWithKnowledge:
    """
    AgriChatbot that preloads disease->climate facts into the system instruction
    so Gemini can use them during conversation with farmers.
    """
    MODEL_NAME = 'gemini-2.5-flash'

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")

        genai.configure(api_key=api_key)

        # Build a short, precise knowledge summary from DISEASE_CLIMATE_DATA
        knowledge_lines = []
        # include only the most relevant fields to keep prompt compact
        for cls, info in DISEASE_CLIMATE_DATA.items():
            # Sanitize class name for readability (e.g., "Tomato___Late_blight" -> "Tomato: Late blight")
            parts = cls.split("___")
            plant = parts[0].replace("_", " ").replace(",", "")
            disease = parts[1].replace("_", " ").replace("  ", " ") if len(parts) > 1 else "healthy"
            climate = info.get("climate", "N/A")
            key = info.get("key_factors", "N/A")
            knowledge_lines.append(f"{plant} — {disease}: Climate: {climate}. Key factors: {key}.")
            # limit knowledge size (optional) - but keep all for now

        knowledge_snippet = " | ".join(knowledge_lines)

        # Compose system instruction with persona + knowledge snippet
        self.system_context = (
    "You are AgroScan AI, a practical agricultural assistant for smallholder farmers. "
    "You must: give short, actionable guidance, explain weather effects on diseases, "
    "and produce steps the farmer can follow. Avoid long technical jargon. Use emojis occasionally "
    "to be friendly. If the user gives an image analysis + weather context, use that data "
    "and the knowledge below to reason about next steps.\n\n"

    "IMPORTANT: If weather_current exists in context_data, ALWAYS answer using it. Never say you lack weather data."
    "weather-related questions. Never say you don't have access to real-time weather. "
    "The provided weather_current data IS the real weather and must always be used in responses.\n\n"

    "Important knowledge (crop — disease — climate):\n"
    f"{knowledge_snippet}\n\n"

    "When you respond, always: 1) State the likely problem in 1 sentence; "
    "2) Give immediate actions in bullet points; 3) Give an outlook (safe days) if available."
)

        # Initialize model
        self.model = genai.GenerativeModel(
            model_name=self.MODEL_NAME,
            system_instruction=self.system_context
        )

        self.chat_history = []
        print("✓ AgriChatbotWithKnowledge initialized (knowledge injected)")

    def clean_text(self, text: str) -> str:
        """
        Remove markdown (**bold**, *italic*, ### headings) and convert to clean plain text.
        """
        import re

        # remove bold/italic markers
        text = re.sub(r"\*\*\*(.*?)\*\*\*", r"\1", text)
        text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
        text = re.sub(r"\*(.*?)\*", r"\1", text)

        # remove markdown headers (### ## #)
        text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)

        # replace markdown bullet points with simple dot
        text = re.sub(r"^[\-\*]\s+", "• ", text, flags=re.MULTILINE)

        # collapse multiple blank lines
        text = re.sub(r"\n\s*\n", "\n", text)

        return text.strip()

    def chat(self, user_message: str, context_data: dict = None) -> dict:
        try:
            # Ensure context_data exists
            if not context_data:
                context_data = {}

            # 🚀 AUTO-FETCH WEATHER IF MISSING
            if "weather_current" not in context_data or not context_data["weather_current"]:
                try:
                    from weather_forecaster import WeatherForecaster
                    wf = WeatherForecaster()
                    auto_weather = wf.get_current_weather("Thane")   # default city, or dynamic
                    if auto_weather.get("success"):
                        context_data["weather_current"] = auto_weather
                except Exception as werr:
                    print("Weather auto-fetch failed:", werr)

            # Format system contextual message
            full_user_text = self._format_context_message(user_message, context_data)
            contents = self._create_api_contents(full_user_text)

            response = self.model.generate_content(contents=contents)
            raw_text = response.text


            cleaned = self.clean_text(raw_text)

            self.chat_history.append({
                "role": "user",
                "parts": [{"text": full_user_text}]
            })
            self.chat_history.append({
                "role": "model",
                "parts": [{"text": response.text}]
            })

            return {"success": True, "response": cleaned}

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "response": "Error connecting to Gemini."
            }

    def _format_context_message(self, user_message: str, context_data: dict) -> str:
        # adopt the same format your app expects so the backend can pass context unchanged
        prompt_parts = []
        if context_data:
            prompt_parts.append("=== CURRENT CONTEXT DATA ===\n")
            if "disease_detection" in context_data:
                disease = context_data["disease_detection"]
                prompt_parts.append(f"Disease Detection: Plant: {disease.get('plant','Unknown')}, Disease: {disease.get('disease','Unknown')}, Confidence: {disease.get('confidence','N/A')}%\n")
                # Also append climate-known info for this disease (if exists) to highlight to model
                if disease.get("full_class"):
                    di = get_disease_info(disease["full_class"])
                    if di:
                        prompt_parts.append(f"Knowledge: Climate: {di.get('climate')}. Key factors: {di.get('key_factors')}.\n")
            if "weather_current" in context_data:
                weather = context_data["weather_current"]
                prompt_parts.append(f"Current Weather: Location: {weather.get('city','Unknown')}, Temp: {weather.get('temperature','N/A')}°C, Humidity: {weather.get('humidity','N/A')}%, Condition: {weather.get('description','N/A')}\n")
            if "risk_analysis" in context_data:
                risk = context_data["risk_analysis"]
                factors = ", ".join(risk.get('factors', []))
                prompt_parts.append(f"Disease Risk: Level: {risk.get('risk','Unknown').upper()}. Factors: {factors}\n")
            if "survival_analysis" in context_data:
                survival = context_data["survival_analysis"]
                prompt_parts.append(f"Survival Analysis: Safe Days: {survival.get('survival_days','Unknown')}, Outlook: {survival.get('outlook','Unknown').upper()}\n")
            prompt_parts.append("=== END CONTEXT DATA ===\n\n")
        prompt_parts.append(f"Farmer's Message: {user_message}")
        return "".join(prompt_parts)

    def _create_api_contents(self, current_user_text: str) -> list:
        contents = self.chat_history.copy()
        contents.append({
            "role": "user",
            "parts": [{"text": current_user_text}]
        })
        return contents

    def clear_history(self):
        self.chat_history = []
        return "Cleared"

    def get_history(self):
        return self.chat_history

# Example usage (only for local testing)
if __name__ == "__main__":
    bot = AgriChatbotWithKnowledge()
    print(bot.chat("What should I do for tomato early blight given humid weather?", {
        "disease_detection": {"plant": "Tomato", "disease": "Early blight", "confidence": 92, "full_class": "Tomato___Early_blight"},
        "weather_current": {"city": "Thane", "temperature": 28, "humidity": 88, "description": "Light rain"}
    }))
