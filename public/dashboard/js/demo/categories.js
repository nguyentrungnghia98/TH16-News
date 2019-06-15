var selectedCategory = null
var mode = "edit"
$(document).ready(function() {

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
  _dom.parentElement.innerHTML = _dom.parentElement.innerHTML + `<button class="btn btn-delete" onclick="deleteSelectCategory()"> <i class="fa fa-trash" aria-hidden="true"></i> </button>`
})
function uploadImage(){
  $("#upload-image").click()
}
function readURL(input) {
  // if (input.files && input.files[0]) {
  //     var reader = new FileReader();
  //     reader.onload = function (e) {
  //       $('#category-image')
  //       .attr('src', e.target.result)
  //       $("#category-link").val("").prop('disabled', true);
  //     };

  //     reader.readAsDataURL(input.files[0]);
  // }
  getUrlImage(input).then(url => {
    console.log('url',url)
      $('#category-image').attr('src', url)
      $("#category-link").val(url)
  }).catch(err=>{
    console.log('err',err)
  })

}

function openEditCategory(event,index) { 
  mode = "edit"
  $(".modal-title").text("Chỉnh sửa danh mục")
  $("#btn-confirm").text("Lưu thay đổi")
  selectedCategory = _categories.find(cate => cate._id == event.id)
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

function onSubmitCategory(){
  //set data
  let data = {
    image: $("#category-link").val(),
    name: $("#category-name").val(),
    description:  $("#category-name").val(),
    status: parseInt($("#category-status").val()),
  }
  if(mode == 'add')
  {
    let posting = $.ajax({
      url: `${window.location.origin}/api/category`,
      type: 'POST',
      data: data,
       success: function(msg){
          console.log('res',msg);
          alertify.success('Success!');
          location.reload()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alertify.error('Cannot add category!');
        }
    });
  }else{
    let posting = $.ajax({
      url: `${window.location.origin}/api/category/${selectedCategory._id}`,
      type: 'PUT',
      data: data,
       success: function(msg){
          console.log('res',msg);
          alertify.success('Success!');
          location.reload()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alertify.error('Cannot edit category!');
        }
    });
  }
}
function deleteSelectCategory(){
  let tmp = []
  document.querySelectorAll('.category-item').forEach(dom =>{
    tmp.push({
      id: dom.children[1].children[0].value,
      checked: dom.children[1].children[0].checked
    })
  })
  let ids = tmp.filter(el => el.checked).map(el=> el.id)
  console.log('ids',ids)
  if(!ids || !ids.length) return alertify.error('Please select category!');
  let posting = $.ajax({
    url: `${window.location.origin}/api/category`,
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
         alertify.error('Cannot delete category!');
      }
  });
}