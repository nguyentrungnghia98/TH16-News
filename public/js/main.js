(function($) {
    "use strict";

    $('.menu>li').slice(-2).addClass('last-elements');


    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop();
        if (scroll < 245) {
            $(".header-sticky").removeClass("sticky");
        } else {
            $(".header-sticky").addClass("sticky");
        }
    });

    	/* + Blog Masonry */

      if($(".blog-masonry-list").length) {
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

    $('.grid').imagesLoaded(function() {


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
        imagesLoaded($blogContainer, function() {
            setTimeout(function() {
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
    $('.menu-toggle').on('click', function() {
        if ($('.menu-toggle').hasClass('is-active')) {
            $('.main-menu nav').removeClass('menu-open');
        } else {
            $('.main-menu nav').addClass('menu-open');
        }
    });


    /*----------------------------------
    	Hamburger js
    -----------------------------------*/
    var forEach = function(t, o, r) {
        if ("[object Object]" === Object.prototype.toString.call(t))
            for (var c in t) Object.prototype.hasOwnProperty.call(t, c) && o.call(r, t[c], c, t);
        else
            for (var e = 0, l = t.length; l > e; e++) o.call(r, t[e], e, t)
    };

    var hamburgers = document.querySelectorAll(".hamburger");
    if (hamburgers.length > 0) {
        forEach(hamburgers, function(hamburger) {
            hamburger.addEventListener("click", function() {
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
    if (typeof($.fn.knob) != 'undefined') {
        $('.knob').each(function() {
            var $this = $(this),
                knobVal = $this.attr('data-rel');

            $this.knob({
                'draw': function() {
                    $(this.i).val(this.cv + '%')
                }
            });

            $this.appear(function() {
                $({
                    value: 0
                }).animate({
                    value: knobVal
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
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
		theme:"inset-2-dark"
	});
				


})(jQuery);

