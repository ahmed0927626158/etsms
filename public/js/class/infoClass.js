
$(document).ready(function () {
    // When the edit icon is clicked
    $(document).on('click', '#update-class-only', function (event) {
        const gradeId = $(this).data('id'); // Get the ID of the grade to be updated
        event.preventDefault(); // Prevent the default anchor behavior
        // Fetch grade information
$.ajax({
    url: `/api/grade/grade-info/${gradeId}`, // Adjust the URL to your API endpoint
    type: 'GET',
    dataType: 'json',
    success: function (response) {
        const classData = response.classData; // Assuming classData is an array
        $('#gs_tableco').empty(); // Clear the existing table data

        classData.forEach((item, index) => {
            $('#gs_tableco').append(`
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <input type="text" class="form-control form-control-sm" value="${item.grade}" data-id="${item.grade_id}" id="grade-${item.grade_id}" required/>
                        <input type="hidden" class="form-control form-control-sm" value="${item.grade_id}" id="grade_id-${item.grade_id}" required />
                    </td>
                    <td>
                        <select name="letter" class="form-control form-control-sm" id="grade_section-${item.grade_id}" disabled>
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
                        <input type="number" class="form-control form-control-sm" value="${item.max_section}" id="max_section-${item.grade_id}" required />
                    </td>
                    <td>
                        <a href="#"><i class="material-icons" id="update-row2" data-id="${item.grade_id}">edit</i></a>
                    </td>
                </tr>
            `);
        });
        $('#infoModal').modal('show'); // Show the modal
    },
    error: function () {
        alert('Error fetching class information');
    }
});
        /*$.ajax({
            url: `/api/grade/grade-info/${gradeId}`, // Adjust the URL to your API endpoint
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                const classData = response.classData; // Assuming classData is an array
                $('#gs_tableco').empty(); // Clear the existing table data
        
                classData.forEach((item, index) => {
                    $('#gs_tableco').append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <input type="text" class="form-control form-control-sm" value="${item.grade}" data-id="${item.id}" id="grade-${item.id}" required/>
                                <input type="text" hidden class="form-control form-control-sm" style="border:none;" value="${item.id}" data-id="${item.id}" id="grade_id-${item.id}" required />
                            </td>
                            <td>
                                <select name="letter" class="form-control form-control-sm" id="grade_section-${item.id}" disabled>
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
                            <td>
                                <a href="#"><i class="material-icons" id="update-row2" data-id="${gradeId}">edit</i></a>
                            </td>
                        </tr>
                    `);
                });
                $('#infoModal').modal('show'); // Show the modal
                
            },
            error: function () {
                alert('Error fetching class information');
            }
        });*/
        
        
    });
    // Handle update button click for each row
$(document).on('click', '#update-row2', function () {
    const id = $(this).data('id');
    const grade = $(`#grade-${id}`).val();
    const maxSection = $(`#max_section-${id}`).val();
    const grade_id = $(`#grade_id-${id}`).val();

    const updatedData = {
        id: id,
        grade_id: grade_id,
        new_grade: grade,
        max_section: maxSection
    };

    // Make an AJAX request to update the class information
    $.ajax({
        url: `/api/grade/edit/gradeonly`, // URL for updating class
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function (response) {
            $('#infoModal').modal('hide');
            Swal.fire({
                title: "The class updated successfully",
                icon: "success"
            });
            setTimeout(function () {
                location.reload();
            }, 3000);
        },
        error: function (jqXHR) {
            $('#infoModal').modal('hide');
            if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
                Swal.fire({
                    icon: "error",
                    title: jqXHR.responseJSON.error, // Display the error message from the response
                    text: '',
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "An unexpected error occurred", // Generic error message
                    text: '',
                });
            }
        }
    });
});
/*
    // Handle update button click for each row
    $(document).on('click', '#update-row2', function () {
        const id = $(this).data('id');
        const grade = $(`#grade-${id}`).val();
        const maxSection = $(`#max_section-${id}`).val();
        const grade_id = $(`#grade_id-${id}`).val();
        let updatedData;
        let url;

        
            // Update grade and max section
            updatedData = {
                id: id,
                grade_id: grade_id,
                new_grade: grade,
                max_section: maxSection
            };
            
            url = `/api/grade/edit/gradeonly`; // URL for updating class
            //alert(id,grade_id,grade,maxSection,"wachequsss")

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
                $('#infoModal').modal('hide');
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
    });*/
    
  
    

});
