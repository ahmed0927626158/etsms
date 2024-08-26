///script to update teacher info
 
$(document).ready(function() {
    let subjectId;
    // When the edit icon is clicked
    $(document).on('click', '#update-subject', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        document.getElementById('add-box').style.display = 'none'; // Hide add-box
        document.getElementById('update-box').style.display = 'block'; // Show update-box
         subjectId = $(this).data('id');

        // Make an AJAX request to fetch teacher details from the server
        $.ajax({
            url: `/api/subject/info/${subjectId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(subjectData) {
                // Populate the modal fields
                $('#subjectId').val(subjectData.id);
                $('#title-value').val(subjectData.title);
               
                // Show the block
                $('#update-box').show();
                $('#subject-status').html('Update Subject'); // Update the tab text
            },
            error: function() {
                alert('Error fetching student information');
            }
        });
    });

    // Handle form submission
    $('#save-update').click(function() {
       
        const updatedData = {
            id: $('#subjectId').val(),
            update_title: $('#title-value').val(),
            
            
    
        };
        
        // Send the updated data to your server
        $.ajax({
            
            url: `/api/subject/update/${subjectId}`, // Your update endpoint
            method: 'PUT',
            data: updatedData,
            success: function(response) {
                // Handle success (e.g., refresh the table or show a success message)
                //$('#update-box').show();
                // Optionally refresh the table data here
                Swal.fire({
                    title: "The subject has been updated successfully",
                    icon: "success"
                });
            
                // Set a timeout to reload the page after 3 seconds (3000 milliseconds)
                setTimeout(function() {
                    location.reload(); // Reload the page to see the updated data
                }, 3000); // Adjust the time as needed (3000 ms = 3 seconds)
                
            },
            error: function(xhr, status, error){
                $('#update-box').modal('hide');
                Swal.fire({
                        icon: "error",
                        title: xhr.responseJSON.error,
                        text: '',
                      });
                     
              }
          });
    });
});