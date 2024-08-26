
let itemId;
// Show modal on delete button click
$(document).on('click', '.delete-teacher',function() {
    itemId = this.getAttribute('data-id');
    $('#deleteModal').modal('show');
});

// Confirm deletion
document.getElementById('confirmDelete').addEventListener('click', function() {
$('#confirmDelete').prop('disabled', true); // Disable the button to prevent multiple clicks

fetch(`/api/techer/delete/${itemId}`, {
    method: 'DELETE'
})
.then(response => {
    $('#confirmDelete').prop('disabled', false); // Re-enable the button

    if (response.ok) { // Check if the response status is OK (200-299)
        $('#deleteModal').modal('hide');
        Swal.fire({
            title: "The teacher deleted successfully",
            icon: "success"
        });
    } else {
        return response.json().then(errorData => {
            throw new Error(errorData.error || "An error occurred"); // Handle error response
        });
    }
})
.catch(error => {
    $('#confirmDelete').prop('disabled', false); // Re-enable the button on error
    $('#deleteModal').modal('hide');
    Swal.fire({
        icon: "error",
        title: error.message, // Display the error message
        text: '',
    });
});
});

