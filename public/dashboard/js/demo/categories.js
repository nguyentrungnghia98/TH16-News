var selectedCategory = null
var mode = "edit"
var selectedParentCategory = []
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
  try{
    if(!readMode){
      let _dom = document.querySelector("#demo-dt-selection_filter")
      _dom.parentElement.classList.add("d-flex" , "justify-content-end")
      _dom.parentElement.innerHTML = _dom.parentElement.innerHTML + `<button class="btn btn-delete" onclick="deleteSelectCategory()"> <i class="fa fa-trash" aria-hidden="true"></i> </button>`
    }
  }catch(err){}
  
})
function uploadImage(){
  $("#upload-image").click()
}
function readURL(input) {
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
  $('#parent_categories').val('')
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

  $(".tagchecklist").html("")
  if(selectedCategory.parent_categories){
    selectedCategory.parent_categories.forEach(cate=>{
      $(".tagchecklist").append(`
      <span class="d-flex ml-2 mt-2" value="tag-${cate._id}">
        <div class="remove-tag-btn" onclick="removeTag('${cate._id}')"><i class="fa fa-times" aria-hidden="true" style="cursor: pointer;"></i></div> ${cate.name}
      </span>
       `)
    })
  }
  //update UI
  $('#editCategory').modal('show')
}

function addNewCategory(){
  mode = "add"
  $('#parent_categories').val('')
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
    description:  $("#category-description").val(),
    status: parseInt($("#category-status").val()),
  }
  if(selectedParentCategory.length > 0){
    data.parent_categories = JSON.stringify(selectedParentCategory.map(cate => cate._id))
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
function removeTag(id){
  let index = selectedParentCategory.findIndex(tag=> tag._id == id)
  if(index > -1){
    selectedParentCategory.splice(index,1)
    $(`span[value='tag-${id}']`).remove()
  }
  console.log(name,selectedParentCategory)
}
function addParentCategory(){
  let id = $('#parent_categories').val()
  console.log('id',id)
  if(id){
    if(selectedCategory && id == selectedCategory._id) return alertify.error('Please select other category!');
    let existIndex = selectedParentCategory.findIndex(cate=> cate._id == id)
    if(existIndex > -1) return alertify.error('Category was added!');

    let index = _parent_categories.findIndex(cate=> cate._id == id)
    if(index>-1) {
      $('#parent_categories').val('')
      selectedParentCategory.push(_parent_categories[index])
      $(".tagchecklist").append(`
        <span class="d-flex ml-2 mt-2" value="tag-${_parent_categories[index]._id}">
          <div class="remove-tag-btn" onclick="removeTag('${_parent_categories[index]._id}')"><i class="fa fa-times" aria-hidden="true" style="cursor: pointer;"></i></div> ${_parent_categories[index].name}
        </span>
      `)
    }
  }
}