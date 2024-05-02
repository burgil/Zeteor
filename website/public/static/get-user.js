async function getUser() {
    try {
        const user = await fetch('/get-user');
        const userData = await user.json();
        if (userData.error) {
            console.log(userData.error);
            // notify(userData.error, 'error', 3500);
            loadLoggedOutInterface();
        } else {
            loadLoggedInInterface(userData);
        }
    } catch (e) {
        console.log(e.message);
        // notify(e.message, 'error', 3500);
        loadLoggedOutInterface();
    }
}
getUser()