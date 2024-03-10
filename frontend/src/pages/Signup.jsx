import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSignIn, useIsAuthenticated } from 'react-auth-kit';
import { useNavigate } from 'react-router';
import { motion } from "framer-motion";

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpFailure, setSignUpFailure] = useState(false);

    const signIn = useSignIn();
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    // Utility function to create a promise that rejects after a timeout
    const timeout = (delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, delay);
        });
    };

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const apiSignupRequest = async () => {
        try {

            console.log(firstName);
            console.log(lastName);
            console.log(email);
            const response = await Promise.race([
                axios.post('https://watchlist-dorb.onrender.com/users/register', {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }),
                timeout(3000) // 3000 milliseconds = 3 seconds
            ]);

            console.log('Registration successful:', response.data);
            setSignUpFailure(false);
            navigate("/login");
            // Handle success (e.g., navigate to another page, store the login token, etc.)
        } catch (error) {
            setSignUpFailure(true);
            console.error('Login error:', error.response ? error.response.data : error.message);
            // Handle error (e.g., display an error message)
        }
    };

    return (
        <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, duration: 2 }}
            transition={{
                duration: 0.7
            }}
            exit={{ opacity: 0 }}>

            <div className="h-screen flex justify-center items-center">
                <div className="p-8 bg-gray-900 rounded-2xl shadow-lg min-w-[300px]">
                    <h1 className="font-nfbold text-4xl text-red-600 font-bold mb-4">
                        Watchlist.io
                    </h1>

                    <h1 className="font-nfsans text-white text-xl mb-4">Create your account</h1>
                    <h1 className={`transition-opacity duration-300 ease-in-out font-nflight text-red-700 text-sm mb-4 ${signUpFailure ? 'opacity-100' : 'opacity-0'}`}>
                        Email already exists. Try again
                    </h1>
                    {/* First Name Input */}
                    <div className="mb-4">
                        <input
                            type="firstName"
                            name="firstName"
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                            className="transition bg-gray-700 font-nfsans text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal mb-3 focus:outline-none"
                        />
                    </div>
                    {/* Last Name Input */}
                    <div className="mb-4">
                        <input
                            type="lastName"
                            name="lastName"
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                            className="transition bg-gray-700 font-nfsans text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal mb-3 focus:outline-none"
                        />
                    </div>
                    {/* Email Input */}
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="transition bg-gray-700 font-nfsans text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal mb-3 focus:outline-none"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="transition ease-in-out font-nfsans duration:800 bg-gray-700 text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal focus:outline-none"
                        />
                    </div>
                    <div className='mb-3 text-white font-nfsans'>
                        Already have an account? <a href='/login' className='transition ease-in-out ml-1 text-red-600 font-nfbold hover:text-red-700'>Sign in</a>
                    </div>
                    <button
                        onClick={apiSignupRequest}
                        className="transition ease-in-out duration:3000 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Register
                    </button>
                </div>
            </div>
        </motion.div>

    );
};

export default Signup;