import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import LimitPopup from "./LimitPopup";
import WarningPopup from "./WarningPopup";

const AudioChatbot = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([{ type: "bot", content: "Welcome to the AI Voice Chatbot! Hi, I am your voice chatbot. How can I assist you today?", timestamp: new Date() }]);
    const [isPlaying, setIsPlaying] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);
    const [totalAudioTime, setTotalAudioTime] = useState(0);
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const silenceStartRef = useRef(null);
    const warningShownRef = useRef(false);
    const MAX_AUDIO_TIME = 300;
    const MAX_SINGLE_AUDIO_TIME = 30; // 30 seconds limit for a single recording
    const SILENCE_THRESHOLD = 0.05; // Adjust this threshold value as needed
    const SILENCE_TIMEOUT = 2000; // 2 seconds
    const audioRefs = useRef({});  // Add this to store audio elements

    useEffect(() => {
        // Scroll to the bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (MAX_AUDIO_TIME - totalAudioTime <= 60 && !warningShownRef.current) {
            setShowWarningPopup(true);
            warningShownRef.current = true;
        }
    }, [totalAudioTime]);

    const checkAudioLimit = (currentTime) => {
        const newTotalTime = totalAudioTime + currentTime;
        if (newTotalTime >= MAX_AUDIO_TIME) {
            setShowLimitPopup(true);
            return false;
        }
        return true;
    };

    const startRecording = () => {
        // Check limit before starting recording
        if (totalAudioTime >= MAX_AUDIO_TIME) {
            setShowLimitPopup(true);
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                let startTime = Date.now();

                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                analyserRef.current = audioContextRef.current.createAnalyser();
                source.connect(analyserRef.current);

                const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                analyserRef.current.connect(scriptProcessor);

                silenceStartRef.current = null;

                scriptProcessor.onaudioprocess = (event) => {
                    const inputData = event.inputBuffer.getChannelData(0);
                    const inputDataLength = inputData.length;
                    let total = 0;

                    for (let i = 0; i < inputDataLength; i++) {
                        total += Math.abs(inputData[i]);
                    }

                    const rms = Math.sqrt(total / inputDataLength);

                    if (rms < SILENCE_THRESHOLD) {
                        if (silenceStartRef.current === null) {
                            silenceStartRef.current = Date.now();
                        } else if (Date.now() - silenceStartRef.current > SILENCE_TIMEOUT) {
                            stopRecording();
                        }
                    } else {
                        silenceStartRef.current = null;
                    }
                };

                mediaRecorder.start();
                setIsRecording(true);

                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                const recordingTimeout = setTimeout(() => {
                    if (mediaRecorder.state === "recording") {
                        mediaRecorder.stop();
                    }
                }, MAX_AUDIO_TIME * 1000);

                const singleRecordingTimeout = setTimeout(() => {
                    if (mediaRecorder.state === "recording") {
                        setIsRecording(false);
                        stream.getTracks().forEach(track => track.stop());
                        mediaRecorder.stop();
                    }
                }, MAX_SINGLE_AUDIO_TIME * 1000);

                mediaRecorder.onstop = async () => {
                    clearTimeout(recordingTimeout);
                    clearTimeout(singleRecordingTimeout);
                    scriptProcessor.disconnect();
                    analyserRef.current.disconnect();
                    audioContextRef.current.close();

                    const recordingDuration = (Date.now() - startTime) / 1000;
                    const newTotalTime = totalAudioTime + recordingDuration;

                    // Check if this recording would exceed the limit
                    if (newTotalTime >= MAX_AUDIO_TIME) {
                        setShowLimitPopup(true);
                        setIsRecording(false);
                        stream.getTracks().forEach(track => track.stop());
                        return;
                    }

                    setTotalAudioTime(newTotalTime);

                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                    audioChunksRef.current = [];
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const timestamp = new Date();

                    // First get the transcription of user's audio
                    const transcriptionFormData = new FormData();
                    transcriptionFormData.append("audio", audioBlob, "user_input.wav");

                    try {
                        // First get the transcription of user's audio
                        const transcriptionResponse = await axios.post(
                            import.meta.env.VITE_API_BASE_URL_VCA + "/transcribe-audio",
                            transcriptionFormData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                            }
                        );

                        // Add user's audio message and its transcription as separate messages
                        setMessages(prevMessages => [
                            ...prevMessages,
                            // First the audio message
                            { 
                                type: "user", 
                                audio: audioUrl,
                                timestamp 
                            },
                            // Then its transcription
                            {
                                type: "user",
                                content: transcriptionResponse.data.transcription,
                                timestamp: new Date()
                            }
                        ]);

                        setLoading(true);
                        const formData = new FormData();
                        formData.append("audio", audioBlob, "user_input.wav");

                        // Send audio to backend
                        const response = await axios.post(import.meta.env.VITE_API_BASE_URL_VCA + "/process-audio", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        });

                        // Then fetch the audio file using the provided URL
                        const audioResponse = await axios.get(
                            import.meta.env.VITE_API_BASE_URL_VCA + response.data.audio_file_url, 
                            {
                                responseType: 'blob'
                            }
                        );

                        // Create URL for bot's audio response
                        const botAudioUrl = URL.createObjectURL(audioResponse.data);

                        // First add bot's audio response
                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                type: "bot",
                                audio: botAudioUrl,
                                timestamp: new Date()
                            }
                        ]);

                        // Then add the text response
                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                type: "bot",
                                content: response.data.response_text,
                                timestamp: new Date()
                            }
                        ]);

                    } catch (error) {
                        console.error("Error sending audio message:", error);
                        setMessages(prevMessages => [
                            ...prevMessages,
                            {
                                type: "bot",
                                content: "Sorry, I couldn't process your audio message.",
                                timestamp: new Date()
                            }
                        ]);
                    } finally {
                        setLoading(false);
                    }
                };
            })
            .catch(error => {
                console.error("Error accessing microphone:", error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const togglePlay = async (audioUrl, index) => {
        try {
            // Get or create audio element
            if (!audioRefs.current[index]) {
                audioRefs.current[index] = new Audio(audioUrl);
            }
            const audioElement = audioRefs.current[index];

            if (isPlaying === index) {
                // Pause current audio
                audioElement.pause();
                setIsPlaying(null);
            } else {
                // Pause previous audio if any
                if (isPlaying !== null && audioRefs.current[isPlaying]) {
                    audioRefs.current[isPlaying].pause();
                }
                
                // Play new audio
                await audioElement.play();
                setIsPlaying(index);
                
                // Handle audio ending
                audioElement.onended = () => {
                    setIsPlaying(null);
                };
            }
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    // Clean up audio elements when component unmounts
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, []);

    const handleSendMessage = async () => {
        if (inputMessage.trim()) {
            const timestamp = new Date();

            // Add user's text message
            setMessages(prevMessages => [
                ...prevMessages,
                { type: "user", content: inputMessage, timestamp }
            ]);
            setInputMessage("");

            setLoading(true);
            try {
                // Send text message to backend
                const response = await axios.post(import.meta.env.VITE_API_BASE_URL_VCA + "/text-to-text", {
                    prompt: inputMessage
                });

                // If there's audio response, show it first
                if (response.data.audio) {
                    const audioResponse = await axios.get(response.data.audio, {
                        responseType: 'blob'
                    });
                    const botAudioUrl = URL.createObjectURL(audioResponse.data);

                    setMessages(prevMessages => [
                        ...prevMessages,
                        {
                            type: "bot",
                            audio: botAudioUrl,
                            timestamp: new Date()
                        }
                    ]);
                }

                // Then show the text response
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        type: "bot",
                        content: response.data.response,
                        timestamp: new Date()
                    }
                ]);

            } catch (error) {
                console.error("Error sending text message:", error);
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        type: "bot",
                        content: "Sorry, I couldn't process your message.",
                        timestamp: new Date()
                    }
                ]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={`flex justify-center items-center min-h-screen`}>
            <div className={`w-[800px] h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${
                isDarkTheme
                    ? 'bg-gray-900/90 border border-violet-500/20 shadow-violet-500/10'
                    : 'bg-white/90 border border-indigo-200 shadow-indigo-500/10'
            }`}>
                <ChatHeader isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
                
                {/* Messages Container */}
                <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${
                    isDarkTheme
                        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900'
                        : 'bg-gradient-to-br from-gray-50 via-indigo-50/30 to-violet-50/30'
                }`}>
                    <ChatMessages 
                        messages={messages} 
                        isDarkTheme={isDarkTheme} 
                        isPlaying={isPlaying} 
                        togglePlay={togglePlay} 
                        loading={loading} 
                        messagesEndRef={messagesEndRef} 
                    />
                </div>
                
                {/* Input Section */}
                <div className={`${
                    isDarkTheme
                        ? 'bg-gray-900/90 border-t border-violet-500/10'
                        : 'bg-white/80 border-t border-indigo-100'
                }`}>
                    <MessageInput
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        handleSendMessage={handleSendMessage}
                        isDarkTheme={isDarkTheme}
                        isRecording={isRecording}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        loading={loading}
                        totalAudioTime={totalAudioTime}
                        MAX_AUDIO_TIME={MAX_AUDIO_TIME}
                    />
                </div>
            </div>

            {showLimitPopup && <LimitPopup setShowLimitPopup={setShowLimitPopup} MAX_AUDIO_TIME={MAX_AUDIO_TIME} />}
            {showWarningPopup && <WarningPopup setShowWarningPopup={setShowWarningPopup} />}
        </div>
    );
};

export default AudioChatbot;