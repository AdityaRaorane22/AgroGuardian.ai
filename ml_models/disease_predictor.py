import numpy as np
from tensorflow import keras
from PIL import Image
import json
import os


class DiseasePredictor:
    """
    Uses the uploaded plant_disease_detection.h5 MobileNet model
    """

    def __init__(self, model_path="plant_disease_detection.h5"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")

        # Load model
        self.model = keras.models.load_model(model_path)
        print("✓ Loaded model:", model_path)

        # Load label map (same order as training)
        with open("class_names.json", "r") as f:
            self.idx_to_class = json.load(f)

        # Convert keys from STRING index → CLASS NAME
        self.class_names = [None] * len(self.idx_to_class)
        for cls, idx in self.idx_to_class.items():
            self.class_names[idx] = cls

        print("✓ Loaded", len(self.class_names), "class names")

    def preprocess_image(self, image_path, target_size=(224, 224)):
        """
        Preprocess image for MobileNet input shape (224x224x3)
        """
        img = Image.open(image_path).convert("RGB")
        img = img.resize(target_size)
        img = np.array(img) / 255.0  # Normalize
        img = np.expand_dims(img, axis=0)
        return img

    def predict(self, image_path, known_plant=None):
        """
        Predicts disease. Optionally filters results to a known plant type.
        Set known_plant='Apple' to force prediction to an Apple class.
        """
        try:
            img = self.preprocess_image(image_path)
            # preds is an array of 38 probabilities
            preds = self.model.predict(img, verbose=0)[0]
            
            # --- NEW FILTERING LOGIC ---
            if known_plant:
                known_plant_lower = known_plant.lower()
                
                # 1. Find indices belonging only to the known plant
                valid_indices = [
                    i for i, name in enumerate(self.class_names) 
                    if name.lower().startswith(known_plant_lower)
                ]
                
                # 2. Create a new array, setting non-relevant class probabilities to 0
                filtered_preds = np.zeros_like(preds)
                filtered_preds[valid_indices] = preds[valid_indices]
                
                # Use the filtered array for argmax
                max_preds = filtered_preds
            else:
                # Use original predictions
                max_preds = preds
            # ---------------------------

            idx = int(np.argmax(max_preds))
            confidence = float(max_preds[idx])
            full_class = self.class_names[idx]

            # Split plant & disease names
            parts = full_class.split("___")
            plant = parts[0].replace("_", " ").replace(",", "")
            disease = parts[1].replace("_", " ")

            return {
                "success": True,
                "plant": plant,
                "disease": disease,
                "full_class": full_class,
                "confidence": round(confidence * 100, 2),
                "is_healthy": "healthy" in disease.lower()
            }

        except Exception as e:
            print("🔴 Prediction error:", e)
            return {"success": False, "error": str(e)}