import React, { useState } from 'react';
import { useNavContext } from '../context/NavContext';
import axios from "axios";


const Login = () => {
    const {goToSignUp, goToHome, signUserIn} = useNavContext();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        //
        const email = formData.email;
        const password = formData.password;
        //
        axios.post("http://127.0.0.1:3001/login", {email, password})
        .then(result => {
            console.log(result);
            if(result.data === "success"){
                signUserIn(email);
                goToHome();
            } else {
                alert(result.data);
            }
        })
        .catch(err => console.log(err))
        
    }

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
                {/* Login */}
                <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
                    <h1 className="text-2xl font-semibold mb-4">User Login</h1>
                    <form onSubmit={handleSignIn}>
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
                        {/* <div className="mt-2">
                            <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                        </div> */}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full mt-4"
                        >
                            Log in
                        </button>
                        <p className="text-center text-sm text-gray-700 mt-4 mb-2">Don't have an account?</p>
                        <button
                            type="button"
                            onClick={goToSignUp} // Call handleSignup when the button is clicked
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full"
                        >
                            Sign up
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
