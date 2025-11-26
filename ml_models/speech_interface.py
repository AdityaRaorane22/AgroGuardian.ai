"""
Speech-to-Text interface for AgroScan AI
Allows farmers to interact using voice commands
"""

import sounddevice as sd
import numpy as np
import whisper
from main import AgroScanApp

class VoiceInterface:
    """
    Voice-enabled interface for AgroScan AI
    """
    
    def __init__(self, model_size="small", sample_rate=16000):
        print("\n🎤 Initializing Voice Interface...")
        
        self.sample_rate = sample_rate
        
        # Load Whisper model
        print(f"Loading Whisper model: {model_size}...")
        self.whisper_model = whisper.load_model(model_size)
        print("✓ Speech recognition ready")
        
        # Initialize AgroScan app
        self.app = AgroScanApp()
        
        print("✓ Voice interface ready!\n")
    
    def record_audio(self):
        """
        Record audio from microphone until user stops
        """
        print("\n🎤 Press ENTER to START recording...")
        input()
        print("⏺  Recording... Press ENTER to STOP.")
        
        audio_data = []
        
        def callback(indata, frames, time, status):
            if status:
                print(f"Status: {status}")
            audio_data.append(indata.copy())
        
        # Open microphone stream
        with sd.InputStream(samplerate=self.sample_rate, channels=1, callback=callback):
            input()  # Wait for Enter to stop
        
        if len(audio_data) == 0:
            print("❌ No audio captured. Please try again.")
            return None
        
        # Combine audio chunks
        audio_np = np.concatenate(audio_data, axis=0)
        print("✓ Audio recorded")
        
        return audio_np
    
    def transcribe_audio(self, audio_np):
        """
        Transcribe audio to text using Whisper
        """
        # Flatten and convert to float32
        audio = audio_np.flatten().astype(np.float32)
        
        # Normalize if needed
        if audio.max() > 1:
            audio = audio / 32768.0
        
        # Transcribe
        print("⏳ Transcribing speech...")
        result = self.whisper_model.transcribe(audio, fp16=False)
        
        return result["text"]
    
    def process_voice_command(self, text):
        """
        Process transcribed text as a command
        """
        text_lower = text.lower().strip()
        
        # Check for image analysis command
        if "analyze" in text_lower and ("image" in text_lower or "photo" in text_lower):
            print("\n📷 Please provide the image path:")
            image_path = input("Path: ").strip()
            
            if image_path:
                return self.app.analyze_plant_image(image_path)
            else:
                print("❌ No image path provided")
                return None
        
        # Check for report generation
        elif "report" in text_lower or "full report" in text_lower:
            return self.app.generate_full_report()
        
        # Check for exit commands
        elif any(word in text_lower for word in ["exit", "quit", "goodbye", "bye"]):
            return {"exit": True}
        
        # Otherwise, treat as chat
        else:
            return self.app.chat_with_farmer(text)
    
    def run_voice_mode(self):
        """
        Run the voice interaction loop
        """
        print("\n" + "=" * 60)
        print("🎤 VOICE MODE ACTIVE")
        print("=" * 60)
        print("\nYou can:")
        print("  - Ask questions about plant diseases")
        print("  - Say 'analyze image' to scan a plant photo")
        print("  - Say 'generate report' for a full analysis")
        print("  - Say 'exit' or 'quit' to stop")
        print("\n")
        
        while True:
            try:
                # Record audio
                audio = self.record_audio()
                
                if audio is None:
                    continue
                
                # Transcribe
                text = self.transcribe_audio(audio)
                
                print(f"\n📝 You said: \"{text}\"")
                
                # Process command
                result = self.process_voice_command(text)
                
                if result and isinstance(result, dict):
                    if result.get("exit"):
                        print("\n👋 Goodbye!")
                        break
                    
                    if result.get("success"):
                        if "response" in result:
                            print(f"\n🤖 AgroScan AI: {result['response']}\n")
                        elif "disease" in result:
                            print("\n✓ Analysis complete! Say 'generate report' for details.")
                        elif "report" in result:
                            print("\n✓ Report generated!")
                
                print("\nReady for next command...")
                
            except KeyboardInterrupt:
                print("\n\n👋 Voice mode stopped")
                break
            except Exception as e:
                print(f"❌ Error: {e}")


def main():
    """
    Main entry point for voice interface
    """
    try:
        voice_interface = VoiceInterface()
        voice_interface.run_voice_mode()
        
    except Exception as e:
        print(f"❌ Failed to initialize voice interface: {e}")
        print("\nMake sure you have:")
        print("  1. sounddevice installed: pip install sounddevice")
        print("  2. whisper installed: pip install openai-whisper")
        print("  3. A working microphone connected")


if __name__ == "__main__":
    main()