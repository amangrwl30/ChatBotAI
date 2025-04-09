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
                scriptProcessor.connect(audioContextRef.current.destination);

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

                    // Add user's audio message
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { type: "user", audio: audioUrl, timestamp }
                    ]);

                    setLoading(true);
                    const formData = new FormData();
                    formData.append("audio", audioBlob, "user_input.wav");

                    try {
                        // Send audio to backend
                        const response = await axios.post("http://localhost:5000/process-audio", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },
                            responseType: 'blob' // Important: expect binary response
                        });

                        // Create URL for bot's audio response
                        const botAudioUrl = URL.createObjectURL(response.data);

                        // Add bot's audio response
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { type: "bot", audio: botAudioUrl, timestamp: new Date() }
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

    const togglePlay = (audioUrl, index) => {
        const audioElement = document.getElementById(`audio-${index}`);
        if (audioElement) {
            if (isPlaying === index) {
                audioElement.pause();
                setIsPlaying(null);
            } else {
                audioElement.play();
                setIsPlaying(index);
                audioElement.onended = () => setIsPlaying(null);
            }
        }
    };

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
                const response = await axios.post("http://localhost:5000/chat", {
                    query: inputMessage
                });

                // Add bot's text response
                setMessages(prevMessages => [
                    ...prevMessages,
                    {
                        type: "bot",
                        content: response.data.answer,
                        timestamp: new Date()
                    }
                ]);

                // If there's audio response
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
        <div className="flex justify-center items-center min-h-screen from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
            <div className={`w-[800px] h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm ${isDarkTheme
                ? 'bg-gray-900/95 border border-gray-700/50'
                : 'bg-white/95 border border-blue-100'
                }`}>
                <ChatHeader isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
                <ChatMessages messages={messages} isDarkTheme={isDarkTheme} isPlaying={isPlaying} togglePlay={togglePlay} loading={loading} messagesEndRef={messagesEndRef} />
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

            {showLimitPopup && <LimitPopup setShowLimitPopup={setShowLimitPopup} MAX_AUDIO_TIME={MAX_AUDIO_TIME} />}
            {showWarningPopup && <WarningPopup setShowWarningPopup={setShowWarningPopup} />}
        </div>
    );
};

export default AudioChatbot;