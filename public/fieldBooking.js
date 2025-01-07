let submitButton = document.getElementById("submit");
submitButton.addEventListener('click', function(event){

    let email = document.getElementById("email").value;
    let userName = document.getElementById("name").value;
    let day = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let phone = document.getElementById("phone").value;
    let field = "Conrose";
    console.log(email)
    event.preventDefault();
    fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            field : field,
            email: email,
            userName: userName,
            phone, phone,
            day : day,
            time : time
        })
    })
});