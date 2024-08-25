
const assign_subject_teacher=document.getElementById("assign_subject_teacher")
let count = 0
assign_subject_teacher.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  validateInputs()
})

const setError = (element, message) => {
 
    const inputControl = element.parentElement;
   
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
   
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
    count += 1
    if(count==4) {
        var data = new FormData(assign_subject_teacher);
        var formDataObj = {};
        for (var [key, value] of data) {
            formDataObj[key] = value;
            }
            console.log(formDataObj)

        $('#register').prop('disabled', true);
        $.ajax({
            url: "/api/techer-grade-subject/register",
            type: "POST",
            data: formDataObj,
            datatype: "json",
            success: function(resp) 
            {
            $('#register').prop('disabled', false);
            assign_subject_teacher.reset();
            
            Swal.fire({
                title:"Student Registered Success",
                icon: "success"
                });
            },
            error: function(xhr, status, error){
              $('#register').prop('disabled', false);
              assign_subject_teacher.reset();
              Swal.fire({
                      icon: "error",
                      title: xhr.responseJSON.error,
                      text: '',
                    });  
            }
        });
    }
};

const validateInputs = () => {
const teacher_id = document.getElementById('teacher_id');
const subject_id = document.getElementById('subject_id');
const select_grade = document.getElementById('select_grade');
const letter_grade_id = document.getElementById('letter_grade_id');

     var teacherValue=teacher_id.value;
      var subjectValue=subject_id.value;
      var gradeValue=select_grade.value;
      var letterValue=letter_grade_id.value;

    if(teacherValue === ''||teacherValue=='select') {
        setError(teacher_id, 'Please Select teacher');
    } else {
        setSuccess(teacher_id);
    }
    
    if(subjectValue === ''||subjectValue=='select') {
        setError(subject_id, 'Please select subject');
    } else {
        setSuccess(subject_id);
    }
    if(letterValue ==''||letterValue=='select') {
        setError(letter_grade_id, 'Please select Section');
    } 
     else {
        setSuccess(letter_grade_id);
    }
   
    if(gradeValue=='select'){
        setError(select_grade, 'Please Select Grade');
    }
    else{
        setSuccess(select_grade);
    }
};