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
     // location.reload()
     $("#select_box").html(`
     <div class="row">
     <div class="col-3 icon-avatar">
       <i class="far fa-check-circle"></i>
     </div>
     <div class="col-9">
       <div class="pending-content row">
         Your account has been relect role.
         <strong>Waiting for approval from admin!</strong>
       </div>
       <div class="row">
         <div class="col-12 text-right mt-2">
             <a class="mr-5 " href="/">Home</a>
         </div>
         
       </div>
     </div>
   </div>
     `)
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
       alertify.error('Cannot change role user!');

    }
    }); 
}
(function ($) {


})(jQuery); 