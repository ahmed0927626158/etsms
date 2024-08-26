///Script to show student information
$(document).ready(function() {
    // Event listener for the info icon
    $('#stud_info_table').on('click', '#show-student-info[data-id]', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior

        // Get the student ID from the clicked icon
        var studentId = $(this).data('id');

        // Make an AJAX request to fetch student details from the server
        $.ajax({
            url: `/api/student/info/${studentId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Populate the modal with the fetched data
                $('#modalFirstName').text(data.firstname);
                $('#modalMiddleName').text(data.middlename);
                $('#modalLastName').text(data.lastname);
                $('#modalGender').text(data.gender);
                $('#modalBirthDate').text(data.birthdate);
                $('#modalAddress').text(data.address);
                $('#modalGrade').text(data.grade);
                $('#modalSection').text(data.letter);
                //$('#modalPasswordStatus').text(data.password_status);
                //$('#modalAccountStatus').text(data.account_status);

                // Show the modal
                $('#infoModal').modal('show');
            },
            error: function(xhr, status, error) {
                // Handle errors
                Swal.fire({
                    icon: 'error',
                    title: 'Error fetching data',
                    text: 'Could not retrieve student information. Please try again later.'
                });
            }
        });
    });
});