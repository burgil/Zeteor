async function getUser() {
    try {
        const user = await fetch('/get-user');
        const userData = await user.json();
        const userPic = document.getElementById('user-pic');
        const userName = document.getElementById('user-name');
        userName.textContent = userData.global_name;
        userPic.src = userData.avatar;
        notify(`Welcome back, ${userData.username}!`, 'success', 3500);
    } catch (e) {
        notify(e.message, 'error', 3500);
    }
}
getUser()