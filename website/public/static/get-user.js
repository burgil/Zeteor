async function getUser(retries = 0) {
    try {
        // const twentyFourHours = 12 * 60 * 60 * 1000;
        // const currentTime = new Date().getTime();
        // const lastVisit = localStorage.getItem('lastVisit');
        // if (!lastVisit || (currentTime - parseInt(lastVisit)) >= twentyFourHours) {
        //     notify(`Welcome back, ${userData.username}!`, 'success', 3500);
        //     localStorage.setItem('lastVisit', currentTime.toString());
        // }
        const user = await fetch('/get-user');
        const userData = await user.json();
        if (userData.error) {
            if (userData.error == 'Request failed with status code 429') {
                notify('Too many requests...', 'error', 5000);
                setTimeout(function () {
                    notify('Retrying in 5...', 'warning', 1000);
                }, 1000);
                setTimeout(function () {
                    notify('Retrying in 4...', 'warning', 1000);
                }, 2000);
                setTimeout(function () {
                    notify('Retrying in 3...', 'warning', 1000);
                }, 3000);
                setTimeout(function () {
                    notify('Retrying in 2...', 'warning', 1000);
                }, 4000);
                setTimeout(function () {
                    notify('Retrying in 1...', 'warning', 1000);
                }, 5000);
                setTimeout(function () {
                    retries += 1;
                    if (retries > 3) {
                        notify('Too many attempts! Please try again later...', 'error', 3500);
                        loadLoggedOutInterface();
                    } else {
                        getUser(retries);
                    }
                }, 5000);
            } else {
                console.log(userData.error);
                loadLoggedOutInterface();
            }
        } else {
            loadLoggedInInterface(userData);
        }
    } catch (e) {
        console.log(e);
        notify(e.message, 'error', 3500);
        loadLoggedOutInterface();
    }
}
getUser()