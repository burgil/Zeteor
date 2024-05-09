async function getUser(retries = 0) {
    try {
        let updater = '';
        const parsedUrl = new URL(window.location.href);
        const guildIdURL = parsedUrl.searchParams.get('guild_id');
        if (guildIdURL) {
            updater = '?update=1';
        }  else {
            const fiveMinutes = 5 * 60 * 1000;
            const currentTime = new Date().getTime();
            const lastUpdate = localStorage.getItem('lastUpdate');
            if (!lastUpdate || (currentTime - parseInt(lastUpdate)) >= fiveMinutes) {
                localStorage.setItem('lastUpdate', currentTime.toString());
                updater = '?update=1';
            }
        }
        const user = await fetch('/get-user' + updater);
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