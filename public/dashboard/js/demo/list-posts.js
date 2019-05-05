var selectedPost = null
var mode = _mode || "edit"
var modeListPost = "waiting"
var waitingPosts = trashPosts =  verifiedPosts = publicPosts = deniedPost = []
$(document).ready(function() {
  waitingPosts = posts.slice(0,4)
  verifiedPosts = posts.slice(0,2)
  publicPosts = posts.slice(0,3)
  deniedPost = posts.slice(0,1)
  renderListPosts(waitingPosts)
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
function deniedPost(){
  $('#note-dialog').modal('show')
}
function deletePost(index){
  console.log('index',index)
  $(`#post-${index}`).remove()
  trashPosts.push(waitingPosts[index])
  waitingPosts.splice(index,1)
  renderListPosts(waitingPosts)

  $("#waiting-count").html(`(${waitingPosts.length})`)
  $("#trash-count").html(`(${trashPosts.length})`)
}
function loadListPosts(mode){
  $(".select-list-mode").removeClass('current')
  $(`#${mode}`).addClass('current')
  switch(mode){
    case 'waiting':
      renderListPosts(waitingPosts)
    break;
    case 'verified':
    renderListPosts(verifiedPosts,mode)
    break;
    case 'public':
    renderListPosts(publicPosts,mode)
    break;
    case 'denied':
    renderListPosts(deniedPost,mode)
    break;
    case 'trash':
    renderListPosts(trashPosts,mode)
    break;
  }
}
function renderListPosts(items, mode = 'waiting'){
  let html = ""
  items.forEach((post,index) => {
    html+= `
    <tr id="post-${index}">
    <td class="text-center">
      <span>${index + 1}</span>
      </td>
    <td class="title">
      <p id="${post.id}" onclick="event.stopPropagation();openEditPost(this)">${post.name}</p> 
      <div class="w-100"></div>
      <div class="row-actions">
        <span class="edit" onclick="event.stopPropagation();openEditPost(this)">
          <a href="#" title="Edit this item" >Edit</a> |
        </span>
        ${(mode == 'waiting' && userRule != 'editor')?`<span class="trash"><a class="submitdelete" href="#"  onclick="event.stopPropagation();deletePost(${index})">Bin</a> |</span>`:''}
        
        <span class="view"><a href="#" rel="permalink">View</a>
        </span>
      </div>
    </td>
    <td class="text-center">${post.creator}</td>
    <td>${post.slug}</td>
    <td>
    ${post.tags?post.tags:'-'}
    </td>
    <td class="text-center"> <i class="fa fa-comment comments-count" aria-hidden="true"><label>1</label></i>
    </td>
    <td data-sort="${post.created_at}">${post.created_at}</td>
  </tr>
    `
    $('#list-posts').html(html)
  })

  
}


// `
//   {{#each posts}}
//   <tr id="post-{{@key}}">
//     <td class="text-center">
//       {{!-- <input type="checkbox" value=""> --}}
//       <span>{{math @key "+" 1}}</span>
//       </td>
//     <td class="title">
//       <p id="{{id}}" onclick="event.stopPropagation();openEditPost(this)">{{name}}</p> 
//       <div class="w-100"></div>
//       <div class="row-actions">
//         <span class="edit" onclick="event.stopPropagation();openEditPost(this)">
//           <a href="#" title="Edit this item" >Edit</a> |
//         </span>
//         <span class="trash"><a class="submitdelete" href="#"  onclick="event.stopPropagation();deletePost({{@key}})">Bin</a> |
//         </span>
//         <span class="view"><a href="#" rel="permalink">View</a>
//         </span>
//       </div>
//     </td>
//     <td class="text-center">{{creator}}</td>
//     <td>{{slug}}</td>
//     <td>{{#if tags}}
//       {{tags}}
//       {{else}}
//       -
//       {{/if}}
//     </td>
//     <td class="text-center"> <i class="fa fa-comment comments-count" aria-hidden="true"><label>1</label></i>
//     </td>
//     <td data-sort="{{created_at}}">{{formatDate created_at}}</td>
//   </tr>
//   {{/each}}
//   `