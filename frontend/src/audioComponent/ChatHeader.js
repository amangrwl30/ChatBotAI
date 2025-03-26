import React from "react";

const ChatHeader = ({ isDarkTheme, setIsDarkTheme }) => {
    return (
        <div className={`${isDarkTheme
            ? 'bg-gradient-to-r from-gray-800 to-gray-900'
            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            } p-6 flex justify-between items-center`}>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                    AI Assistant
                </h1>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-100">Online</span>
                </div>
            </div>
            <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            >
                {isDarkTheme ? '🌞' : '🌙'}
            </button>
        </div>
    );
};

export default ChatHeader;