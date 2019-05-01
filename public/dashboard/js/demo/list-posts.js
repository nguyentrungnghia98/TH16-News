var selectedPost = null
var mode = _mode || "edit"
$(document).ready(function() {
  if(mode == "add"){
    addNewPost()
  }
  $.fn.DataTable.ext.pager.numbers_length = 5;
  // Row selection and deletion (multiple rows)
	// -----------------------------------------------------------------
	var rowSelection = $('#demo-dt-selection').DataTable({

    "order": [[ 6, "desc" ]],
    "columns": [
      null,
      { "width": "40%" },
      { "width": "11.5%" },
      { "width": "11.5%" },
      { "width": "11.5%" },
      { "width": "11.5%" },
      { "width": "11.5%" },
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

  $('#editor').summernote({height: 500});
  

})
function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#features-image')
            .attr('src', e.target.result)
        $('#features-image-box').removeClass("hidden")
        $('#features-image-upload').addClass("hidden")
      };

      reader.readAsDataURL(input.files[0]);
  }
}
function removeImage() {
  
  $('#features-image-box').addClass("hidden")
  $('#features-image-upload').removeClass("hidden")
  $('#features-image')
  .attr('src', null)
}
function openEditPost(event) { 
  mode = "edit"
  selectedPost = posts.find(post => post.id == event.id)
  console.log(selectedPost, 'event',event.id)
  //update UI
  $('#_list-post').addClass("hidden-content")
  $('#_detail-post').removeClass("hidden-content")

  updateUIDetaiPost()

  $("body, html").animate({
    scrollTop: 0
}, 500)
}
function turnback(){
  selectedPost = null
  //update UI
  $('#_detail-post').addClass("hidden-content")
  $('#_list-post').removeClass("hidden-content")
}
function updateUIDetaiPost(){
  $("#title").html("Edit Post")
  $(".submitdelete").css("display","block")
  $("#post-btn").html("Update")
  $("#title-post").val(selectedPost.name)
  var sampleLink = `http://localhost:4200/post/${selectedPost.slug}`
  $("#sample-permalink").attr("href",sampleLink)
  $("#editable-post-name").text(selectedPost.slug)
  $(".note-editable").html(selectedPost.content)
}
function addNewPost(){
  mode = "add"
  $('#_list-post').addClass("hidden-content")
  
  $("#title").html("Add Post")
  $(".submitdelete").css("display","none")
  $("#post-btn").html("Add")
  $("#title-post").val("")
  $("#sample-permalink").attr("href","http://localhost:4200/post")
  $("#editable-post-name").text("")
  $(".note-editable").html("")


  $('#_detail-post').removeClass("hidden-content")

}