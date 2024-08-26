///Script to show student information
$(document).ready(function() {
    // Event listener for the info icon
    $('#fam_stud_info_table').on('click', '#show-family-student-info[data-id]', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior

        // Get the student ID from the clicked icon
        var famStudId = $(this).data('id');

        // Make an AJAX request to fetch student details from the server
        $.ajax({
            url: `/api/family-student/info/${famStudId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Populate the modal with the fetched data
                var familyFullName=data.family_firstname + ' '+ data.family_middlename +' '+ data.family_lastname
                var studentFullName=data.student_firstname + ' '+ data.student_middlename +' '+ data.student_lastname
                var studentClass=data.grade + data.letter
                $('#modalFamilyFullName').text(familyFullName);
                $('#modalFamilyGender').text(data.family_gender);
                $('#modalFamilyPhone').text(data.family_phone);
                $('#modalFamilyEmail').text(data.family_email);
                $('#modalFamilyAddress').text(data.family_address);
                //student
                $('#modalStudentFullName').text(studentFullName);
                $('#modalStudentGender').text(data.student_gender);
                $('#modalClass').text(studentClass);
                //$('#modalFamilyEmail').text(data.family_email);
                //$('#modalFamilyAddress').text(data.family_address);
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