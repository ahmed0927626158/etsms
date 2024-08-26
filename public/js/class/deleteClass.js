let grade;
// Show modal on delete button click
$(document).on('click', '#delete-class',function() {
    grade = this.getAttribute('data-id');
    $('#deleteModal').modal('show');
});

// Confirm deletion
document.getElementById('confirmDelete').addEventListener('click', function() {
$('#confirmDelete').prop('disabled', true); // Disable the button to prevent multiple clicks

fetch(`/api/grade/delete/${grade}`, {
    method: 'DELETE'
})
.then(response => {
    $('#confirmDelete').prop('disabled', false); // Re-enable the button

    if (response.ok) { // Check if the response status is OK (200-299)
        $('#deleteModal').modal('hide');
        Swal.fire({
            title: "The class removed successfully",
            icon: "success"
        });
    
        // Set a timeout to reload the page after 3 seconds (3000 milliseconds)
        setTimeout(function() {
            location.reload(); // Reload the page to see the updated data
        }, 3000); // Adjust the time as needed (3000 ms = 3 seconds)
    } else {
        return response.json().then(errorData => {
            throw new Error(errorData.error || "An error occurred"); // Handle error response
        });
    }
})
.catch(error => {
    $('#subject-teacher-confirmDelete').prop('disabled', false); // Re-enable the button on error
    $('#subject-teacher-deleteModal').modal('hide');
    Swal.fire({
        icon: "error",
        title: error.message, // Display the error message
        text: '',
    });
});
});