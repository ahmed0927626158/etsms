
$(document).ready(function () {
    // When the edit icon is clicked
    $(document).on('click', '#update-class', function (event) {
        const gradeId = $(this).data('id'); // Get the ID of the grade to be updated
        event.preventDefault(); // Prevent the default anchor behavior
        
        $.ajax({
            url: `/api/grade/info/${gradeId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                const classData = response.classData; // Assuming classData is an array
                $('#gs_table').empty(); // Clear the existing table data
        
                classData.forEach((item, index) => {
                    $('#gs_table').append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <input type="text" class="form-control form-control-sm" value="${item.grade}" data-id="${item.id}" id="grade-${item.id}" required/>
                                <input type="text" hidden class="form-control form-control-sm" style="border:none;" value="${item.grade_id}" data-id="${item.id}" id="grade_id-${item.id}" required />
                            </td>
                            <td>
                                <select name="letter" class="form-control form-control-sm" id="grade_section-${item.id}">
                                    <option value="${item.letter}" selected>${item.letter}</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="G">G</option>
                                    <option value="H">H</option>
                                </select>
                            </td>
                            <td>
                                <input type="number" class="form-control form-control-sm" value="${item.max_section}" id="max_section-${item.id}" required />
                            </td>
                            <td id="action-buttons-${item.id}">
                                <!-- Action buttons will be updated by updateInputFields -->
                            </td>
                        </tr>
                    `);
                });
        
                $('#updateModal').modal('show'); // Show the modal
                updateInputFields(); // Initialize the action buttons
            },
            error: function () {
                alert('Error fetching class information');
            }
        });
        
        // Function to update input fields and action buttons based on the selected operation type
        function updateInputFields() {
            const operationType = $('#letter_grade_id').val(); // Get the selected operation type
        
            // Update the table based on the selected operation type
            $('#gs_table tr').each(function() {
                const row = $(this);
                const gradeId = row.find('input[data-id]').data('id');
                //const letter_grade_id=row.find('')
        
                // Update the input fields based on the operation type
                if (operationType === 'update_section') {
                    row.find(`input[id="grade-${gradeId}"]`).attr('readonly', true);
                    row.find(`input[id="max_section-${gradeId}"]`).attr('readonly', true);
                    row.find(`select[id="grade_section-${gradeId}"]`).prop('disabled', false);
                    row.find(`#action-buttons-${gradeId}`).html(`
                        <a href="#"><i class="material-icons" id="update-row" data-id="${gradeId}">edit</i></a>
                        <a href="#"><i class="material-icons" id="delete-row" data-id="${gradeId}">delete</i></a>
                    `);
                } else if (operationType === 'update_class') {
                    row.find(`input[id="grade-${gradeId}"]`).attr('readonly', false);
                    row.find(`input[id="max_section-${gradeId}"]`).attr('readonly', false);
                    row.find(`select[id="grade_section-${gradeId}"]`).prop('disabled', true);
                    row.find(`#action-buttons-${gradeId}`).html(`
                        <a href="#"><i class="material-icons" id="update-row" data-id="${gradeId}">edit</i></a>
                    `);
                }
            });
        }
        
        // Listen for changes on the operation type dropdown
        $(document).on('change', '#letter_grade_id', function() {
            updateInputFields(); // Call the function to update input fields and action buttons on change
        });
        
        // When the modal is shown, update the input fields based on the default selection
        $('#updateModal').on('shown.bs.modal', function() {
            updateInputFields(); // Call the function to set initial states
        });
        
    });

    // Handle update button click for each row
    $(document).on('click', '#update-row', function () {
        const id = $(this).data('id');
        const operationType = $('#letter_grade_id').val(); // Get the selected operation type
        const grade = $(`#grade-${id}`).val();
        const section = $(`#grade_section-${id}`).val();
        const maxSection = $(`#max_section-${id}`).val();
        const grade_id = $(`#grade_id-${id}`).val();
        let updatedData;
        let url;

        if (operationType === "update_class") {
            // Update grade and max section
            updatedData = {
                id: id,
                grade_id: grade_id,
                new_grade: grade,
                max_section: maxSection
            };
            url = `/api/grade/edit/grade`; // URL for updating class
        } else if (operationType === "update_section") {
            // Update only the section
            updatedData = {
                id: id,
                section: section
            };
            url = `/api/grade/edit/section`; // URL for updating section
        }

        // Make an AJAX request to update the class information
        $.ajax({
            url: url, // Use the determined URL
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function (response) {
                $('#updateModal').modal('hide');
                Swal.fire({
                    title: "The class updated successfully",
                    icon: "success"
                });
                setTimeout(function () {
                    location.reload();
                }, 3000);
            },
            error: function (jqXHR) {
                // Handle the error response here
                $('#updateModal').modal('hide');
                // Check if the response has JSON data
                if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                    Swal.fire({
                        icon: "error",
                        title: jqXHR.responseJSON.error, // Display the error message from the response
                        text: '',
                    });
                } else {
                    // Fallback error message
                    Swal.fire({
                        icon: "error",
                        title: "An unexpected error occurred", // Generic error message
                        text: '',
                    });
                }
            }
        });
    });
    
    $(document).on('click', '#delete-row', function () {
        // Use SweetAlert2 for the confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // If the user confirmed, proceed with the deletion
                const id = $(this).data('id');
                const grade = $(`#grade-${id}`).val();
                const maxSection = $(`#max_section-${id}`).val();
                const grade_id = $(`#grade_id-${id}`).val();
                let updatedData;
                let url;
                    updatedData = {
                        id: id,
                        grade_id: grade_id,
                        new_grade: grade,
                        max_section: maxSection
                    };
                    url = `/api/grade/delete/section/${grade_id}`; // URL for updating class
                
                $.ajax({
                    url: url, // Use the determined URL
                    type: 'DELETE',
                    contentType: 'application/json',
                    data: JSON.stringify(updatedData),
                    success: function (response) {
                        $('#updateModal').modal('hide');
                        Swal.fire({
                            title: "The section deleted successfully",
                            icon: "success"
                        });
                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    },
                    error: function (jqXHR) {
                        console.log("woyyy")
                        // Handle the error response here
                        $('#updateModal').modal('hide');
                        // Check if the response has JSON data
                        if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                            Swal.fire({
                                icon: "error",
                                title: jqXHR.responseJSON.error, // Display the error message from the response
                                text: '',
                            });
                        } else {
                            // Fallback error message
                            Swal.fire({
                                icon: "error",
                                title: "An unexpected error occurred", // Generic error message
                                text: '',
                            });
                        }
                    }
                });
            }
        });
    });
    

});
