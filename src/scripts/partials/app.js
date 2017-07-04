
$(document).ready(function () {

    var durationArrowAnimation = 1000;
    function repeatArrrowAnimation(){
        setInterval(function () {
            $('.next-page-arrow').toggleClass('animated bounce');
        }, durationArrowAnimation);
    }

    setTimeout(repeatArrrowAnimation, durationArrowAnimation);

    $('.next-page-arrow').on('click', function () {
        var benefitSectionPos = $('.section-benefits').offset().top;
        $('body,html').animate({scrollTop: benefitSectionPos}, 700);

    });


    $('.notification-body-js .close-btn-js').on('click', function () {
        var $this = $(this),
            notificationBody = $this.closest('.notification-body-js');
        notificationBody.slideUp();
    });



    $(window).on('load scroll resize', function () {
        var benefitSectionPos = $('.section-benefits').offset().top,
            scrollTopVal = $(window).scrollTop(),
            scrollBottomVal = $(window).scrollTop() + $(window).height(),
            footerHeight = $('footer').height(),
            documentHeight = $(document).height();

        //ANIMATION FOR HEADER AFTER SCROLL
        if( scrollTopVal >= benefitSectionPos - 400 && document.body.clientWidth > 960){
            $('.header').addClass('show');
        }else{
            $('.header').removeClass('show');
        }

        //ANIMATION FOR IMAGE AND DESCRIPTION IN BENEFIT-SECTION
        if(scrollTopVal >= benefitSectionPos - 100){
            $('.about-img').addClass('visible');
        }
        if (document.body.clientWidth > 960){
            if(scrollTopVal >= benefitSectionPos + 300){
                $('.about-desc').addClass('visible');
            }
        }else{
            if(scrollTopVal >= benefitSectionPos + 300){
                $('.about-desc').addClass('visible960');
            }
        }

        //ANIMATION FOR BENEFIT ITEMS
        var benefitsList = $('.benefits-list'),
            benefitItem = benefitsList.find('.benefit-item');


        if(scrollTopVal >= benefitSectionPos -500){

            if(!$(benefitsList).hasClass('shown')){
                benefitItem.each(function (i) {
                    var duration = 800;
                    $(this).delay( i*(duration/2) ).animate({opacity: 1}, duration);
                });
                $(benefitsList).addClass('shown');
            }
        }

    });


});


