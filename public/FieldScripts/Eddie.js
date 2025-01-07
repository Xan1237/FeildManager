let submitButton = document.getElementById("submit");

submitButton.addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent default form submission immediately

    // Collect form values
    let email = document.getElementById("email").value;
    let userName = document.getElementById("name").value;
    let day = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let phone = document.getElementById("phone").value;
    let field = "Eddie";

    console.log("Email:", email);
    console.log("Time:", time);

    // Retrieve JWT token from localStorage 
    const token = localStorage.getItem('authToken'); 

    if (!token) {
        console.error("JWT Token not found. Please log in again.");
        alert("Authentication token missing. Please log in again.");
        return;
    }

    //sends booking details to the backend
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
});
