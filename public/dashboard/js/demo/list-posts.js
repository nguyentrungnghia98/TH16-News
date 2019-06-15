var selectedPost = null

userRule = rule || 'editor' 
$(document).ready(function() { 
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
})
