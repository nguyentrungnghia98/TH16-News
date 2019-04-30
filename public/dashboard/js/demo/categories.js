var selectedCategory = null
var mode = _mode || "edit"
$(document).ready(function() {
  if(mode == "add"){
    addNewCategory()
  }
  $.fn.DataTable.ext.pager.numbers_length = 5;
  // Row selection and deletion (multiple rows)
	// -----------------------------------------------------------------
	var rowSelection = $('#demo-dt-selection').DataTable({
    // "order": [[ 6, "desc" ]],
    "columns": [
      { "width": "5%" },
      { "width": "5%" },
      { "width": "10%" },
      { "width": "50%" },
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
function uploadImage(){
  $("#upload-image").click()
}
function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#category-image')
        .attr('src', e.target.result)
        $("#category-link").val("").prop('disabled', true);
      };

      reader.readAsDataURL(input.files[0]);
  }
}

function openEditCategory(event,index) { 
  mode = "edit"
  $(".modal-title").text("Chỉnh sửa danh mục")
  $("#btn-confirm").text("Lưu thay đổi")
  selectedCategory = _categories.find(cate => cate.id == event.id)
  console.log(selectedCategory, 'event',event.id,'index', index)
  //set data
  $('#category-image')
  .attr('src', selectedCategory.image)
  $("#category-link").val(selectedCategory.image)
  $("#category-name").val(selectedCategory.name)
  $("#category-description").val(selectedCategory.description)
  $("#category-status").val(selectedCategory.status)
  //update UI
  $('#editCategory').modal('show')
}

function addNewCategory(){
  mode = "add"
  $(".modal-title").text("Thêm danh mục")
  $("#btn-confirm").text("Thêm")
  $('#category-image')
  .attr('src', "")
  $("#category-link").val("")
  $("#category-name").val("")
  $("#category-description").val("")
  $("#category-status").val("1")
  $('#editCategory').modal('show')
}
