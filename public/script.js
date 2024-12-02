let createAccount = document.getElementById("forgotPasswordButton");
let newAccount = document.getElementById("confirmPassword");
let loginText = document.getElementById("loginText");
let login = document.getElementById("logIn");

let create = false;
let forgotPasswordText = document.getElementById("forgotPasswordText");
createAccount.addEventListener( "click", function(){
    newAccount.style.display = "block";
    loginText.innerHTML = "Create Your New Account";
    login.innerHTML = "Create";
    forgotPasswordText.style.display = "none";
    create = true;
});

login.addEventListener("click", function(){
    if(create == true){
        let password1 = document.getElementById("password1").value;
        let password2 = document.getElementById("password2").value;
        let email = document.getElementById("email").value;

        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password1: password1,
                password2: password2
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
    }
});