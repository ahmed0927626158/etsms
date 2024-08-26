
const add_family=document.getElementById("add_family")
let count = 0
add_family.addEventListener('submit', (event) => {
  event.preventDefault(); 

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
    if(count==7) {
        var data = new FormData(add_family);
        var formDataObj = {};
        for (var [key, value] of data) {
            formDataObj[key] = value;
            }

        $('#register').prop('disabled', true);
        $.ajax({
            url: "/api/family/register",
            type: "POST",
            data: formDataObj,
            datatype: "json",
            success: function(resp) 
            {
            $('#register').prop('disabled', false);
            add_family.reset();
           
            Swal.fire({
                title:"Family Registration Success",
                icon: "success"
                });
            },
            error: function(xhr, status, error){
              $('#register').prop('disabled', false);
              add_family.reset();
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
const phone = document.getElementById('phone');
//const birthdate = document.getElementById('datepicker');
const address = document.getElementById('address');
const email = document.getElementById('email');
     var firstnamevalue=firstname.value;
      var middlenameValue=middlename.value;
      var lastnamevalue=lastname.value;
      //var birthdateValue=birthdate.value;
      var addressValue=address.value;
      var phoneValue=phone.value;
      var emailValue=email.value;
      var genderValue=gender.value;
      console.log("firstname")
      console.log(firstnamevalue.length)
      
      
      setError(firstname, 'First name is required');
    if(firstnamevalue ===''||firstnamevalue.length==0) {
        setError(firstname, 'First name is required');
    } 
    else {
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

/*
    if(birthdateValue==''||birthdateValue==null){
        setError(birthdate,"Birt Date is required")
    }
    else{
        setSuccess(birthdate)
    }*/
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

    if(phoneValue =='') {
        setError(phone, 'Phone is required');
    } 
     else {
        setSuccess(phone);
    }
    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }
   
    if(!$('input[type=radio]:checked').length) {
        setError(gender, ' Gender is required');
    } else {
        setSuccess(gender);
    }

};