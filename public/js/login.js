var mode = 'login'
function changePage(){
  console.log('changePage')
  if(mode == 'login') {
    mode = 'register'
    $('#login-form').addClass('hide-form')
    $('#login-form').removeClass('show-form')
    $('#register-form').addClass('show-form')
    $('#register-form').removeClass('hide-form')
    $('#page-title').html(`
      Sign Up
    `)
    $('.lock-wrapper').css({ 'margin':'5% auto'})
  }else{
    mode = 'login'
    $('#login-form').addClass('show-form')
    $('#login-form').removeClass('hide-form')
    $('#register-form').addClass('hide-form')
    $('#register-form').removeClass('show-form')
    $('#page-title').html(`
    Please Log In, or <a href="#" onclick="changePage()">Sign Up</a>
    `)

  }

}

let formValid = {
  login:{
    emailLogin : false,
    emailParten: false,
    passwordLogin : false,
  },
  register:{
    nameRegister: false,
    emailRegister: false,
    emailParten: false,
    passwordRegister: false,
  }
}
function  validInputRequired(id){
  let el = document.querySelector(`#${id}`)
  el.addEventListener('keyup', ($event)=>{
    let currentValue = el.value 
    if($event.code =='F5') return
    
    if(!currentValue){
      formValid[mode][id] = false
    }else{
      formValid[mode][id] = true
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
    let emailError = document.querySelector(`#email_invalid_${mode}`)
    if(!validateEmail(currentValue)){
      formValid[mode]['emailParten'] = false
      
      emailError.classList.remove('hide')
      emailError.classList.add('show')
    }else{
      formValid[mode]['emailParten'] = true
      emailError.classList.remove('show')
      emailError.classList.add('hide')
    }
    validForm()
})
}
function validForm(){
  let check = true

  for (var property in formValid[mode]) {
    if(!formValid[mode][property]){
      check = false;
      break;
    };
  }
  console.log('form',formValid)
  let submitBtn = document.querySelector(`#submit_${mode}`)
  if(check){
    submitBtn.disabled = false
  }else{
    submitBtn.disabled = true
  }
}
(function ($) {
  validInputRequired('emailLogin')
  validEmailParten('emailLogin')
  validInputRequired('passwordLogin')
  validInputRequired('nameRegister')
  validInputRequired('emailRegister')
  validEmailParten('emailRegister')
  validInputRequired('passwordRegister')

})(jQuery); 
