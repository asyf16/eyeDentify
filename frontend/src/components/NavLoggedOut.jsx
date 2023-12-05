import React from 'react'
import { useNavContext } from '../context/NavContext';


const NavLoggedOut = () => {
    const {goToSignIn, goToSignUp, goToHome} = useNavContext();

    return (
        <>
            <nav className="bg-transparent p-4 flex justify-between items-center text-black">
                {/* Left Links */}
                <div className="text-m">
                    <a href="#" className="mr-4 hover:underline" onClick={goToHome}>Home</a>
                    <a href="#" className="mr-4 hover:underline">Docs</a>
                    <a href="#" className="mr-4 hover:underline">Product</a>
                </div>

                {/* Signin and Signup */}
                <div>
                    <button className="bg-transparent text-black px-4 py-2 rounded-full border border-black mr-4 hover:bg-blue-100"
                        onClick={goToSignIn}
                    >
                        Log In
                    </button>
                    <button className="bg-transparent text-black px-4 py-2 rounded-full border border-black hover:bg-blue-100"
                        onClick={goToSignUp}
                    >
                        Sign Up
                    </button>
                </div>
            </nav>
        </>
    )
}

export default NavLoggedOut