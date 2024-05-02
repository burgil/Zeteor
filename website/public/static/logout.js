function loadLoggedOutInterface() {
    // remove logged in elements:
    document.querySelector('main').style.gridTemplateColumns = '0% 100%';
    document.querySelector('.main-menu').style.width = '0';
    document.querySelector('.right-content').style.display = 'none';
    document.querySelector('.content').style.gridTemplateColumns = '100% 0%';
    document.querySelector('.main-section').style.display = 'none';
    // add logged out elements:
    document.getElementById('logout').style.display = 'block';
}