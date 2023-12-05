import React, { useState } from 'react';
import { useNavContext } from '../context/NavContext';


const NavLoggedIn = () => {
    const {signUserOut, goToUploadPics, goToHome, goToCollection} = useNavContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSignOut = () => {
        // Close the dropdown
        setIsDropdownOpen(false);
        // Sign the user out and return home
        signUserOut();
        goToHome();
    };

    return (
        <>
            <nav className="bg-transparent p-4 flex justify-between items-center text-black">
                {/* Left Links */}
                <div className="text-m">
                    <a href="#" className="mr-4 hover:underline" onClick={goToHome}>Home</a>
                    <a href="#" className="mr-4 hover:underline">Docs</a>
                    <a href="#" className="mr-4 hover:underline">Product</a>
                </div>

                {/* Hamburger menu icon after sign in */}
                <div className="relative">
                    <button
                        className="bg-black text-white p-2 rounded-md border border-white"
                        onClick={toggleDropdown}
                    >
                        <div className="w-6 h-1 bg-white mb-1"></div>
                        <div className="w-6 h-1 bg-white mb-1"></div>
                        <div className="w-6 h-1 bg-white"></div>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-8 right-0 mt-2 bg-white p-2 rounded-md shadow-md">
                            <button className='w-full text-left whitespace-nowrap hover:underline' onClick={goToUploadPics}>Upload</button><br/>
                            <button className='w-full text-left whitespace-nowrap hover:underline' onClick={goToCollection}>Collection</button><br/>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left whitespace-nowrap hover:underline" // Ensure the button is displayed on one line
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>

            </nav>
        </>
    )
}

export default NavLoggedIn