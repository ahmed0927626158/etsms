///script to update teacher info
$(document).ready(function() {
    let studentId;
    // When the edit icon is clicked
    $(document).on('click', '#update-student-info', function() {
         studentId = $(this).data('id');

        // Make an AJAX request to fetch teacher details from the server
        $.ajax({
            url: `/api/student/info/${studentId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(studentData) {
                // Populate the modal fields
                $('#studentId').val(studentData.id);
                $('#firstname').val(studentData.firstname);
                $('#middlename').val(studentData.middlename);
                $('#lastname').val(studentData.lastname);
                $('#gender').val(studentData.gender);
                $('#birthdate').val(studentData.birthdate);
                $('#address').val(studentData.address);
                $('#grade').val(studentData.grade);
                $('#section').val(studentData.letter);
                $('#letter').val(studentData.letter_grade_id);
                // Show the modal
                $('#updateModal').modal('show');
            },
            error: function() {
                alert('Error fetching student information');
            }
        });
    });

    // Handle form submission
    $('#saveChanges').click(function() {
       
        const updatedData = {
            id: $('#studentId').val(),
            firstname: $('#firstname').val(),
            middlename: $('#middlename').val(),
            lastname: $('#lastname').val(),
            gender: $('#gender').val(),
            birthdate: $('#birthdate').val(),
            address: $('#address').val(),
            grade: $('#grade').val(),
            letter: $('#section').val(),
            letter_grade_id:$('#letter_grade_id').val()
            
    
        };
        
        // Send the updated data to your server
        $.ajax({
            
            url: `/api/student/update/${studentId}`, // Your update endpoint
            method: 'PUT',
            data: updatedData,
            success: function(response) {
                // Handle success (e.g., refresh the table or show a success message)
                $('#updateModal').modal('hide');
                // Optionally refresh the table data here
                Swal.fire({
                    title: "The student was updated successfully",
                    icon: "success"
                });
            
                // Set a timeout to reload the page after 3 seconds (3000 milliseconds)
                setTimeout(function() {
                    location.reload(); // Reload the page to see the updated data
                }, 3000); // Adjust the time as needed (3000 ms = 3 seconds)
                
            },
            error: function(xhr, status, error){
                $('#updateModal').modal('hide');
                Swal.fire({
                        icon: "error",
                        title: xhr.responseJSON.error,
                        text: '',
                      });
                     
              }
          });
    });
});