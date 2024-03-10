import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // v6 hook to access URL parameters
import { motion } from "framer-motion"
import { useNavigate } from 'react-router';
import axios from 'axios';
import timeout from '../components/CustomTimeout';

const EditShow = () => {
  const { id } = useParams(); // Get the show ID from the URL
  const [show, setShow] = useState(null);
  const location = useLocation();
  const stateReceived = location.state;// { someKey: 'someValue' }

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [editError, setEditError] = useState(false);

  const navigate = useNavigate();
  const returnHome = () => {
    navigate('/');
  };

  const isValidRating = (rating) => {
    if (rating === "") {
      return true; // Directly return true if the rating is an empty string
    }
    const num = parseInt(rating, 10); // Attempt to convert the rating to an integer
    return Number.isInteger(num) && num >= 1 && num <= 5;
  };

  useEffect(() => {
    if (stateReceived) { // Check to prevent modal from opening on initial render
      setShow(stateReceived);
      setTitle(stateReceived.title);
      setRating(stateReceived.rating);
      setNote(stateReceived.note);
      setThumbnail(stateReceived.thumbnail);
    }
  }, [show]); // Depend on selectedShow

  // backend request to edit show information
  const apiEditRequest = async () => {
    // make sure that title is not empty
    if (!title || !isValidRating(rating)) {
      setEditError(true);
      return;
    }

    try {
      const newRating = rating === "" ? 5 : parseInt(rating, 10);;
      const showPatchData = {
        showId: show._id,
        newDetails: {
          title: title,
          rating: newRating,
          note: note,
          thumbnail: thumbnail
        }
      }

      const response = await Promise.race([
        axios.patch(`https://watchlist-dorb.onrender.com/watchlist/editShow/${id}`, showPatchData),
        timeout(3000) // 3000 milliseconds = 3 seconds
      ]);

      setEditError(false);
      navigate("/");

    } catch (error) {
      console.error('An Error occurred while editing the show information:', error.response ? error.response.data : error.message);
    }
  }

  // Render your form pre-populated with `show` details
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
            <h1 className="text-4xl font-nfbold text-red-600">
              Edit Information
            </h1>
          </div>

          {!show ? <h1 className="font-nfsans text-white text-2xl mb-2">loading show info...</h1> :
            <div>
              {/* Container for Thumbnail */}
              {!show || show.thumbnail === '' ?
                <div></div> :
                <div className='flex justify-center item-center rounded-xl p-2 mb-4'>
                  <img src={show.thumbnail} alt="No Thumbnail Available" className='rounded-xl' style={{ height: '100%', width: 'auto', maxHeight: '350px' }} />
                </div>
              }

<div className='mb-4'>
                        <h1 className={`transition-opacity duration-300 ease-in-out font-nfsans text-red-700 text-lg ${editError ? 'opacity-100' : 'opacity-0'}`}>
                            Invalid Title or Rating. Try Again.
                        </h1>
                    </div>

              {/* Title Input */}
              <div className="mb-4">
                <input
                  type="title"
                  name="title"
                  placeholder="Show Title"
                  value={title}
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
                  value={rating}
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
                  value={note}
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
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="transition ease-in-out font-nfsans duration:800 bg-gray-700 text-white focus:bg-gray-200 focus:text-gray-900 rounded py-2 px-4 block w-full appearance-none leading-normal focus:outline-none"
                />
              </div>


              <div className="flex justify-center gap-4"> {/* Flex container with gap */}
                <button
                  onClick={apiEditRequest}
                  className="transition mt-4 ease-in-out duration:3000 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Submit
                </button>
                <button
                  onClick={returnHome}
                  className="transition mt-4 ease-in-out duration:3000 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Cancel
                </button>
              </div>
            </div>
          }

        </div>
      </div>
    </motion.div>
  );
};

export default EditShow;
