(function ($) {
  "use strict";

  $('.menu>li').slice(-2).addClass('last-elements');


  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll < 245) {
      $(".header-sticky").removeClass("sticky");
    } else {
      $(".header-sticky").addClass("sticky");
    }
  });

  /* + Blog Masonry */

  if ($(".blog-masonry-list").length) {
    var $container = $(".blog-masonry-list");
    $container.isotope({
      layoutMode: 'masonry',
      percentPosition: true,
      itemSelector: ".blog-masonry-box"
    });
  }


  $('.main-menu nav').meanmenu({
    meanScreenWidth: "991",
    meanMenuContainer: '.mobile-menu'
  });

  $('.grid').imagesLoaded(function () {


    // init Isotope
    var $grid = $('.grid').isotope({
      itemSelector: '.grid-item',
      percentPosition: true,
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.grid-item',
      }
    });

  });

  /* ---------------------------------------------
   MASONRY STYLE BLOG.
  ------------------------------------------------ */
  var $blogContainer = $('.post-masonry');
  if ($.fn.imagesLoaded && $blogContainer.length > 0) {
    imagesLoaded($blogContainer, function () {
      setTimeout(function () {
        $blogContainer.isotope({
          itemSelector: '.post-metonary-item',
          layoutMode: 'masonry'
        });
      }, 500);

    });
  }



  /* testimonial active  */

  $('.testimonial-active').owlCarousel({
    loop: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    items: 1,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  })

  /* single portfolio image slide */
  $('.sp-img-slide').owlCarousel({
    loop: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    items: 1,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  })

  /* blog-carsoule */
  $('.active-slider-blog').owlCarousel({
    loop: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    items: 3,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  })

  /* blog-carsoule */
  $('.instgram-slider-active').owlCarousel({
    loop: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    items: 5,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
  })


  /* testimonial active  */
  $('.client-active').owlCarousel({
    loop: true,
    items: 5,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
  })
  /* Related Porduct active  */
  $('.rp-slider').owlCarousel({
    loop: true,
    items: 3,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 3
      }
    }
  })

  /* Related Porduct active  */
  $('.blog-body-slider').owlCarousel({
    loop: true,
    items: 1,
    dots: false,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav: true,
    navText: ['<i class="zmdi zmdi-arrow-left"></i>', '<i class="zmdi zmdi-arrow-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  })
  /* Related Porduct active  */
  $('.related-slider-blog').owlCarousel({
    loop: true,
    items: 2,
    dots: false,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav: true,
    navText: ['<i class="zmdi zmdi-arrow-left"></i>', '<i class="zmdi zmdi-arrow-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 2
      }
    }
  })

  /*--------------------------
      Venobox
  ---------------------------- */
  $('.venobox').venobox({
    border: '10px',
    titleattr: 'data-title',
    numeratio: true,
    infinigall: true
  });
  /*------------------------
  menu-toggle
  ------------------------*/
  $('.menu-toggle').on('click', function () {
    if ($('.menu-toggle').hasClass('is-active')) {
      $('.main-menu nav').removeClass('menu-open');
    } else {
      $('.main-menu nav').addClass('menu-open');
    }
  });


  /*----------------------------------
    Hamburger js
  -----------------------------------*/
  var forEach = function (t, o, r) {
    if ("[object Object]" === Object.prototype.toString.call(t))
      for (var c in t) Object.prototype.hasOwnProperty.call(t, c) && o.call(r, t[c], c, t);
    else
      for (var e = 0, l = t.length; l > e; e++) o.call(r, t[e], e, t)
  };

  var hamburgers = document.querySelectorAll(".hamburger");
  if (hamburgers.length > 0) {
    forEach(hamburgers, function (hamburger) {
      hamburger.addEventListener("click", function () {
        this.classList.toggle("is-active");
      }, false);
    });
  }

  /*------------------------------------------------
       WOW JS ACTIVATION
  -------------------------------------------------- */
  new WOW().init();
  /*------------------------------------------------
       FUN FACT COUNTER ACTIVATION
  -------------------------------------------------- */
  $('.counter').counterUp({
    delay: 20,
    time: 2000
  });

  /*---------------------
    Circular Bars - Knob
  --------------------- */
  if (typeof ($.fn.knob) != 'undefined') {
    $('.knob').each(function () {
      var $this = $(this),
        knobVal = $this.attr('data-rel');

      $this.knob({
        'draw': function () {
          $(this.i).val(this.cv + '%')
        }
      });

      $this.appear(function () {
        $({
          value: 0
        }).animate({
          value: knobVal
        }, {
            duration: 2000,
            easing: 'swing',
            step: function () {
              $this.val(Math.ceil(this.value)).trigger('change');
            }
          });
      }, {
          accX: 0,
          accY: -150
        });
    });
  }
  /*--------------------------
   scrollUp
  ---------------------------- */
  $.scrollUp({
    scrollText: "<i class='zmdi zmdi-arrow-merge'></i>",
    easingType: 'linear',
    scrollSpeed: 900,
    animation: 'fade'
  });

  /*--------------------------
   mCustomScrollbar
  ---------------------------- */

  $(".side-about-area").mCustomScrollbar({
    theme: "inset-2-dark"
  });


  try{
    currentPage = parseInt(currentPage)
    totalPage = parseInt(totalPage)
    console.log('currentPage', currentPage, 'totalPage', totalPage)
    if (currentPage && totalPage) {
      updateUIPage()
    }
  }catch(err){

  }
  

})(jQuery);

function updateUIPage() {
  try{
    if(!mode_pagination) return
  }catch(err){}
  let query = '?'
  if(mode_pagination.includes('post?')) query = '&'
  let pagination = document.querySelector("#pagination-content")
  if (totalPage != 0) {
    pagination.innerHTML = ""
    if (currentPage == 1) {
      pagination.innerHTML = `
          	<span class="page-numbers current">
										<span class="meta-nav screen-reader-text">Page </span>1
									</span>
        `
      if (totalPage > 1) {
        let count = 4;
        if (totalPage < count) count = totalPage
        for (let i = 2; i <= count; i++) {
          pagination.innerHTML += `
              <a class="page-numbers" href="/${mode_pagination}${query}page=${i}"><span class="meta-nav screen-reader-text">Page </span>${i}</a>
             `
        }
        if (totalPage > count) {
          pagination.innerHTML += `
              <a class="page-numbers"><span class="meta-nav screen-reader-text">Page </span>...</a>
             `
        }
        pagination.innerHTML += `
              <a class="next page-numbers" href="/${mode_pagination}${query}page=${parseInt(currentPage)+1}">Next</a>
           `
      }
    } else {
      if (currentPage <= totalPage) {
        pagination.innerHTML = `
              <a class="prev page-numbers" href="/${mode_pagination}${query}page=${parseInt(currentPage)-1}">Previous</a>
              <a class="page-numbers"><span class="meta-nav screen-reader-text">Page </span>...</a>
          `
        let count = currentPage + 3;
        if (totalPage < count) count = totalPage
        for (let i = currentPage - 1; i <= count; i++) {
          if (i == currentPage) {
            pagination.innerHTML += `
            	  <span class="page-numbers current">
										<span class="meta-nav screen-reader-text">Page </span>${i}
									</span>
            `
          } else {
            pagination.innerHTML += `
            <a class="page-numbers" href="/${mode_pagination}${query}page=${i}"><span class="meta-nav screen-reader-text">Page </span>${i}</a>
            `
          }

        }
        if (totalPage > count) {
          pagination.innerHTML += `
            <a class="page-numbers"><span class="meta-nav screen-reader-text">Page </span>...</a>
            `
        }
        if (currentPage != totalPage) {
          pagination.innerHTML += `
                  <a class="next page-numbers" href="/${mode_pagination}${query}page=${parseInt(currentPage)+1}">Next</a>
                `
        }

      }
    }
  }
}

function toggleSearchBox(){
  let search = document.querySelector("#search_box")
  if(search.classList.contains('hide-search')){
    search.classList.remove('hide-search')
  }else{
    search.classList.add('hide-search')
  }
}



// ----------------------Form update
function onSubmitUpdate(){
  document.querySelector("#btn_update_form").disabled = true
  //set data
  let data = {
    avatar: $("#avatar_link").val(),
    address: $("#user_address").val(),
    name: $("#user_name").val(),
    phone:  $("#user_phone").val(),
    facebookLink: $("#user_facebookLink").val(),
  }

  let posting = $.ajax({
    url: `${window.location.origin}/api/user/${user._id}`,
    type: 'PUT',
    data: data,
      success: function(msg){
        console.log('res',msg);
        document.querySelector("#btn_update_form").disabled = false
        Object.assign(user,data)
        alertify.success('Success!');
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        document.querySelector("#btn_update_form").disabled = false
          alertify.error('Cannot update info user!');
      }
  });

}

$('#avatar_link').keyup(function() {
  $("#user_avatar").attr('src', $(this).val())
  // get the current value of the input field.
});

function openUpdateModal(){
  document.querySelector(".opener").click()
  //set data
  $("#avatar_link").val(user.avatar),
  $("#user_avatar").attr('src', user.avatar)
  $("#user_address").val(user.address),
  $("#user_name").val(user.name),
  $("#user_phone").val(user.phone),
  $("#user_facebookLink").val(user.facebookLink),

  document.getElementById("updateUserModal").style.display = "block";
}

function viewMorePopularPost(){
  document.querySelectorAll(".latest-content").forEach(dom=>{
    dom.classList.remove("hidden")
  })
  document.querySelector("#viewMorePopularPost").style.display = "none"
}