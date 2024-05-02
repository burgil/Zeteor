function loadLoggedInInterface(userData) {
    const userPic = document.getElementById('user-pic');
    const userName = document.getElementById('user-name');
    userName.textContent = userData.global_name;
    userPic.src = userData.avatar;
    console.log(userData.guilds);
    notify(`Welcome back, ${userData.username}!`, 'success', 3500);
}