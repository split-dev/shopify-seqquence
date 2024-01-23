(function () {
    if (window.innerWidth < 768) return;

    const swipers = document.querySelectorAll('.swiper');
    const swiperInstances = [];

    swipers.forEach(function(sw) {
        swiperInstances.push(new Swiper(sw, {
            slidesPerView: 3,
            freeMode: true,
            mousewheel: true,
            spaceBetween: 35,
            breakpoints: {
                767: {
                    slidesPerView: 3
                },
                320: {
                    slidesPerView: 1.2,
                },
                100: {
                    slidesPerView: 1,
                }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        }));

        sw.parentElement.querySelector('.swiper__append').addEventListener('click', function (e) {
            e.preventDefault();
            
            sw.swiper.update();
        });
    });    
})();
