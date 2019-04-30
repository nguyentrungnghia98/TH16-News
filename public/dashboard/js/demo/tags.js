var selectedTag = null
var mode = _mode || "edit"
$(document).ready(function() {
  if(mode == "add"){
    addNewTag()
  }
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
  _dom.parentElement.innerHTML = _dom.parentElement.innerHTML + `<button class="btn btn-delete"> <i class="fa fa-trash" aria-hidden="true"></i> </button>`
})

function openEditTag(event,index) { 
  mode = "edit"
  $(".modal-title").text("Chỉnh sửa tag")
  $("#btn-confirm").text("Lưu thay đổi")
  selectedTag = _tags.find(tag => tag.id == event.id)
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

