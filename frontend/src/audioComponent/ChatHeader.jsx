import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faRobot } from "@fortawesome/free-solid-svg-icons";

const ChatHeader = ({ isDarkTheme, setIsDarkTheme }) => {
    return (
        <div className={`${isDarkTheme
            ? 'bg-gradient-to-r from-violet-800 via-purple-800 to-indigo-900'
            : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400'
            } p-4 flex justify-between items-center shadow-lg relative`}>
            
            {/* Logo and Title Section */}
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl transform transition-all duration-300 hover:scale-110 ${
                    isDarkTheme 
                        ? 'bg-white/10 shadow-lg shadow-purple-500/20' 
                        : 'bg-white/20 shadow-lg shadow-indigo-500/20'
                    } backdrop-blur-sm`}>
                    <FontAwesomeIcon 
                        icon={faRobot} 
                        className="text-2xl text-white animate-pulse" 
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">
                        AI Voice Assistant
                    </h1>
                    <div className="flex items-center gap-2 text-sm mt-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                        <span className="text-white/90 font-medium tracking-wide">Active & Listening</span>
                    </div>
                </div>
            </div>

            {/* Theme Toggle Button */}
            <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    isDarkTheme 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-white/20 hover:bg-white/30'
                } backdrop-blur-sm`}
            >
                <FontAwesomeIcon 
                    icon={isDarkTheme ? faSun : faMoon} 
                    className="text-xl text-white" 
                />
            </button>
        </div>
    );
};

export default ChatHeader;