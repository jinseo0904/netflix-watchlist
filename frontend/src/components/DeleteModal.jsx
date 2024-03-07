import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

const DeleteModal = ({isModalOpen, handleCloseModal, apiDeleteRequest, selectedShowTitle}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        boxShadow: 24,
        outline: 'none',
        p: 4,
    };

    return (
        <Modal
            aria-labelledby="delete-show-modal"
            aria-describedby="delete the show fro the watchlist"
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
                    <h2 className='text-4xl font-nfbold text-red-600 mb-4'>Are you sure?</h2>
                    <p className='justify-center items-center text-lg font-nfsans text-white mb-4'>This will delete the show &nbsp; <span className='text-xl text-red-600 font-nfbold'> {selectedShowTitle} </span>&nbsp; from your watchlist.</p>
                    <div className="flex justify-center gap-4"> {/* Flex container with gap */}
                        <button
                            onClick={apiDeleteRequest}
                            className="transition ease-in-out duration:300 bg-red-600 hover:bg-red-700 text-white text-xl font-nfbold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Delete
                        </button>
                        <button
                            onClick={handleCloseModal}
                            className="transition ease-in-out duration:300 bg-red-600 hover:bg-red-700 text-white text-xl font-nfbold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    )
}

export default DeleteModal