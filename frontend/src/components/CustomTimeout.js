// timeout.js
const timeout = (delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Request timed out'));
        }, delay);
    });
};

export default timeout;