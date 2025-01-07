
let createAccount = document.getElementById("forgotPasswordButton");
let newAccount = document.getElementById("confirmPassword");
let loginText = document.getElementById("loginText");
let login = document.getElementById("logIn");
localStorage.clear();
let create = false;
let forgotPasswordText = document.getElementById("forgotPasswordText");


//when the create new account button is clickes
createAccount.addEventListener("click", function() {
    newAccount.style.display = "block";
    loginText.innerHTML = "Create Your New Account";
    login.innerHTML = "Create";
    forgotPasswordText.style.display = "none";
    create = true;
});


//when the login/create acount button is clicked
login.addEventListener("click", function() {
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;
    let email = document.getElementById("email").value;

    //create account logic
    if (create) {  
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
                window.location. reload();
                // Optionally redirect or show success message
            } else {
                console.log("Account creation failed:", data.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    } 

    //login process for someone who already has an account
    else {  
        //sends user details to the backend
        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password1: password1
            })
        })

        //gets the response on if its valid or not
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //stores the identity token for security reasons
                localStorage.setItem('authToken', data.token);  
                console.log("Login successful");
                console.log(data.token);
                //goes to feild selection site
                window.location.href = 'fieldOptions\\feildOptions.html'; 
            } else {
                //login failed
                let email = document.getElementById("email");
                let password1 = document.getElementById("password1");
                console.log(data.token);
                console.log("Login failed:", data.message);
                password1.style.borderColor = "red";
                email.style.borderColor = "red";
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
});

//changes layout to acomodate a account creation form
createAccount.addEventListener("click", function() {
    newAccount.style.display = "block";
    loginText.innerHTML = "Create Your New Account";
    login.innerHTML = "Create";
    forgotPasswordText.style.display = "none";
    createAccount.style.display = "none";
    create = true;
});




document.addEventListener('keydown', function(event) {
    // Check if the key pressed is "Enter"
    if (event.key === "Enter") {
        let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;
    let email = document.getElementById("email").value;

    //create account logic
    if (create) {  
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
    } 

    //login process for someone who already has an account
    else {  
        //sends user details to the backend
        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password1: password1
            })
        })

        //gets the response on if its valid or not
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //stores the identity token for security reasons
                localStorage.setItem('authToken', data.token);  
                console.log("Login successful");
                console.log(data.token);
                //goes to feild selection site
                window.location.href = 'fieldOptions\\feildOptions.html'; 
            } else {
                let password1 = document.getElementById("password1");
                let email = document.getElementById("email");
                console.log(data.token);
                console.log("Login failed:", data.message);
                password1.style.borderColor = "red";
                email.style.borderColor = "red";
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
    }
});