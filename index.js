const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
// Check if a user is logged in
const userId = localStorage.getItem('loggedUserId');

if (userId) {
    // If user is logged in, make the profile icon visible
    document.getElementById('profileIcon').style.display = 'flex';
    document.getElementById('profileIcon').addEventListener('click', function() {
        // Redirect to profile page when clicking the profile icon
        window.location.href = 'profile.html';
    });
} else {
    // If no user is logged in, ensure the profile icon is hidden
    document.getElementById('profileIcon').style.display = 'none';
}
