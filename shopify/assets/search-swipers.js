(function () {
    var swipers = document.querySelectorAll('.swiper');
    var swiperInstances = [];
    var mediaQuery = window.matchMedia('(max-width: 768px)');
    

    swipers.forEach(function(sw) {
        swiperInstances.push(new Swiper(sw, {
            slidesPerView: 3.5,
            freeMode: true,
            spaceBetween: 30,
            breakpoints: {
                767: {
                    slidesPerView: 3.5
                },
                320: {
                    slidesPerView: 1.2,
                }
            },
            navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            },
        }));

        sw.querySelector('.swiper__append').addEventListener('click', function (e) {
            e.preventDefault();
            sw.swiper.params.slidesPerView = 3.5;
            if (mediaQuery.matches) {
                sw.swiper.params.slidesPerView = 1.5;
            }
            sw.swiper.update();
        });
    });
})();