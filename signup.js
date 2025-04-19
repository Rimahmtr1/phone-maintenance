console.log('signup.js is loaded'); // Confirm the script is loaded

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('Signup');
    const messageElement = document.getElementById('message');
    const signupButton = document.querySelector('.signup-button'); // Select the button

    // Event listener for the signup button
    signupButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission

        // Get input values
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('c-password').value.trim();

        // Call the validation function
        const validationResult = validateForm(firstName, lastName, phone, email, password, confirmPassword);

        // Display the result
        if (validationResult.success) {
            messageElement.textContent = 'Signup successful!';
            messageElement.style.color = 'green'; // Success message color
            form.reset(); // Clear the form
        } else {
            messageElement.textContent = validationResult.message;
            messageElement.style.color = 'red'; // Error message color
        }
    });

    // Function to validate the form inputs
    function validateForm(firstName, lastName, phone, email, password, confirmPassword) {
        // Regular expressions for validation
        const namePattern = /^[A-Za-z]+$/; // Only letters
        const phonePattern = /^(03|76|78|81|70|71)[0-9]{6}$/; // Valid Lebanese phone number without country code
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format

        // Validation checks
        if (!namePattern.test(firstName)) {
            return { success: false, message: 'Please enter a valid first name.' };
        }
        if (!namePattern.test(lastName)) {
            return { success: false, message: 'Please enter a valid last name.' };
        }
        if (!phonePattern.test(phone)) {
            return { success: false, message: 'Please enter a valid phone number (8 digits starting with 03, 76, 78, 81, 70, or 71).' };
        }
        if (!emailPattern.test(email)) {
            return { success: false, message: 'Please enter a valid email address.' };
        }
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }
        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match.' };
        }

        // If all validations pass
        return { success: true };
    }

    // Toggle password visibility using eye icons
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('c-password');

    togglePassword.addEventListener('click', function() {
        // Toggle the type attribute for password field
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye'); // Toggle eye icon
        this.classList.toggle('fa-eye-slash'); // Toggle eye-slash icon
    });

    toggleConfirmPassword.addEventListener('click', function() {
        // Toggle the type attribute for confirm password field
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye'); // Toggle eye icon
        this.classList.toggle('fa-eye-slash'); // Toggle eye-slash icon
    });
});
