let submitButton = document.getElementById("submit");
submitButton.addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent default form submission immediately

    // Collect form values
    let email = document.getElementById("email").value;
    let emailField = document.getElementById("email");

    let userName = document.getElementById("name").value;
    let userNameField = document.getElementById("name");
    let day = document.getElementById("date").value;
    let dayField = document.getElementById("date");

    let time = document.getElementById("time").value;
    let timeField = document.getElementById("time");

    let phone = document.getElementById("phone").value;
    let phoneField = document.getElementById("phone");

    let field = "Mainland";
    let valid = true;
    if(userName == ""){
        userNameField.style.borderColor = "red";
        console.log("hh")
        valid = false;
    }
    if(phone==""){
        phoneField.style.borderColor = "red";
        valid = false;
    }
    if(day==""){
        dayField.style.borderColor = "red";
        valid = false;
    }
    if(time==""){
        timeField.style.borderColor = "red";
        valid= false;
    }
    if(email==""){
        emailField.style.borderColor = "red";
        valid=false;
    }
    if(valid){
    console.log("Email:", email);
    console.log("Time:", time);

    // Retrieve JWT token from localStorage (or sessionStorage, depending on your setup)
    const token = localStorage.getItem('authToken'); 

    if (!token) {
        console.error("JWT Token not found. Please log in again.");
        alert("Authentication token missing. Please log in again.");
        return;
    }

    //submit booking details to the backend
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                field: field,
                email: email,
                userName: userName,
                phone: phone,
                day: day,
                time: time
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log("Booking successful:", result);
            if(result.BookingsFields.success){
                //time available
                alert("Booking successfully created!");
            }
            else{
                //not available
                alert("Time not available");
            }
        } else {
            console.error("Booking failed:", result.error || "Unknown error");
            alert(`Error: ${result.error || "Failed to create booking"}`);
        }
    } catch (error) {
        console.error("Network or server error:", error);
        alert("An error occurred while trying to book. Please try again later.");
    }
    window.location.href = "../myBookings/MyBookings.html"
}
});

let time = document.getElementById("time");
let day = document.getElementById("date").value;


checkTime();
function checkTime(){
        let dayNew = document.getElementById("date").value;
        if(day != dayNew){
            day = dayNew;
            getTimes();
        }
        setTimeout(checkTime, 1000);
};



console.log(day);
async function getTimes() {
    let day = document.getElementById("date").value;
    let timeSelect = document.getElementById("time");
    let field = "Mainland";
    // Clear the existing options
    timeSelect.innerHTML = "";

    // Fetch available times from the backend
    const response = await fetch('/api/availableTimes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: day,
            field: field
        })
    });

    const result = await response.json();
    if (response.ok) {
        const allTimes = [
            "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
            "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
            "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
            "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
        ];

        const unavailableTimes = result.dates.map(item => item.time);

        allTimes.forEach(time => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;

            if (unavailableTimes.includes(time)) {
                option.disabled = true;
                option.style.color = "red";
            }

            timeSelect.appendChild(option);
        });
    } else {
        console.error("Failed to fetch available times:", result.error || "Unknown error");
        alert("Failed to fetch available times. Please try again later.");
    }
}
