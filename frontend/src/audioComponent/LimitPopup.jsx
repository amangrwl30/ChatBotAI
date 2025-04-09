import React from "react";

const LimitPopup = ({ setShowLimitPopup, MAX_AUDIO_TIME }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md shadow-2xl transform transition-all">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Audio Limit Reached
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    You've reached your {MAX_AUDIO_TIME / 60} minutes audio limit. Please use text chat instead.
                </p>
                <div className="mt-4">
                    <button
                        onClick={() => setShowLimitPopup(false)}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default LimitPopup;