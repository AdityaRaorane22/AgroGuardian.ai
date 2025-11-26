import os
import requests
from datetime import datetime, timedelta
from collections import Counter
from dotenv import load_dotenv

load_dotenv()

class WeatherForecaster:
    """
    Enhanced weather forecasting for agricultural analysis
    """
    
    def __init__(self):
        self.api_key = os.getenv("WHETHER_API_KEY")
        if not self.api_key:
            raise ValueError("API_KEY not found in .env file")
    
    def get_current_weather(self, city_name):
        """
        Fetch current weather for a city
        """
        base_url = "https://api.openweathermap.org/data/2.5/weather"
        
        params = {
            "q": city_name,
            "appid": self.api_key,
            "units": "metric"
        }
        
        try:
            response = requests.get(base_url, params=params)
            data = response.json()
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "city": data["name"],
                    "temperature": round(data["main"]["temp"], 1),
                    "feels_like": round(data["main"]["feels_like"], 1),
                    "humidity": data["main"]["humidity"],
                    "wind_speed": data["wind"]["speed"],
                    "description": data["weather"][0]["description"].title(),
                    "main": data["weather"][0]["main"]
                }
            else:
                return {
                    "success": False,
                    "error": data.get("message", "Unknown error")
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_5day_forecast(self, city_name):
        """
        Get 5-day forecast with 3-hour intervals
        """
        base_url = "https://api.openweathermap.org/data/2.5/forecast"
        
        params = {
            "q": city_name,
            "appid": self.api_key,
            "units": "metric"
        }
        
        try:
            response = requests.get(base_url, params=params)
            data = response.json()
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": data.get("message", "Unknown error")
                }
            
            # Process forecast data by day
            daily_forecasts = {}
            
            for forecast in data.get('list', []):
                forecast_dt = datetime.fromtimestamp(forecast['dt'])
                date_str = forecast_dt.strftime('%Y-%m-%d')
                
                if date_str not in daily_forecasts:
                    daily_forecasts[date_str] = {
                        "temps": [],
                        "humidity": [],
                        "descriptions": [],
                        "rain": []
                    }
                
                daily_forecasts[date_str]["temps"].append(forecast['main']['temp'])
                daily_forecasts[date_str]["humidity"].append(forecast['main']['humidity'])
                daily_forecasts[date_str]["descriptions"].append(
                    forecast['weather'][0]['description'].title()
                )
                
                # Check for rain
                if 'rain' in forecast:
                    daily_forecasts[date_str]["rain"].append(
                        forecast['rain'].get('3h', 0)
                    )
            
            # Aggregate daily data
            result = {
                "success": True,
                "city": data["city"]["name"],
                "forecasts": []
            }
            
            for date_str in sorted(daily_forecasts.keys()):
                day_data = daily_forecasts[date_str]
                primary_condition = Counter(day_data["descriptions"]).most_common(1)[0][0]
                
                result["forecasts"].append({
                    "date": date_str,
                    "min_temp": round(min(day_data["temps"]), 1),
                    "max_temp": round(max(day_data["temps"]), 1),
                    "avg_temp": round(sum(day_data["temps"]) / len(day_data["temps"]), 1),
                    "avg_humidity": round(sum(day_data["humidity"]) / len(day_data["humidity"]), 1),
                    "condition": primary_condition,
                    "will_rain": len(day_data["rain"]) > 0,
                    "total_rain_mm": round(sum(day_data["rain"]), 1) if day_data["rain"] else 0
                })
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_tomorrow_weather(self, city_name):
        """
        Get specifically tomorrow's weather forecast
        """
        forecast_data = self.get_5day_forecast(city_name)
        
        if not forecast_data["success"]:
            return forecast_data
        
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        for day in forecast_data["forecasts"]:
            if day["date"] == tomorrow:
                return {
                    "success": True,
                    "city": forecast_data["city"],
                    **day
                }
        
        return {
            "success": False,
            "error": "Tomorrow's forecast not available"
        }
    
    def analyze_disease_survival(self, disease_class, city_name, days_ahead=5):
        """
        Analyze how many days the plant can survive given weather conditions
        and disease state
        
        Args:
            disease_class: Full disease class name
            city_name: City for weather forecast
            days_ahead: Number of days to analyze
            
        Returns:
            Survival analysis with recommendations
        """
        from disease_climate_data import analyze_weather_risk
        
        forecast = self.get_5day_forecast(city_name)
        
        if not forecast["success"]:
            return {
                "success": False,
                "error": forecast["error"]
            }
        
        # Analyze each day
        daily_risks = []
        high_risk_days = 0
        
        for day in forecast["forecasts"][:days_ahead]:
            risk_analysis = analyze_weather_risk(
                disease_class,
                day["condition"],
                day["avg_temp"],
                day["avg_humidity"]
            )
            
            daily_risks.append({
                "date": day["date"],
                "risk": risk_analysis["risk"],
                "risk_score": risk_analysis.get("risk_score", 0),
                "temp": day["avg_temp"],
                "humidity": day["avg_humidity"],
                "condition": day["condition"],
                "factors": risk_analysis.get("factors", [])
            })
            
            if risk_analysis["risk"] == "high":
                high_risk_days += 1
        
        # Determine survival outlook
        if "healthy" in disease_class.lower():
            survival_days = days_ahead
            outlook = "excellent"
            message = "Plant is healthy and should thrive in current conditions"
        elif high_risk_days >= 3:
            survival_days = 2
            outlook = "critical"
            message = "Disease will likely worsen significantly. Immediate treatment needed!"
        elif high_risk_days >= 1:
            survival_days = 4
            outlook = "concerning"
            message = "Some unfavorable conditions ahead. Monitor closely and treat if possible."
        else:
            survival_days = days_ahead
            outlook = "stable"
            message = "Weather conditions are relatively favorable. Continue current treatment."
        
        return {
            "success": True,
            "city": forecast["city"],
            "disease": disease_class,
            "survival_days": survival_days,
            "outlook": outlook,
            "message": message,
            "high_risk_days": high_risk_days,
            "daily_risks": daily_risks,
            "recommendation": self._get_recommendations(disease_class, daily_risks)
        }
    
    def _get_recommendations(self, disease_class, daily_risks):
        """
        Generate actionable recommendations based on forecast
        """
        recommendations = []
        
        # Check for rain
        has_rain = any("rain" in risk["condition"].lower() for risk in daily_risks)
        high_humidity = any(risk["humidity"] > 80 for risk in daily_risks)
        
        if "healthy" in disease_class.lower():
            recommendations.append("✓ Continue regular monitoring and good practices")
            if has_rain or high_humidity:
                recommendations.append("⚠ Wet conditions ahead - ensure good drainage")
        else:
            if has_rain:
                recommendations.append("🌧 Rain expected - consider protective covering if possible")
            
            if high_humidity:
                recommendations.append("💧 High humidity ahead - improve air circulation")
            
            if any(risk["risk"] == "high" for risk in daily_risks):
                recommendations.append("🚨 Apply fungicide/treatment IMMEDIATELY")
                recommendations.append("🔍 Inspect plants daily for disease progression")
            
            recommendations.append("📋 Remove and destroy infected plant material")
        return recommendations