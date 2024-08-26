///Script to show student information
$(document).ready(function() {
    // Event listener for the info icon
    $('#fam_info_table').on('click', '#show-family-info[data-id]', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior

        // Get the student ID from the clicked icon
        var familyId = $(this).data('id');

        // Make an AJAX request to fetch student details from the server
        $.ajax({
            url: `/api/family/info/${familyId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Populate the modal with the fetched data
                $('#modalFirstName').text(data.firstname);
                $('#modalMiddleName').text(data.middlename);
                $('#modalLastName').text(data.lastname);
                $('#modalGender').text(data.gender);
                $('#modalAddress').text(data.address);
                $('#modalPhone').text(data.phone);
                $('#modalEmail').text(data.email);
                //$('#modalEmail).text(data.email);
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
                    text: 'Could not retrieve family student information. Please try again later.'
                });
            }
        });
    });
});