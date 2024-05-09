function loadLoggedInInterface(userData) {
    const userPic = document.getElementById('user-pic');
    const userName = document.getElementById('user-name');
    userName.textContent = userData.global_name;
    userPic.src = userData.avatar;
    const discordAppMount = document.querySelector('.discord-app-mount');
    if (discordAppMount) discordAppMount.style.display = 'none';
    const serversContainer = document.querySelector('.servers-container');
    if (serversContainer) {
        document.getElementById('server-loader').remove();
        loadServers(userData, serversContainer);
        document.getElementById('refresh-servers').addEventListener('click', async function () {
            serversContainer.innerHTML = `<div class="server" id="server-loader">
                <div class="server-img"><img src="./images/loading.gif">
                </div>
                <p>Loading...</p>
            </div>`;
            userName.textContent = 'Loading...';
            userPic.src = './images/loading.gif';
            const user = await fetch('/get-user?update=1');
            userData = await user.json();
            if (userData.error) {
                if (userData.error == 'Request failed with status code 429') {
                    notify('Too many requests...', 'error', 5000);
                    document.getElementById('server-loader').remove();
                    const noServers = document.createElement('div');
                    noServers.textContent = 'Too many requests... Please try again later!';
                    serversContainer.append(noServers);
                } else {
                    notify(userData.error, 'error', 5000);
                    document.getElementById('server-loader').remove();
                    const noServers = document.createElement('div');
                    noServers.textContent = userData.error;
                    serversContainer.append(noServers);
                }
                return;
            }
            document.getElementById('server-loader').remove();
            loadServers(userData, serversContainer);
            userName.textContent = userData.global_name;
            userPic.src = userData.avatar;
        });
    }
    const twentyFourHours = 12 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const lastVisit = localStorage.getItem('lastVisit');
    if (!lastVisit || (currentTime - parseInt(lastVisit)) >= twentyFourHours) {
        notify(`Welcome back, ${userData.username}!`, 'success', 3500);
        localStorage.setItem('lastVisit', currentTime.toString());
    }
}