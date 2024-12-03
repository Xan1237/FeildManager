
let createAccount = document.getElementById("forgotPasswordButton");
let newAccount = document.getElementById("confirmPassword");
let loginText = document.getElementById("loginText");
let login = document.getElementById("logIn");
localStorage.clear();
let create = false;
let forgotPasswordText = document.getElementById("forgotPasswordText");

createAccount.addEventListener("click", function() {
    newAccount.style.display = "block";
    loginText.innerHTML = "Create Your New Account";
    login.innerHTML = "Create";
    forgotPasswordText.style.display = "none";
    create = true;
});

login.addEventListener("click", function() {
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;
    let email = document.getElementById("email").value;

    if (create) {  // Account creation logic
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password1: password1,
                password2: password2
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Account created successfully");
                // Optionally redirect or show success message
            } else {
                console.log("Account creation failed:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    } else {  // Login logic
        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password1: password1
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('authToken', data.token);  // Store JWT token in localStorage
                console.log("Login successful");
                console.log(data.token);
                window.location.href = 'feildOptions.html'; // Redirect to a protected page after login
            } else {
                console.log(data.token);
                console.log("Login failed:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
});

