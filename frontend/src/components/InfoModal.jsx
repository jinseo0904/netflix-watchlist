import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import noImage from '../assets/no-image.png'

const InfoModal = ({ isModalOpen, handleCloseModal, show }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        boxShadow: 24,
        outline: 'none',
        p: 4,
    };

    const renderRatingStars = (rating) => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<span key={i}>&#9733;</span>); // Filled star
            } else {
                stars.push(<span key={i}>&#9734;</span>); // Unfilled star
            }
        }
        return stars;
    };

    return (
        <Modal
            aria-labelledby="info-show-modal"
            aria-describedby="display information of the selected Show"
            open={isModalOpen}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 400,
                },
            }}
        >
            <Fade in={isModalOpen}>
                <Box border={0} sx={style} className='text-center text-white bg-gray-900 rounded-xl font-nfsans justify-center items-center'>
                    {!show || !show.thumbnail ?
                        <div></div> :
                        <div className='flex justify-center item-center rounded-xl p-2 mb-4'>
                            <img src={show.thumbnail} alt="No Thumbnail Available" className='rounded-xl' style={{ height: 'auto', width: '100%', maxWidth: '300px' }} />
                        </div>
                    }
                    {!show ? <h2 className='text-4xl font-nfbold text-red-600 mb-4'>Default Title</h2>
                        : <h2 className='text-4xl font-nfbold text-red-600 mb-4'>{show.title}</h2>
                    }

                    {!show ? <p className='text-2xl text-red-600 mr-3 ml-3'>{renderRatingStars(5)}</p>
                        : <p className='text-2xl text-red-600 mr-3 ml-3 mb-4'>{renderRatingStars(show.rating)}</p>
                    }
                    {!show || show.note === '' ? <div></div>
                        : <p className='p-4 rounded-2xl bg-gray-700 text-xl text-gray-100 mr-3 ml-3 mb-4'>{show.note}</p>
                    }
                    <div className="flex justify-center gap-4"> {/* Flex container with gap */}
                        <button
                            onClick={handleCloseModal}
                            className="transition ease-in-out duration:300 bg-red-600 hover:bg-red-700 text-white text-xl font-nfbold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Close
                        </button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    )
}

export default InfoModal