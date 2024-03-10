import React from 'react'

const WatchButton = ({watched, id, handleClick}) => {
    return (
        <div className='min-w-[150px]'>
            {watched === 'watched' ?
                <button
                    onClick={() => handleClick(id, watched)}
                    className='transition ease-in-out duration-300 p-2 text-lg border-2 rounded-2xl border-lime-400 text-lime-400 hover:scale-105 transform-gpu'
                >
                    Watched
                </button>
                :
                watched === 'watching' ?

                <button
                    onClick={() => handleClick(id, watched)}
                    className='transition ease-in-out duration-300 p-2 text-lg border-2 rounded-2xl border-fuchsia-500 text-fuchsia-500 hover:scale-105 transform-gpu'
                >
                    Watching
                </button> 
                : 
                <button
                    onClick={() => handleClick(id, watched)}
                    className='transition ease-in-out duration-300 p-2 text-lg border-2 rounded-2xl border-red-600 text-red-600 hover:scale-105 transform-gpu'
                >
                    Not Watched
                </button>
            }
        </div>
    )
}

export default WatchButton