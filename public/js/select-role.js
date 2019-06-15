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
function onRoleSelected(){
  let posting =  $.ajax({
    url: `${window.location.origin}/select-role`,
    type: 'POST',
    data: { role },
    success: function(msg){
      console.log('res',msg);
      alertify.success('Success!');
      location.reload()
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
       alertify.error('Cannot change role user!');

    }
    }); 
}
(function ($) {


})(jQuery); 