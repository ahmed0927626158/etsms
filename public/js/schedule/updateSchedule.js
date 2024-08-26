///script to update teacher info
 
$(document).ready(function() {
    let scheduleId;
    // When the edit icon is clicked
    $(document).on('click', '#update-schedule', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        document.getElementById('add-schedule-box').style.display = 'none'; // Hide add-box
        document.getElementById('update-schedule-box').style.display = 'block'; // Show update-box
         scheduleId = $(this).data('id');
         $.ajax({
            url: `/api/schedule/info/${scheduleId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                // Check if data is available
                if (response.data) {
                    const data = response.data;

                    // Construct the grade and section string
                    const grade_section = `${data.grade} ${data.letter}`;
                    const section = data.day_title;
                    const scheduleid = data.schedule_id;
                    // Populate the form fields
                    $('#day-grade-section-value').text(grade_section); // Use .text() for span
                    $('#day-section-value').text(section); // Use .text() for span
                    $('#day-schedule-id-value').text(scheduleid); 
                    // Show the update schedule box
                    $('#update-schedule-box').show();
                    $('#update-date-schedule-nav-text').html('Update Schedule Date With Class'); // Update the tab text
                } else {
                    alert('No data found for the given schedule ID.');
                }
            },
            error: function() {
                alert('Error fetching schedule information');
            }
        });
        
    });

    // Handle form submission
    $('#save-update-schedule-day').click(function() {
       
        const updatedData = {
            schedule_id: $('#day-schedule-id-value').val(),
            update_day: $('#title-value').val(),
            
            
    
        };
        
        // Send the updated data to your server
        $.ajax({
            
            url: `/api/schedule/update/${scheduleId}`, // Your update endpoint
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