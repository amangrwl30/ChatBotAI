import React from 'react';
// import 'tailwindcss/tailwind.css';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="loader">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
        </div>
    );
};

export default Loader;