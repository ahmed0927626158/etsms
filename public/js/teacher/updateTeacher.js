///script to update teacher info
$(document).ready(function() {
    let teacherId;
    // When the edit icon is clicked
    $(document).on('click', '#update-teacher-info', function() {
         teacherId = $(this).data('id');

        // Make an AJAX request to fetch teacher details from the server
        $.ajax({
            url: `/api/techer/info/${teacherId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(teacherData) {
                // Populate the modal fields
                $('#teacherId').val(teacherData.id);
                $('#firstname').val(teacherData.firstname);
                $('#middlename').val(teacherData.middlename);
                $('#lastname').val(teacherData.lastname);
                $('#gender').val(teacherData.gender);
                $('#phone').val(teacherData.phone);
                $('#email').val(teacherData.email);
                $('#level').val(teacherData.level);
                $('#study').val(teacherData.study);
                // Show the modal
                $('#updateModal').modal('show');
            },
            error: function() {
                alert('Error fetching teacher information');
            }
        });
    });

    // Handle form submission
    $('#saveChange').click(function() {
       
        const updatedData = {
            id: $('#teacherId').val(),
            firstname: $('#firstname').val(),
            middlename: $('#middlename').val(),
            lastname: $('#lastname').val(),
            gender: $('#gender').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
            level: $('#level').val(),
            study: $('#study').val()
    
        };
        
        // Send the updated data to your server
        $.ajax({
            
            url: `/api/techer/update/${teacherId}`, // Your update endpoint
            method: 'PUT',
            data: updatedData,
            success: function(response) {
                // Handle success (e.g., refresh the table or show a success message)
                $('#updateModal').modal('hide');
                // Optionally refresh the table data here
                Swal.fire({
                    title: "The teacher was updated successfully",
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