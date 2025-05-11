import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faUser, faRobot, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const AudioWaveform = ({ isPlaying }) => {
    const bars = Array.from({ length: 27 }, (_, i) => {
        const height = isPlaying
            ? 8 + Math.random() * 25 // Increased dynamic height during playback
            : 8 + (i % 2 === 0 ? 15 : 8); // Increased static heights when not playing

        // Enhanced animation and color classes
        const animationClass = isPlaying 
            ? "animate-[wave_1.2s_ease-in-out_infinite]" 
            : "opacity-100 transition-all duration-300"; // Increased opacity

        // Calculate position from bottom with more space
        const yPosition = 40 - height;

        return (
            <rect
                key={i}
                x={i * 7}
                y={yPosition}
                width={4} // Slightly wider bars
                height={height}
                rx={2}
                className={`${
                    isPlaying 
                        ? 'fill-gray-600 dark:fill-white' 
                        : 'fill-gray-400 dark:fill-gray-300' // Darker colors for paused state
                } ${animationClass}`}
                style={{
                    animationDelay: isPlaying ? `${i * 40}ms` : '0ms'
                }}
            />
        );
    });

    return (
        <svg
            aria-hidden="true"
            className="w-[165px] md:w-[205px] md:h-[45px]" // Increased SVG size
            viewBox="0 0 185 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {bars}
        </svg>
    );
};

const AudioPlayer = React.memo(({ audio, isPlaying, onToggle, isDarkTheme, type, timestamp }) => {
    console.log('audio player render')
    const audioRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // useEffect(() => {
    //     const audioElement = audioRef.current;
        
    //     // Handle play/pause
    //     if (isPlaying) {
    //         audioElement.play().catch(err => console.log("Playback failed:", err));
    //     } else {
    //         audioElement.pause();
    //     }
        
    //     const handleLoadedMetadata = () => {
    //         setDuration(audioElement.duration);
    //     };
        
    //     const handleTimeUpdate = () => {
    //         setCurrentTime(audioElement.currentTime);
    //     };
        
    //     audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    //     audioElement.addEventListener('timeupdate', handleTimeUpdate);
        
    //     return () => {
    //         audioElement.pause();
    //         audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    //         audioElement.removeEventListener('timeupdate', handleTimeUpdate);
    //     };
    // }, [isPlaying, audio]);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-start gap-2.5">
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                type === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-violet-500'
                    : isDarkTheme 
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                        : 'bg-gradient-to-br from-indigo-500 to-blue-600'
            }`}>
                <FontAwesomeIcon 
                    icon={type === 'user' ? faUser : faRobot} 
                    className="text-white text-sm"
                />
            </div>

            {/* Message Content */}
            <div className={`flex flex-col gap-2.5 w-full max-w-[320px] leading-1.5 p-4 ${
                type === 'user'
                    ? isDarkTheme
                        ? 'bg-gray-800 text-white'
                        : 'bg-blue-50 text-gray-900'
                    : isDarkTheme
                        ? 'bg-gray-700 text-white'
                        : 'bg-white text-gray-900'
            } rounded-xl shadow-sm`}>
                {/* Header */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold">
                        {type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className={`text-sm font-normal ${
                        isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Audio Controls */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <button
                        onClick={onToggle}
                        className={`inline-flex items-center justify-center p-2.5 rounded-full transition-all ${
                            type === 'user'
                                ? isDarkTheme
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                : isDarkTheme
                                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        <FontAwesomeIcon 
                            icon={isPlaying ? faPause : faPlay}
                            className={`w-4 h-4 ${isPlaying ? '' : 'ml-0.5'}`}
                        />
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between mb-1 text-xs">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <AudioWaveform isPlaying={isPlaying} />
                    </div>
                </div>

                {/* Status */}
                <span className={`text-sm font-normal ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    {isPlaying ? 'Playing' : 'Delivered'}
                </span>

                <audio ref={audioRef} src={audio}  />
            </div>

            {/* Options Button */}
            <button 
                className={`shrink-0 inline-flex self-center items-center p-2 text-sm font-medium text-center rounded-lg ${
                    isDarkTheme
                        ? 'text-white bg-gray-800 hover:bg-gray-700'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                } focus:ring-4 focus:outline-none focus:ring-gray-50`}
            >
                <FontAwesomeIcon 
                    icon={faEllipsisVertical}
                    className="w-4 h-4"
                />
            </button>
        </div>
    );
});

const ChatMessages = ({ messages, isDarkTheme, isPlaying, togglePlay, loading, messagesEndRef }) => {
    console.log("chat message render")
    return (
        <div className="space-y-6">
            {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.audio ? (
                        // Audio message without background styling
                        <div className="max-w-[70%]">
                            <AudioPlayer 
                                audio={message.audio}
                                isPlaying={isPlaying === index}
                                onToggle={() => togglePlay(message.audio, index)}
                                isDarkTheme={isDarkTheme}
                                type={message.type}
                                timestamp={message.timestamp}
                            />
                        </div>
                    ) : (
                        // Text message with original styling
                        <div className={`max-w-[70%] rounded-2xl shadow-lg ${
                            message.type === 'user'
                                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                                : isDarkTheme
                                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-violet-500/20'
                                    : 'bg-white text-gray-800 border border-indigo-100'
                        }`}>
                            <div className="p-4">
                                <p className="text-base leading-relaxed">{message.content}</p>
                                <span className="block mt-2 text-xs opacity-75">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            
            {loading && (
                <div className="flex items-start space-x-2">
                    <div className={`p-4 rounded-2xl ${
                        isDarkTheme 
                            ? 'bg-gray-800/50 border border-violet-500/20' 
                            : 'bg-white/80 border border-indigo-100'
                    }`}>
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-150"></div>
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-300"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

// Add this animation to your styles
const style = document.createElement('style');
style.textContent = `
@keyframes wave {
    0%, 100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(1.5);
    }
}
`;
document.head.appendChild(style);

export default ChatMessages;