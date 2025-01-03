fetchProtectedData();

/***
 * This function makes certain that the only way a users gains access to this site is if they first login
 * this is done using a token stored in local storege if the user does not have permission
 * aka a token they will get there acess rejected
 */
function fetchProtectedData() {
    const token = localStorage.getItem('authToken');
    //calls to backend
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
            window.location.href = './index.html';
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

