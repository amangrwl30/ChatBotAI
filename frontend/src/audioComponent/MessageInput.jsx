import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStop, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const MessageInput = ({
    inputMessage,
    setInputMessage,
    handleSendMessage,
    isDarkTheme,
    isRecording,
    startRecording,
    stopRecording,
    loading,
    totalAudioTime,
    MAX_AUDIO_TIME,
    isProcessingAudio,
}) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const isDisabled = loading || isRecording || !inputMessage.trim() || isProcessingAudio;

    return (
        <div
            className={`${
                isDarkTheme
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700"
                    : "bg-white border-t border-blue-200"
            } p-4`}
        >
            {isRecording ? (
                // Recording UI
                <div className="flex flex-col items-center gap-4">
                    {/* Timer */}
                    <p
                        className={`text-lg font-semibold ${
                            totalAudioTime > MAX_AUDIO_TIME * 0.8
                                ? "text-red-500"
                                : totalAudioTime > MAX_AUDIO_TIME * 0.5
                                ? "text-yellow-500"
                                : isDarkTheme
                                ? "text-gray-300"
                                : "text-gray-700"
                        }`}
                    >
                        Time Remaining: {formatTime(MAX_AUDIO_TIME - totalAudioTime)}
                    </p>

                    {/* Waveform + Microphone */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">
                            <FontAwesomeIcon
                                icon={faMicrophone}
                                className="text-white text-3xl"
                            />
                        </div>
                        <div className="flex items-center gap-1 w-full">
                            {Array.from({ length: 20 }, (_, i) => {
                                const height = Math.random() * 25 + 10;
                                return (
                                    <div
                                        key={i}
                                        className={`w-2 rounded ${
                                            isDarkTheme
                                                ? "bg-blue-400"
                                                : "bg-blue-500"
                                        }`}
                                        style={{
                                            height: `${height}px`,
                                            animation: `bounce 1.5s ease-in-out ${
                                                i * 0.1
                                            }s infinite`,
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stop Button */}
                    <button
                        onClick={stopRecording}
                        className="p-4 rounded-full shadow-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faStop} className="text-2xl" />
                    </button>
                </div>
            ) : (
                // Default Input UI
                <div className="flex items-center gap-4">
                    {/* Input Field */}
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && !isDisabled && handleSendMessage()
                        }
                        placeholder={
                            isProcessingAudio 
                                ? "Processing audio response..." 
                                : loading 
                                    ? "Waiting for response..." 
                                    : "Type your message..."
                        }
                        disabled={loading || isRecording || isProcessingAudio}
                        className={`flex-1 p-3 rounded-xl border text-base transition-all ${
                            isDarkTheme
                                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:border-indigo-500"
                                : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-500 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            isDarkTheme
                                ? "focus:ring-indigo-500"
                                : "focus:ring-blue-500"
                        } ${(loading || isRecording || isProcessingAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        className={`p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isDisabled}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
                    </button>

                    {/* Record Button */}
                    <button
                        onClick={startRecording}
                        className={`relative p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                            isDarkTheme
                                ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        } text-white ${(loading || isProcessingAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading || isProcessingAudio}
                    >
                        <FontAwesomeIcon icon={faMicrophone} className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageInput;