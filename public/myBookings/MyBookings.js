// Function to fetch and display bookings
async function displayBookings() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'index.html'; 
            return;
        }
        //gets bookings
        const response = await fetch('/api/MyBookings', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        //gets booking
        const bookings = await response.json();
        const bookingTable = document.getElementById('booking-table');
        bookingTable.innerHTML = ''; // Clear existing rows

        // adds new version for every booking
        bookings.forEach((booking, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${booking.userName}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.day}</td>
                <td>${booking.time}</td>
                <td>${booking.field}</td>
                <td>
                    <button id="brown" class="btn btn-delete" data-booking-id="${booking.id}">
                        Delete
                    </button>
                </td>
            `;
            bookingTable.appendChild(row);
        });

        // Add delete button event listeners
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDeleteBooking);
        });

    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('unauthorized')) {
            window.location.href = '/login.html';
        }
    }
}

// Handle booking deletion
async function handleDeleteBooking(event) {
    const bookingId = event.target.dataset.bookingId;
    
    try {
        //gets jwt auth token
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete booking');
        }

        // Refresh the bookings display
        displayBookings();
    } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
    }
}

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    displayBookings();
});