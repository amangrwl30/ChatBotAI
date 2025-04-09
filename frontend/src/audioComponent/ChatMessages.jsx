import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const ChatMessages = ({ messages, isDarkTheme, isPlaying, togglePlay, loading, messagesEndRef }) => {
    return (
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDarkTheme
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-gray-50 to-blue-50'
            }`}>
            {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-xl p-4 max-w-[70%] shadow-lg ${message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                        : isDarkTheme
                            ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-700'
                            : 'bg-white text-gray-800 border border-blue-100'
                        }`}>
                        {message.audio ? (
                            // Audio message
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => togglePlay(message.audio, index)}
                                    className={`p-3 rounded-full transition-all ${message.type === 'user'
                                        ? 'bg-white/20 hover:bg-white/30'
                                        : isDarkTheme
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                                        }`}
                                >
                                    <FontAwesomeIcon
                                        icon={isPlaying === index ? faPause : faPlay}
                                        className={message.type === 'user' ? 'text-white' : ''}
                                    />
                                </button>
                                <span className="text-sm opacity-75">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                                <audio id={`audio-${index}`} src={message.audio} />
                            </div>
                        ) : (
                            // Text message
                            <div>
                                <p className="mb-2 text-base">{message.content}</p>
                                <span className="text-xs opacity-75">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md bg-gradient-to-r from-blue-500 to-purple-500">
                        AI
                    </div>
                    <div className="max-w-xs p-3 rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ml-4">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;