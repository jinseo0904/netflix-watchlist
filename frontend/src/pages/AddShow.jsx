import React, { useState, useEffect } from 'react';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { motion } from "framer-motion"
import timeout from '../components/CustomTimeout';

const AddShow = () => {
    const signOut = useSignOut();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    //title, rating, note, thumbnail
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState("");
    const [note, setNote] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [addError, setAddError] = useState(false);

    const isValidRating = (rating) => {
        if (rating === "") {
            return true; // Directly return true if the rating is an empty string
        }
        const num = parseInt(rating, 10); // Attempt to convert the rating to an integer
        return Number.isInteger(num) && num >= 1 && num <= 5;
    };

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
        fetchUserData();
    }, []); // Empty dependency array means this effect runs only once when the component mounts

    const logout = () => {
        signOut();
        navigate("/login");
    };

    // always return to home page when a lobby is clicked
    const returnHome = () => {
        navigate('/');
    };

    // add show to watchlist
    const apiAddRequest = async () => {

        // make sure that title is not empty
        if (!title || !isValidRating(rating)) {
            setAddError(true);
            return;
        }

        try {
            const newRating = rating === "" ? 5 : rating;
            const response = await Promise.race([
                axios.post(`http://localhost:5555/watchlist/addShow/${userInfo.id}`, {
                    title: title,
                    rating: newRating,
                    note: note,
                    thumbnail: thumbnail
                }),
                timeout(3000) // 3000 milliseconds = 3 seconds
            ]);

            navigate("/");

        } catch (error) {

            console.error('Add error:', error.response ? error.response.data : error.message);
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
                <div className="p-8 bg-gray-900 rounded-2xl shadow-lg min-w-[500px]">
                    <div onClick={returnHome} className='mb-8'>
                        <h1 className="text-5xl font-nfbold text-red-600">
                            Watchlist.io
                        </h1>
                    </div>

                    <h1 className="font-nfsans text-white text-2xl mb-2">Add your show</h1>
                    <div className='mb-4'>
                        <h1 className={`transition-opacity duration-300 ease-in-out font-nfsans text-red-700 text-lg ${addError ? 'opacity-100' : 'opacity-0'}`}>
                            Invalid Title or Rating. Try Again.
                        </h1>
                    </div>
                    {/* Title Input */}
                    <div className="mb-4">
                        <input
                            type="title"
                            name="title"
                            placeholder="Show Title"
                            onChange={(e) => setTitle(e.target.value)}
                            className="transition bg-gray-700 font-nfsans text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal mb-3 focus:outline-none"
                        />
                    </div>
                    {/* Rating Input */}
                    <div className="mb-4">
                        <input
                            type="rating"
                            name="rating"
                            placeholder="Rating (1-5)"
                            onChange={(e) => setRating(e.target.value)}
                            className="transition bg-gray-700 font-nfsans text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal mb-3 focus:outline-none"
                        />
                    </div>
                    {/* Note Input */}
                    <div className="mb-4">
                        <input
                            type="note"
                            name="note"
                            placeholder="Note"
                            onChange={(e) => setNote(e.target.value)}
                            className="transition bg-gray-700 font-nfsans text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal mb-3 focus:outline-none"
                        />
                    </div>

                    {/* Thumbnail Input */}
                    <div className="mb-3">
                        <input
                            type="thumbnail"
                            name="thumbnail"
                            placeholder="Thumbnail"
                            onChange={(e) => setThumbnail(e.target.value)}
                            className="transition ease-in-out font-nfsans duration:800 bg-gray-700 text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal focus:outline-none"
                        />
                    </div>


                    <div className="flex justify-center gap-4"> {/* Flex container with gap */}
                        <button
                            onClick={apiAddRequest}
                            className="transition mt-4 ease-in-out duration:3000 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Show
                        </button>
                        <button
                            onClick={returnHome}
                            className="transition mt-4 ease-in-out duration:3000 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AddShow;