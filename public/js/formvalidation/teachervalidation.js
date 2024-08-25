
const form = document.getElementById('teacher-form');
let count = 0
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(form);
  validateInputs()
})

const setError = (element, message) => {
 
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');

    count += 1

    if(count==8) {
        var data = new FormData(form);
        var formDataObj = {};
        for (var [key, value] of data) {
            formDataObj[key] = value;
            }

        console.log(formDataObj)
        $('#register').prop('disabled', true);
        $.ajax({
            url: "/api/techer/register",
            type: "POST",
            data: formDataObj,
            datatype: "json",
            success: function(resp) 
            {
            $('#register').prop('disabled', false);
            form.reset();
            Swal.fire({
                title:resp,
                icon: "success"
                });
             
            },
            error: function(xhr, status, error){
              $('#register').prop('disabled', false);
              form.reset();
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
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const gender = document.getElementById('gender');
const level = document.getElementById('level');
const study = document.getElementById('study');

     var firstnamevalue=firstname.value;
      var middlenameValue=middlename.value;
      var lastnamevalue=lastname.value;
      var phonevalue=phone.value;
      var emailvalue=email.value;
      var genderValue=gender.value;
      var levelValue=level.value;
      var studValue=study.value;
    


    if(firstnamevalue === '') {
        setError(firstname, 'First name is required');
    } else {
        setSuccess(firstname);
    }
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

    if(emailvalue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailvalue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    if(phonevalue === '') {
        setError(phone, 'Phone is required');
    } 
     else {
        setSuccess(phone);
    }
    if(genderValue=='select'){
        setError(gender, 'Please select gender');
    }
    else{
        setSuccess(gender);
    }
   
    if(levelValue=='select'){
        setError(level, 'Please select level');
    }
    else{
        setSuccess(level);
    }
    if(studValue=='select'){
        setError(study, 'Please select study');
    }
    else{
        setSuccess(study);
    }

};