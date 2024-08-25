
const add_student=document.getElementById("add_student")
let count = 0
add_student.addEventListener('submit', (event) => {
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
    if(count==15) {
        var data = new FormData(add_student);
        var formDataObj = {};
        for (var [key, value] of data) {
            formDataObj[key] = value;
            }

        $('#register').prop('disabled', true);
        $.ajax({
            url: "/api/student/register",
            type: "POST",
            data: formDataObj,
            datatype: "json",
            success: function(resp) 
            {
            $('#register').prop('disabled', false);
            add_student.reset();
            console.log(resp)
            Swal.fire({
                title:"Student Registered Success",
                icon: "success"
                });
            },
            error: function(xhr, status, error){
              $('#register').prop('disabled', false);
              add_student.reset();
              Swal.fire({
                      icon: "error",
                      title: xhr.responseJSON.error,
                      text: '',
                    });
                   
            }
        });
    }
};



const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
const firstname = document.getElementById('firstname');
const middlename = document.getElementById('middlename');
const lastname = document.getElementById('lastname');
const gender = document.getElementById('gender');
const grade = document.getElementById('select_grade');
const birthdate = document.getElementById('datepicker');
const address = document.getElementById('address');
const letter = document.getElementById('letter_grade_id');
     var firstnamevalue=firstname.value;
      var middlenameValue=middlename.value;
      var lastnamevalue=lastname.value;
      var birthdateValue=birthdate.value;
      var addressValue=address.value;
      var letterValue=letter.value;
      var gradeValue=grade.value;
      var genderValue=gender.value;
      
      
      
      
    


    if(lastnamevalue === '') {
        setError(lastname, 'Last name is required');
    } else {
        setSuccess(lastname);
    }
    
    if(middlenameValue === '') {
        setError(middlename, 'Middle name is required');
    } else {
        setSuccess(middlename);
    }
    
    if(firstnamevalue==='') {
        setError(firstname, 'First name is required');
    } 
    else {
        setSuccess(firstname);
    }


    if(birthdateValue==''||birthdateValue==null){
        setError(birthdate,"Birt Date is required")
    }
    else{
        setSuccess(birthdate)
    }
    if(addressValue==''){
        setError(address,"Address is required")
    }
    else{
        setSuccess(address)
    }

    if(genderValue=='select'){
        setError(gender, 'Please select gender');
    }
    else{
        setSuccess(gender);
    }

    if(letterValue ==''||letterValue=='select') {
        setError(letter, 'Please select Section');
    } 
     else {
        setSuccess(letter);
    }
   
    if(gradeValue=='select'){
        setError(grade, 'Please Select Class');
    }
    else{
        setSuccess(grade);
    }
    if(!$('input[type=radio]:checked').length) {
        setError(gender, ' Gender is required');
    } else {
        setSuccess(gender);
    }

};