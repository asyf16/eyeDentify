import React, { useEffect } from 'react';
import NavLoggedOut from '../components/NavLoggedOut';
import NavLoggedIn from '../components/NavLoggedIn';
import { useNavContext } from '../context/NavContext';
import axios from 'axios';

const Homepage = () => {   
    const {signUserIn, loginStatus} = useNavContext();

    // Check if a user is signed in at time of mount
    useEffect(() => {
        const prevLoggedIn = localStorage.getItem("user");
        // console.log(prevLoggedIn + "| xs ");
        if(prevLoggedIn && prevLoggedIn != ""){
            // console.log(prevLoggedIn + " was previously logged in");
            signUserIn(prevLoggedIn);
        }
    }, []);

    // Either Get Started or Welcome {userEmail}
    const buttonText = loginStatus!="" ? "Welcome, "+loginStatus+"!" : "Get Started";
    const buttonLink = loginStatus!="" ? "/upload" : "/login"

    return (
        <>
        <div className="bg-gray-100 h-screen">
            
            {/* Navigation */}
            {loginStatus!="" ? <NavLoggedIn/>: <NavLoggedOut/>}
            

            {/* Body */}
            <section className="container mx-auto py-16 text-center">
                <h1 className="text-5xl font-bold mb-4">eyedentify.</h1>
                <p className="text-xl text-gray-700 mb-8">Experience total vigilance with the AI-powered daily vision companion</p>
                
                <a href={buttonLink}>
                    <button className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700">
                        {buttonText}
                    </button>
                </a>
            
            </section>

            <section className="py-16">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-semibold text-center mb-8">Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">AI Facial Recognition</h3>
                        <p className="text-gray-700">Leverage the latest cutting-edge OpenCV facial recognition AI for powerful accuracy and precision
                        </p>
                        
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Offline Access</h3>
                        <p className="text-gray-700">Enjoy the luxury of complete access to all features, even without internet access
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-4">Customizable</h3>
                        <p className="text-gray-700">Fully customizable user caption overlay for a complete immersive experience</p>
                    </div>
                    </div>
                </div>
            </section>
            
            {/* <footer className="bg-blue-600 text-white py-8 text-center">
            <div className="container mx-auto">
                <p>&copy; 2023 Your App. All rights reserved.</p>
            </div>
            </footer> */}


        </div>
        </>
    );
};

export default Homepage;
