import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSignIn, useIsAuthenticated } from 'react-auth-kit';
import { useNavigate } from 'react-router';
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginFailure, setLoginFailure] = useState(false);

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

    const apiLoginRequest = async () => {
        try {

            // Replace `localhost:5555` with the correct domain if needed, and ensure you're using `http://` or `https://`
            console.log(email);
            console.log(password);
            const response = await Promise.race([
                axios.post('https://watchlist-dorb.onrender.com/users/login', {
                    email: email,
                    password: password
                }),
                timeout(3000) // 3000 milliseconds = 3 seconds
            ]);

            console.log('Login successful:', response.data);
            setLoginFailure(false);

            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { email: email },
            });
            navigate("/");
            // Handle success (e.g., navigate to another page, store the login token, etc.)
        } catch (error) {
            setLoginFailure(true);
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

                    <h1 className="font-nfsans text-white text-xl mb-4">Welcome back!</h1>
                    <h1 className={`transition-opacity duration-300 ease-in-out font-nflight text-red-700 text-sm mb-4 ${loginFailure ? 'opacity-100' : 'opacity-0'}`}>
                        Invalid Email or Password.
                    </h1>
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
                        Not a member yet? <a href='/signup' className='transition ease-in-out ml-1 text-red-600 font-nfbold hover:text-red-700'>Register</a>
                    </div>
                    <button
                        onClick={apiLoginRequest}
                        className="transition ease-in-out duration:3000 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Login
                    </button>
                </div>
            </div>
        </motion.div>

    );
};

export default Login;