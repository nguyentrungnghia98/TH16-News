var selectedTag = null
var mode =  "edit"
$(document).ready(function() {
  $.fn.DataTable.ext.pager.numbers_length = 5;
  // Row selection and deletion (multiple rows)
	// -----------------------------------------------------------------
	var rowSelection = $('#demo-dt-selection').DataTable({
    // "order": [[ 6, "desc" ]],
    "columns": [
      { "width": "5%" },
      { "width": "5%" },
      { "width": "60%" },
      { "width": "15%" },
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
})

function openEditTag(event,index) { 
  mode = "edit"
  $(".modal-title").text("Chỉnh sửa tag")
  $("#btn-confirm").text("Lưu thay đổi")
  selectedTag = _tags.find(tag => tag._id == event.id)
  console.log(selectedTag, 'event',event.id,'index', index)
  //set data
  $("#tag-name").val(selectedTag.name)
  $("#tag-description").val(selectedTag.description)
  $("#tag-status").val(selectedTag.status)
  //update UI
  $('#editTag').modal('show')
}
function addNewTag(){
  mode = "add"
  $(".modal-title").text("Thêm danh mục")
  $("#btn-confirm").text("Thêm")
  $("#tag-name").val("")
  $("#tag-description").val("")
  $("#tag-status").val("1")
  $('#editTag').modal('show')
}


function onSubmitTag(){
  //set data
  let data = {
    name: $("#tag-name").val(),
    description:  $("#tag-description").val(),
    status: parseInt($("#tag-status").val()),
  }
  if(mode == 'add')
  {
    let posting = $.ajax({
      url: `${window.location.origin}/api/tag`,
      type: 'POST',
      data: data,
       success: function(msg){
          console.log('res',msg);
          alertify.success('Success!');
          location.reload()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alertify.error('Cannot add tag!');
        }
    });
  }else{
    let posting = $.ajax({
      url: `${window.location.origin}/api/tag/${selectedTag._id}`,
      type: 'PUT',
      data: data,
       success: function(msg){
          console.log('res',msg);
          alertify.success('Success!');
          location.reload()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alertify.error('Cannot edit tag!');
        }
    });
  }
}
function deleteSelectCategory(){
  let tmp = []
  document.querySelectorAll('.tag-item').forEach(dom =>{
    tmp.push({
      id: dom.children[1].children[0].value,
      checked: dom.children[1].children[0].checked
    })
  })
  let ids = tmp.filter(el => el.checked).map(el=> el.id)
  console.log('ids',ids)
  if(!ids || !ids.length) return alertify.error('Please select tag!');
  let posting = $.ajax({
    url: `${window.location.origin}/api/tag`,
    type: 'DELETE',
    data: {
      items: JSON.stringify(ids)
    },
     success: function(msg){
        console.log('res',msg);
        alertify.success('Success!');
        location.reload()
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
         alertify.error('Cannot delete tag!');
      }
  });
}
