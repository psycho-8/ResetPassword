// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCiKGqbiW7sPoJpcoIUkwyi8tnpgVIv_zY",
    authDomain: "thss-1.firebaseapp.com",
    projectId: "thss-1",
    storageBucket: "thss-1.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById('resetForm');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const resetButton = document.getElementById('resetButton');
const successMessage = document.getElementById('successMessage');
const generalError = document.getElementById('generalError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');

function validatePassword(pass) {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};:,.<>?]/.test(pass);
    
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset error messages
    passwordError.style.display = 'none';
    confirmError.style.display = 'none';
    generalError.style.display = 'none';
    
    const pass = password.value;
    const confirm = confirmPassword.value;

    if (!validatePassword(pass)) {
        passwordError.textContent = 'Password does not meet requirements';
        passwordError.style.display = 'block';
        return;
    }

    if (pass !== confirm) {
        confirmError.textContent = 'Passwords do not match';
        confirmError.style.display = 'block';
        return;
    }

    resetButton.disabled = true;
    
    try {
        // Get the action code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const actionCode = urlParams.get('oobCode');

        // Confirm the password reset
        await confirmPasswordReset(auth, actionCode, pass);
        
        successMessage.style.display = 'block';
        form.reset();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = '/';  // Update this to your login page URL
        }, 2000);
    } catch (error) {
        generalError.textContent = error.message;
        generalError.style.display = 'block';
        resetButton.disabled = false;
    }
});
