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
    data: { role }
    }); 
    posting.done(function( data ) {
      console.log( 'res',data)
    });
}
(function ($) {


})(jQuery); 