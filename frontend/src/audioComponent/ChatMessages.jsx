import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faUser, faRobot, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const AudioWaveform = ({ isPlaying, type, isDarkTheme }) => {
    const bars = Array.from({ length: 27 }, (_, i) => {
        const height = isPlaying
            ? 8 + Math.random() * 25
            : 8 + (i % 2 === 0 ? 15 : 8);

        const animationClass = isPlaying 
            ? "animate-[wave_1.2s_ease-in-out_infinite]" 
            : "opacity-100 transition-all duration-300";

        const yPosition = 40 - height;

        // Enhanced color classes with lighter colors for paused state
        const getBarColor = () => {
            if (type === 'user') {
                if (isDarkTheme) {
                    return isPlaying 
                        ? 'fill-blue-400' // Bright blue when playing
                        : 'fill-blue-400/40' // Lighter blue when paused
                } else {
                    return isPlaying
                        ? 'fill-blue-500'
                        : 'fill-blue-400/50'
                }
            } else {
                if (isDarkTheme) {
                    return isPlaying
                        ? 'fill-violet-400' // Bright violet when playing
                        : 'fill-violet-400/40' // Lighter violet when paused
                } else {
                    return isPlaying
                        ? 'fill-violet-500'
                        : 'fill-violet-400/50'
                }
            }
        };

        return (
            <rect
                key={i}
                x={i * 7}
                y={yPosition}
                width={4}
                height={height}
                rx={2}
                className={`${getBarColor()} ${animationClass}`}
                style={{
                    animationDelay: isPlaying ? `${i * 40}ms` : '0ms'
                }}
            />
        );
    });

    return (
        <svg
            aria-hidden="true"
            className="w-[165px] md:w-[205px] md:h-[45px]"
            viewBox="0 0 185 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {bars}
        </svg>
    );
};

const AudioPlayer = ({ audio, isPlaying, onToggle, isDarkTheme, type, timestamp }) => {
    const audioRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audioElement = audioRef.current;
        
        // Handle play/pause
        if (isPlaying) {
            audioElement.play().catch(err => console.log("Playback failed:", err));
        } else {
            audioElement.pause();
        }
        
        const handleLoadedMetadata = () => {
            setDuration(audioElement.duration);
        };
        
        const handleTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
        };
        
        audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.addEventListener('timeupdate', handleTimeUpdate);
        
        return () => {
            audioElement.pause();
            audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [isPlaying, audio]);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-start gap-2.5">
            {/* Avatar */}
            <div className={`min-w-[48px] min-h-[48px] w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                type === 'user' 
                    ? 'bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-400' // Lighter, more vibrant gradient
                    : isDarkTheme 
                        ? 'bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400' // Brighter purple gradient
                        : 'bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400'
            }`}>
                <div className="flex items-center justify-center w-full h-full p-2">
                    <FontAwesomeIcon 
                        icon={type === 'user' ? faUser : faRobot} 
                        className="text-white w-6 h-6 drop-shadow-md" // Added shadow for depth
                    />
                </div>
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
                {/* Audio Controls */}
                <div className="flex flex-col gap-2">
                    {/* Time and Chat Info */}
                    <div className="flex justify-between items-center text-xs">
                        {/* Audio Duration */}
                        <span className={`font-bold tracking-wide ${
                            type === 'user'
                                ? isDarkTheme
                                    ? 'text-blue-300/90'
                                    : 'text-blue-500/90'
                                : isDarkTheme
                                    ? 'text-fuchsia-300/90'
                                    : 'text-violet-500/90'
                        }`}>
                            {formatTime(currentTime)}/{formatTime(duration)}
                        </span>

                        {/* Chat Time - Matching colors with slightly lower opacity */}
                        <span className={`font-bold tracking-wide ${
                            type === 'user'
                                ? isDarkTheme
                                    ? 'text-blue-300/70'
                                    : 'text-blue-500/70'
                                : isDarkTheme
                                    ? 'text-fuchsia-300/70'
                                    : 'text-violet-500/70'
                        }`}>
                            {timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                    </div>

                    {/* Waveform and Controls Container */}
                    <div className="flex items-end gap-3">
                        {/* Play Button */}
                        <button
                            onClick={onToggle}
                            className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-all ${
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
                                className={`w-3 h-3 ${isPlaying ? '' : 'ml-0.5'}`}
                            />
                        </button>

                        {/* Waveform */}
                        <div className="flex-1">
                            <AudioWaveform isPlaying={isPlaying} type={type} isDarkTheme={isDarkTheme} />
                        </div>
                    </div>
                </div>

                <audio ref={audioRef} src={audio} />
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
};

const ChatMessages = ({ messages, isDarkTheme, isPlaying, togglePlay, loading, messagesEndRef }) => {
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