import React, { useState, useEffect } from 'react';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { motion } from "framer-motion"
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { red, blueGrey, blue } from '@mui/material/colors';
import timeout from '../components/CustomTimeout';
import InfoModal from '../components/InfoModal';
import DeleteModal from '../components/DeleteModal';
import WatchButton from '../components/WatchButton';
import StarRating from '../components/StarRating';

const Home = () => {
    const signOut = useSignOut();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [listLoading, setListLoading] = useState(true);

    // for modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

    const [selectedShowId, setSelectedShowId] = useState(null);
    const [selectedShowTitle, setSelectedShowTitle] = useState(null);

    const fetchShowList = async () => {
        try {
            const response = await axios.get(`https://watchlist-dorb.onrender.com/watchlist/${userInfo.id}`);
            setWatchlist(response.data); // Make sure to use response.data
            setListLoading(false);
        } catch (error) {
            console.error('Error fetching user watchlist:', error);
            setListLoading(false); // Ensure to handle loading state correctly
        }
    };

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
            // Fetch the user email from the cookie
            const userCookie = Cookies.get('_auth_state'); // Adjust 'userEmail' based on your cookie name
        
            if (!userCookie) {
                console.error('User cookie not found');
                return; // Exit the function if the cookie doesn't exist
            }
        
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
                    const response = await axios.get(`https://watchlist-dorb.onrender.com/users/userid?email=${encodeURIComponent(userEmail)}`);
        
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

    useEffect(() => {
        // Ensure userInfo is not null before attempting to fetch the watchlist
        if (userInfo && userInfo.id) {
            fetchShowList();
        }
    }, [userInfo]); // This effect depends on userInfo

    const apiDeleteRequest = async () => {
        try {
            const response = await Promise.race([
                axios.delete(`https://watchlist-dorb.onrender.com/watchlist/removeShow/${userInfo.id}`, {
                    data: { showId: selectedShowId }, // Specify the data to be sent in the request's body
                    timeout: 3000, // Specifies the number of milliseconds before the request times out.
                }),
            ]);

            // close the modal and refresh the page
            handleCloseModal();
            fetchShowList();

        } catch (error) {
            console.error('An Error occurred while trying to delete the show:', error.response ? error.response.data : error.message);
        }
    };

    const handleWatchShow = async (id, watch_status) => {
        try {
            const newStatus = (watch_status === 'watched' ? 'not watched' : (watch_status === 'not watched' ? 'watching' : 'watched'));
            const showPatchData = {
                showId: id,
                newDetails: {
                    watched: newStatus
                }
            }

            const response = await Promise.race([
                axios.patch(`https://watchlist-dorb.onrender.com/watchlist/editShow/${userInfo.id}`, showPatchData),
                timeout(3000) // 3000 milliseconds = 3 seconds
            ]);

            // refresh the page
            fetchShowList();

        } catch (error) {
            console.error('An Error occurred while handling the request:', error.response ? error.response.data : error.message);
        }
    }

    const logout = () => {
        signOut();
        navigate("/login");
    };

    const addShow = () => {
        navigate("/add");
    };

    // always return to home page when a lobby is clicked
    const returnHome = () => {
        navigate('/');
    };

    // Event handler to open modal and set the selected show's id
    const handleShowClick = (id, title) => {
        setSelectedShowId(id);
        setSelectedShowTitle(title);
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedShowId(null); // Optional: Clear selected show id
            setSelectedShowTitle(null); // This will be executed after the timeout
        }, 200);
    };

    useEffect(() => {
        if (selectedShow) { // Check to prevent modal from opening on initial render
            setInfoModalOpen(true);
        }
    }, [selectedShow]); // Depend on selectedShow
    
    const handleInfoClick = (showObj) => {
        setSelectedShow(showObj); // This will trigger the useEffect above after update
    };
    

    const handleInfoClose = () => {
        setInfoModalOpen(false);
        setTimeout(() => {
            setSelectedShow(null);
        }, 200);
    }

    const handleEditPageOpen = () => {
        navigate(`/editshow/${userInfo.id}`, { state: selectedShow });
        handleInfoClose();
    }

    const changeRating = async (id, newRating) => {
        console.log(newRating);
        try {
            const showPatchData = {
                showId: id,
                newDetails: {
                    rating: newRating
                }
            }

            const response = await Promise.race([
                axios.patch(`https://watchlist-dorb.onrender.com/watchlist/editShow/${userInfo.id}`, showPatchData),
                timeout(3000) // 3000 milliseconds = 3 seconds
            ]);

            // refresh the page
            fetchShowList();

        } catch (error) {
            console.error('An Error occurred while handling the request:', error.response ? error.response.data : error.message);
        }
    }

    return (
        <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            exit={{ opacity: 0 }}
            className="relative h-screen" // Ensure this is the relative container for the entire component
        >
            <div className="p-8">
                <div className='flex justify-between content-center mb-10'>
                    <div onClick={returnHome}>
                        <h1 className="text-4xl font-nfbold text-red-600">
                            Watchlist.io
                        </h1>
                    </div>
                    <button
                        onClick={logout}
                        className="transition ease-in-out duration:1500 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Logout
                    </button>
                </div>
                {userInfo ? (
                    <div>
                        <p className='text-3xl text-white font-nfsans mb-8'>Welcome back, {userInfo.firstName}!</p>
                        {/* Render other user information here */}
                    </div>
                ) : (
                    <p className='text-white mb-8'>Loading user information...</p>
                )}

                <div className='flex justify-end mb-2'>
                    <button
                        onClick={addShow}
                        className="transition ease-in-out duration:300 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add
                    </button>
                </div>

                {/* watchlist */}
                {listLoading ? (<p className='text-white mb-8 font-nfsans'>Loading playlist...</p>)
                    : (
                        <ul>
                            {watchlist.map((show) => (
                                <div key={show._id} className='transition ease-in-out duration-300 hover:bg-gray-800 items-center mb-2 rounded-xl font-nfsans bg-gray-900 p-4 flex justify-between text-white'>
                                    <h2 className='text-left pl-4 text-2xl w-3/5'>{show.title}</h2>
                                    <WatchButton 
                                    watched={show.watched}
                                    id={show._id}
                                    handleClick={handleWatchShow}/>
                                    <StarRating 
                                    show={show}
                                    handleClick={changeRating}/>
                                    <div className='flex gap-3 mr-3'>
                                        <InfoOutlinedIcon fontSize="large" sx={{ color: blueGrey[200] }} onClick={() => handleInfoClick(show)} />
                                        <DeleteOutlinedIcon fontSize="large" sx={{ color: red[600] }} onClick={() => handleShowClick(show._id, show.title)} />
                                    </div>
                                    {/* Render thumbnail image if exists */}
                                </div>
                            ))}
                        </ul>
                    )}
                <DeleteModal
                    isModalOpen={isModalOpen}
                    handleCloseModal={handleCloseModal}
                    apiDeleteRequest={apiDeleteRequest}
                    selectedShowTitle={selectedShowTitle}
                />
                <InfoModal
                isModalOpen={infoModalOpen}
                handleCloseModal={handleInfoClose}
                openEditPage={handleEditPageOpen}
                show={selectedShow} />
            </div>
        </motion.div>
    );
};

export default Home;