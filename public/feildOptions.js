fetchProtectedData();
function fetchProtectedData() {
    const token = localStorage.getItem('authToken');

    fetch('/api/protected', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            // Handle unauthorized or forbidden access
            throw new Error('Unauthorized access');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Access granted to protected resource");
            // Proceed with accessing protected data
        } else {
            throw new Error('Access denied');
        }
    })
    .catch((error) => {
        // Prevent further access and redirect
    });
}

