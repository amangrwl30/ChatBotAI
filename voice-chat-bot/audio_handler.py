import speech_recognition as sr
import wave
import io
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class AudioHandler:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        # Adjust recognition parameters for better sensitivity
        self.recognizer.energy_threshold = 100  # Lower threshold for better sensitivity
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.pause_threshold = 1.0  # Longer pause threshold
        self.recognizer.phrase_threshold = 0.5  # Longer phrase threshold
        logger.info("AudioHandler initialized with adjusted recognition parameters")

    def convert_speech_to_text(self, audio_data):
        try:
            logger.debug(f"Received audio data of length: {len(audio_data)}")

            # Validate audio data
            if not audio_data or len(audio_data) < 16000:  # Less than 1 second of audio at 16kHz
                logger.warning("Audio data too short or empty for recognition")
                return "Could not understand audio"

            # Create WAV file in memory
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, 'wb') as wav_file:
                wav_file.setnchannels(1)  # Mono
                wav_file.setsampwidth(2)  # 16-bit
                wav_file.setframerate(16000)  # 16kHz
                wav_file.writeframes(audio_data)

            wav_buffer.seek(0)
            logger.debug("Created WAV buffer successfully")

            # Convert to AudioData
            audio = sr.AudioData(
                wav_buffer.read(),
                sample_rate=16000,
                sample_width=2
            )
            logger.debug("Converted to AudioData successfully")

            # Try recognition with Google Web Speech API
            try:
                text = self.recognizer.recognize_google(
                    audio,
                    language="en-US",
                    show_all=True  # Get all possible transcriptions
                )

                if isinstance(text, dict) and 'alternative' in text:
                    # Get the most confident transcription
                    best_result = text['alternative'][0]
                    logger.info(f"Recognition successful: {best_result['transcript']}")
                    return best_result['transcript']
                else:
                    logger.warning("No transcription found in response")
                    return "Could not understand audio"

            except sr.UnknownValueError:
                logger.warning("Speech recognition could not understand audio")
                return "Could not understand audio"
            except sr.RequestError as e:
                logger.error(f"Could not request results from speech recognition service: {e}")
                return f"Error: {str(e)}"

        except Exception as e:
            logger.error(f"Unexpected error in speech recognition: {e}")
            return f"Error: {str(e)}"

    def record_audio(self, duration=5):
        try:
            logger.info(f"Starting audio recording for {duration} seconds")

            # Check if microphone is available
            if not sr.Microphone.list_microphone_names():
                logger.error("No microphone found")
                raise Exception("No microphone available")

            with sr.Microphone() as source:
                logger.debug("Adjusting for ambient noise...")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                logger.info("Recording started")
                audio = self.recognizer.listen(source, timeout=duration)
                logger.info("Recording completed")
                return audio.get_raw_data()  # Return raw audio data for processing

        except Exception as e:
            logger.error(f"Error recording audio: {e}")
            raise