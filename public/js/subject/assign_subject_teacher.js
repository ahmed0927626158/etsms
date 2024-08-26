
$( document ).ready(async function() {
    // Feych all teachers
        const select_teacher=document.getElementById("teacher_id")
        const teachers= await fetch("/api/techer/all",{
                method:"GET"
        })
            const data=await teachers.json()
       
            data.data.forEach(teacher => {
                const option=document.createElement('option')
                option.value=teacher.id
                option.text=teacher.readable
                select_teacher.appendChild(option)
            });

    // Get all courses
    const select_subject=document.getElementById("subject_id")
        const subjects= await fetch("/api/subject/subject-assign",{
                method:"GET"
        })
            const subject_data=await subjects.json()
            subject_data.subject_data.forEach(subject => {
                const option=document.createElement('option')
                option.value=subject.id
                option.text=subject.title
                select_subject.appendChild(option)
            });
            const select_grade=document.getElementById("select_grade")
        const grades= await fetch("/api/grade/all",{
                method:"GET"
        })
            const grade_data=await grades.json()
            grade_data.data.forEach(grade => {
                const option=document.createElement('option')
                option.value=grade.grade
                option.text=grade.grade
                select_grade.appendChild(option)
            });
            // fetch all section when the grade class is changed
            $("#select_grade").on("change",async function(){
                var selectedGrade=$(this).val().trim();
                if(selectedGrade!='select'){
                  const section_grade=document.getElementById("letter_grade_id")
                   const sections= await fetch("/api/letter-grade/section-of-grade/"+selectedGrade,{
                                    method:"GET"
                                })
                        const data=await sections.json()
                        section_grade.innerHTML=''
                        const optionElement = document.createElement('option');
                        optionElement.text = 'Select Section';
                        optionElement.value = 'select';
                        section_grade.appendChild(optionElement)
                        data.data.forEach(section => {
                            const option=document.createElement('option')
                            option.value=section.id
                            option.text=section.letter
                            section_grade.appendChild(option)
                        })    
                }
                })
    
            })

            // Submit the form
            
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
                title:"Subject Assigned",
                icon: "success"
                });
                setTimeout(function() {
                    location.reload(); // Reload the page to see the updated data
                }, 3000); // Adjust the time as needed (3000 ms = 3 seconds)
                
            },
            error: function(xhr, status, error){
              $('#register').prop('disabled', false);
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

 