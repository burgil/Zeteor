function getUsername() {
    return (
        process.env.SUDO_USER ||
        process.env.C9_USER ||
        process.env.LOGNAME ||
        process.env.USER ||
        process.env.LNAME ||
        process.env.USERNAME
    );
}
const isSecure = getUsername().toLowerCase() === 'ubuntu'; // this had issue with linux developers running the project locally: process.platform !== 'win32';

module.exports = {
    isSecure
};