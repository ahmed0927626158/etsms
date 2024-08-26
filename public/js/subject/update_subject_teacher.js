///script to update teacher info
$(document).ready(function() {
    let subjectTeacherId;
    // When the edit icon is clicked
    $(document).on('click', '#update-subject-teacher-info', function(event) {
        subjectTeacherId = $(this).data('id');
        event.preventDefault(); // Prevent the default anchor behavior
        document.getElementById('add-assign-subject-teacher-box').style.display = 'none'; // Hide add-box
        document.getElementById('update-assign-subject-teacher-box').style.display = 'block'; // Show update-box
         

        // Make an AJAX request to fetch teacher details from the server
        $.ajax({
            url: `/api/techer-grade-subject/info/${subjectTeacherId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                //$('#usubject_id').val(teacherData.teachername);
                //$('#title-value').val(teacherData.title);
               
                //var section="A"
                /*
                // Populate the modal fields
                $('#uteacher_id').val(subjectTeacherData.teachername);
                $('#title').val(subjectTeacherData.title);
                //alert(subjectTeacherData.t.id)
                // Show the block
                
                $('#update-assign-subject-teacher-box').show();
                $('#subject-teacher-status').html('Update Assign Teacher'); // Update the tab text
                */
                const subjectTeacherData = response.teacherData; // Assuming you want the first result
                const subjects = response.subjects;
        
                // Populate the modal fields
                //$('#uteacher_id').val(subjectTeacherData.id);
                //$('#uletter_grade_id').val(subjectTeacherData.section);
                //$('#uselect_grade').val(subjectTeacherData.grade);
        
                //$('#uteacher_id').empty(); // Clear existing options
                $('#uteacher_id').append('<option value="select">Select Teacher</option>'); // Default option
                subjectTeacherData.forEach(teacherD => {
                    $('#uteacher_id').append(`<option value="${teacherD.id}">${teacherD.firstname}</option>`);
                });
                // Populate the subjects dropdown
               $('#usubject_id').empty(); // Clear existing options
                $('#usubject_id').append('<option value="select">Select Subject</option>'); // Default option
                subjects.forEach(subject => {
                    $('#usubject_id').append(`<option value="${subject.id}">${subject.title}</option>`);
                });
        
                // Show the block
                $('#update-assign-subject-teacher-box').show();
                $('#subject-teacher-status').html('Update Assign Teacher'); // Update the tab text
            },
            error: function() {
                alert('Error fetching student information');
            }
        });
    });

    // Handle form submission
    $('#saveChanges').click(function() {
       
        const updatedData = {
            id: $('#subjectId').val(),
            title: $('#title').val(),
            
            
    
        };
        
        // Send the updated data to your server
        $.ajax({
            
            url: `/api/techer-grade-subject/update/${studentId}`, // Your update endpoint
            method: 'PUT',
            data: updatedData,
            success: function(response) {
                // Handle success (e.g., refresh the table or show a success message)
                $('#updateModal').modal('hide');
                // Optionally refresh the table data here
                Swal.fire({
                    title: "The subject-teacher link has been updated successfully",
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