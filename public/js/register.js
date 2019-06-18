var error = errorMessage || ''
let formValid = {
    name: false,
    email: false,
    emailParten: false,
    password: false,
}
function  validInputRequired(id){
  let el = document.querySelector(`#${id}`)
  el.addEventListener('keyup', ($event)=>{
    let currentValue = el.value 
    if($event.code =='F5') return
    
    if(!currentValue){
      formValid[id] = false
    }else{
      formValid[id] = true
    }
    validForm()
})
}
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function  validEmailParten(id){
  let el = document.querySelector(`#${id}`)
  el.addEventListener('keyup', ($event)=>{
    let currentValue = el.value 
    if($event.code =='F5') return
    let emailError = document.querySelector(`#email_invalid`)
    if(!validateEmail(currentValue)){
      formValid['emailParten'] = false
      
      emailError.classList.remove('hide')
      emailError.classList.add('show')
    }else{
      formValid['emailParten'] = true
      emailError.classList.remove('show')
      emailError.classList.add('hide')
    }
    validForm()
})
}
function validForm(){
  let check = true

  for (var property in formValid) {
    if(!formValid[property]){
      check = false;
      break;
    };
  }
  console.log('form',formValid)
  let submitBtn = document.querySelector(`#submit`)
  if(check){
    submitBtn.disabled = false
  }else{
    submitBtn.disabled = true
  }
}
var role = "subscriber"
function onSelectRole(){
  role = document.getElementById("user-role").value;
  console.log('role',role)
  if(role != 'subscriber'){
    document.querySelector('#warning-message').style.display = "block";
  }else{
    document.querySelector('#warning-message').style.display = "none";
  }
}
(function ($) {
  $('.lock-wrapper').css({ 'margin':'5% auto'})
  validInputRequired('name')
  validInputRequired('email')
  validEmailParten('email')
  validInputRequired('password')
  if(error){
    alertify.error(error);
  }
})(jQuery); 
 