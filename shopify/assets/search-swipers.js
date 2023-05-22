(function () {

    const width = window.innerWidth;

    if (width > 768) {
        var swipers = document.querySelectorAll('.swiper');
        var swiperInstances = [];
        
    
        swipers.forEach(function(sw) {
            swiperInstances.push(new Swiper(sw, {
                slidesPerView: 3.5,
                freeMode: true,
                mousewheel: true,
                spaceBetween: 30,
                breakpoints: {
                    767: {
                        slidesPerView: 3.5
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
    
            sw.querySelector('.swiper__append').addEventListener('click', function (e) {
                e.preventDefault();
                
                sw.swiper.update();
            });
        });
    }
    
})();