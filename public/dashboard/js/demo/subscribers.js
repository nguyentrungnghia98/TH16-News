function verifyUser(index) {
  console.log('index', index)
  let posting = $.ajax({
    url: `${window.location.origin}/api/user/${users[index]._id}`,
    type: 'PUT',
    data: { 
      isAccepted: true,
     },
     success: function(msg){
        console.log('res',msg);
        alertify.success('Success!');
        location.reload()
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
         alertify.error('Cannot verify user!');
      }
  });

}
function changeRole(index,role,event){
  console.log(event)
  let posting = $.ajax({
    url: `${window.location.origin}/api/user/${users[index]._id}`,
    type: 'PUT',
    data: { 
      role
     },
     success: function(msg){
        console.log('res',msg);
        alertify.success('Success!');
        let btnGroup = document.querySelectorAll('.role-actions')[index].children
        console.log('btn',btnGroup)
        if(btnGroup){
   
          for (var i = 0; i < btnGroup.length; i++) {
            btnGroup[i].classList.remove('btn-active')
          }
          event.classList.add('btn-active')
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
         alertify.error('Cannot change role user!');
      }
  });
}

$(document).ready(function() {
  let doms = document.querySelectorAll(".status-subscriber")
  doms.forEach((dom,index)=>{
    let user = users[index]
    if(!user.dateExpired){
      dom.innerHTML = `<span class="badge badge-danger">Expired</span>`
    }else{
      let now = new Date()
      let dateExpired = new Date(user.dateExpired)
      if(now > dateExpired){
        dom.innerHTML = `<span class="badge badge-danger">Expired</span>`
      }else{
        dom.innerHTML = `<span class="badge badge-success">Active</span>`
      }
    }
  })

  $.fn.DataTable.ext.pager.numbers_length = 5;
  // Row selection and deletion (multiple rows)
	// -----------------------------------------------------------------
	var rowSelection = $('#demo-dt-selection').DataTable({
    // "order": [[ 6, "desc" ]],
    "columns": [
      { "width": "5%" },
      { "width": "5%" },
      { "width": "25%" },
      { "width": "25%" },
      { "width": "15%" },
      { "width": "10%" },
      { "width": "15%" },
    ],
		"language": {
			"paginate": {
			  "previous": '<i class="fa fa-angle-left"></i>',
			  "next": '<i class="fa fa-angle-right"></i>'
			}
		}
	});
	$('#demo-dt-selection').on( 'click', 'tr', function () {
		if ( $(this).hasClass('selected') ) {
			$(this).removeClass('selected');
		}
		else {
			// rowSelection.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	} );
  $('.no-sort').removeClass("sorting sorting_asc").css({
    "pointer-events": "none"
  })
  
  let _dom = document.querySelector("#demo-dt-selection_filter")
  _dom.parentElement.classList.add("d-flex" , "justify-content-end")
  _dom.parentElement.innerHTML = _dom.parentElement.innerHTML + `<button class="btn btn-delete" onclick="deleteSelectCategory()"> <i class="fa fa-trash" aria-hidden="true"></i> </button>`

  $('#publishAtBox').datetimepicker();
})
var selectedUser
function changeExpiredDate(index){
  selectedUser = users[index]
  $("#publishAt").val("")
  $('#changeExpiredDate').modal('show')
}
function onSubmitExpired(){
  //if(!$("#publishAt").val())  return alertify.error('Vui lòng chọn thời gian hết hạn!');
  $('#text-update').addClass("hidden")
  $('#spinner-update').removeClass("hidden")
  var someDate = new Date();
  var numberOfDaysToAdd = 7;
  someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
  let data={
    dateExpired : someDate
  }
  let posting = $.ajax({
    url: `${window.location.origin}/api/user/${selectedUser._id}`,
    type: 'PUT',
    data: data,
     success: function(msg){
        console.log('res',msg);
        $('#spinner-update').addClass("hidden")
        $('#text-update').removeClass("hidden")
        alertify.success('Success!');
        location.reload()
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
         alertify.error('Cannot edit user!');
         $('#text-update').addClass("hidden")
         $('#spinner-update').removeClass("hidden")
      }
  });
}