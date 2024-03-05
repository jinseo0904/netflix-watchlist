import React, { useState, useEffect } from 'react';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';

const Home = () => {
    const signOut = useSignOut();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
            // Fetch the user email from the cookie
            const userCookie = Cookies.get('_auth_state'); // Adjust 'userEmail' based on your cookie name
            let userEmail;

            try {
                const parsedCookieValue = JSON.parse(userCookie);
                userEmail = parsedCookieValue.email;
            } catch (error) {
                console.error('Error parsing userEmail cookie:', error);
                return; // Exit if parsing fails
            }

            if (userEmail) {
                try {
                    // Make an API call to fetch user information
                    const response = await axios.get(`http://localhost:5555/users/userid?email=${encodeURIComponent(userEmail)}`);

                    // Update state with the response data
                    setUserInfo(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // Handle error (e.g., show an error message)
                }
            }
        };

        // Call the function
        fetchUserData();
    }, []); // Empty dependency array means this effect runs only once when the component mounts

    const logout = () => {
        signOut();
        navigate("/login");
    }

    return (
        <div>
            <h1 className="text-3xl font-nfbold text-red-600 font-bold mb-10">
                Watchlist.io
            </h1>
            {userInfo ? (
                <div>
                    <p className='font-nfsans text-2xl text-white mb-8'>Welcome back, {userInfo.firstName}!</p>
                    {/* Render other user information here */}
                </div>
            ) : (
                <p className='font-nfbold text-white mb-8'>Loading user information...</p>
            )}
            <button
                onClick={logout}
                className="transition ease-in-out duration:1500 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Logout
            </button>
        </div>
    );
};

export default Home;