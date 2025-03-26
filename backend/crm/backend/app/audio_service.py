import numpy as np
import sounddevice as sd
import soundfile as sf
from typing import Optional
import io
import base64

class AudioService:
    def __init__(self):
        self.sample_rate = 16000
        self.channels = 1

    def process_audio(self, audio_data: str) -> Optional[str]:
        """
        Process base64 encoded audio data and convert it to text
        """
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data.split(',')[1])
            
            # Convert to numpy array
            audio_np = np.frombuffer(audio_bytes, dtype=np.float32)
            
            # Normalize audio
            audio_np = np.clip(audio_np, -1.0, 1.0)
            
            # Save as temporary WAV file in memory
            wav_buffer = io.BytesIO()
            sf.write(wav_buffer, audio_np, self.sample_rate, format='WAV')
            wav_buffer.seek(0)
            
            # Here you would typically send this to a speech-to-text service
            # For now, we'll return a placeholder
            # You can integrate with services like OpenAI Whisper API here
            return "Audio processed successfully"
            
        except Exception as e:
            print(f"Error processing audio: {e}")
            return None

    def record_audio(self, duration: int = 5) -> Optional[str]:
        """
        Record audio for specified duration
        """
        try:
            # Record audio
            recording = sd.rec(
                int(duration * self.sample_rate),
                samplerate=self.sample_rate,
                channels=self.channels
            )
            sd.wait()
            
            # Convert to base64
            wav_buffer = io.BytesIO()
            sf.write(wav_buffer, recording, self.sample_rate, format='WAV')
            wav_buffer.seek(0)
            
            audio_base64 = base64.b64encode(wav_buffer.read()).decode('utf-8')
            return f"data:audio/wav;base64,{audio_base64}"
            
        except Exception as e:
            print(f"Error recording audio: {e}")
            return None 