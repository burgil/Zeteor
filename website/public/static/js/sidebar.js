const sidebar = document.querySelector('#sidebar a[href="' + location.pathname + '"]');
if (sidebar) {
    sidebar.parentElement.classList.add('active');
} else {
    const subSidebar = document.querySelector('#subSidebar a[href="' + location.pathname + '"]');
    if (subSidebar) subSidebar.parentElement.classList.add('active');
}