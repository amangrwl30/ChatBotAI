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
    MAX_AUDIO_TIME
}) => {
    return (
        <div className={`${isDarkTheme
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700'
            : 'bg-white border-t border-blue-100'
            } p-4`}>
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className={`flex-1 p-3 rounded-xl border text-base transition-all duration-300 ${isDarkTheme
                        ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:border-indigo-500'
                        : 'bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-500 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${isDarkTheme ? 'focus:ring-indigo-500' : 'focus:ring-blue-500'
                        }`}
                />
                <button
                    onClick={handleSendMessage}
                    className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={loading}
                >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
                </button>
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl 
        ${isRecording
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'} 
            text-white 
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''} 
                            `}
                    disabled={loading}
                >
                    <FontAwesomeIcon
                        icon={isRecording ? faStop : faMicrophone}
                        className="text-lg"
                    />

                </button>
            </div>
            {/* Time remaining indicator */}
            <div className={`top-full mt-2 text-sm ${totalAudioTime > MAX_AUDIO_TIME * 0.8
                ? 'text-red-500'
                : totalAudioTime > MAX_AUDIO_TIME * 0.5
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}>
                Time remaining: {Math.max(0, ((MAX_AUDIO_TIME - totalAudioTime) / 60).toFixed(1))} minutes
            </div>
        </div>
    );
};

export default MessageInput;