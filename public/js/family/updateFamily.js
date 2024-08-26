///script to update teacher info
$(document).ready(function() {
    let familyId;
    // When the edit icon is clicked
    $(document).on('click', '#update-family-info', function() {
         familyId = $(this).data('id');
        // Make an AJAX request to fetch teacher details from the server
        $.ajax({
            url: `/api/family/info/${familyId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(familyData) {
                // Populate the modal fields
                $('#familyId').val(familyData.id);
                $('#firstname').val(familyData.firstname);
                $('#middlename').val(familyData.middlename);
                $('#lastname').val(familyData.lastname);
                $('#gender').val(familyData.gender);
                $('#phone').val(familyData.phone);
                $('#email').val(familyData.email);
                $('#address').val(familyData.address);
                // Show the modal
                $('#updateModal').modal('show');
            },
            error: function() {
                alert('Error fetching family information');
            }
        });
    });

    // Handle form submission
    $('#saveChanges').click(function() {
       
        const updatedData = {
            id: $('#familyId').val(),
            firstname: $('#firstname').val(),
            middlename: $('#middlename').val(),
            lastname: $('#lastname').val(),
            gender: $('#gender').val(),
            address: $('#address').val(),
            phone: $('#phone').val(),
            email: $('#email').val()
        };
        // Send the updated data to your server
        $.ajax({
            
            url: `/api/family/update/${familyId}`, // Your update endpoint
            method: 'PUT',
            data: updatedData,
            success: function(response) {
                // Handle success (e.g., refresh the table or show a success message)
                $('#updateModal').modal('hide');
                // Optionally refresh the table data here
                Swal.fire({
                    title: "The family info was updated successfully",
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