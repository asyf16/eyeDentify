import React, { useState } from 'react';
import { useNavContext } from '../context/NavContext';
import axios from "axios";


const SignUp = () => {
    const {goToSignIn, goToHome, signUserIn} = useNavContext();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const flashElementById = (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            // flash 5 times (change colour 10 times using counter cnt)
            let cnt = 0;
            const flashInterval = setInterval(() => {
                element.classList.toggle('text-red-500'); // Change to desired color
                element.classList.toggle('text-blue-500'); // Change back to the original color
                cnt++;
                if(cnt === 10){
                    clearInterval(flashInterval)
                }
            }, 500); // Adjust the interval (milliseconds) for the flashing speed
        } else {
            console.error('Element with id ' + elementId + ' not found.');
        }
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        //
        const email = formData.email;
        const password = formData.password;
        const confirm = formData.confirmPassword;
        // password matching here
        if (password === confirm){
            axios.post("http://127.0.0.1:3001/register", {email, password})
            .then(result => {
                if(result.data !== "User already exists."){
                    signUserIn(email);
                    goToHome();
                } else {
                    alert("User " + email + " already exists. Please Log in instead.");
                    flashElementById("alreadyAccountLogIn");
                }            
            })
            .catch(err => console.log(err))
        } else {
            alert('Passwords do not match. Please try again.');
        }
    };

    return (
        <>
            <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
                {/* Home button */}
                <div className='py-2'>
                    <button
                        onClick={goToHome}
                        className="w-full text-left whitespace-nowrap hover:underline" // Ensure the button is displayed on one line
                    >
                        Home
                    </button>
                </div>
                {/* Signup */}
                <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
                    <h1 className="text-2xl font-semibold mb-4">User Sign Up</h1>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border rounded-md"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border rounded-md"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-2 border rounded-md"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <div className="mt-2">
                            <a href="#" className="text-blue-500 hover:underline" id='alreadyAccountLogIn' onClick={goToSignIn}>
                                Already have an account? Log in
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full mt-4"
                        >
                            Sign up
                        </button>
                    </form>
                </div>
            </div>
        </>
        
    );
};

export default SignUp;
