function asvInit() {
  // console.log('ready');

  // Carousel
  if ( document.querySelectorAll('.swiper').length > 0 ) {
    const swiper = new Swiper('.swiper', {
      // Optional parameters
      direction: 'horizontal',
      speed: 300,
      slidesPerView: 7,
      spaceBetween: 1,

      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
      },
      freeMode: {
        enabled: true,
        sticky : true,
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

    });

    // Expand & Collapse Carousel
    const galleryItemLinks = document.querySelectorAll('.gallery_item_link');
    const galleryContainer = document.querySelector('.gallery_container');
    const transitionFigure = document.querySelector('.transition_figure');
    let transitionIndex;
    galleryItemLinks.forEach((galleryItemLink) => {      
      galleryItemLink.addEventListener('click', function(event) {
        // Transition image
        const transitionImage = galleryItemLink.querySelector('img').cloneNode();
        transitionImage.removeAttribute('loading');
        transitionFigure.appendChild(transitionImage);
        transitionFigure.classList.toggle('active');
        // Expand Carousel
        if ( galleryContainer.classList.contains('collapsed') ) {
          // index for positioning
          transitionIndex = swiper.clickedIndex-swiper.activeIndex;
          transitionImage.classList.add('transition_image_' + transitionIndex.toString());
          // Expanding begins
          transitionImage.setAttribute('expanding', '');
          // console.log('expanding');
          // Post-expansion carousel update
          transitionImage.addEventListener('animationend', () => {
            swiper.params.slidesPerView = 1;
            galleryContainer.classList.replace('collapsed', 'expanded');
            swiper.update();
            swiper.slideTo(swiper.clickedIndex, 0, false);
            // console.log('expanded');
            //  Remove transition image
            setTimeout(() => {
              transitionImage.removeAttribute('expanding');
              transitionFigure.removeChild(transitionImage);
              transitionFigure.classList.toggle('active');
            }, 300);
          }, {once: true});
        // Collapse Carousel
        } else if ( galleryContainer.classList.contains('expanded') ) {
          // index for positioning
          // Index in reference with the last slide group
          let lastSlideGroupIndex = swiper.clickedIndex-(swiper.slides.length-7);
          // Set transition index if current item is after the originally expanded item
          if ( transitionIndex < lastSlideGroupIndex ) {
            transitionIndex = lastSlideGroupIndex;
          // Set transition index if current item is before the originally expanded item
          } else if ( transitionIndex > swiper.clickedIndex ) {
            transitionIndex = swiper.clickedIndex;
          }
          transitionImage.classList.add('transition_image_' + transitionIndex.toString());
          // Collapsing begins
          transitionImage.setAttribute('collapsing', '');
          // Collapse carousel update
          swiper.params.slidesPerView = 7;
          galleryContainer.classList.replace('expanded', 'collapsed');
          swiper.update();
          swiper.slideTo(swiper.clickedIndex-transitionIndex, 0, false);
          // Post-collapse remove transition image
          transitionImage.addEventListener('animationend', () => {
            transitionImage.removeAttribute('collapsing');
            transitionFigure.removeChild(transitionImage);
            transitionFigure.classList.toggle('active');
          }, {once: true});
        }
        event.preventDefault();
      });
    });

  } // carousel
  document.querySelector('.transition_figure').addEventListener('click', function(event) {
    // this.classList.toggle('active');
  });
} // asvInit

if (document.readyState === 'loading') {  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', asvInit);
} else {  // `DOMContentLoaded` has already fired
  asvInit();
}

// Debouncing to limits the function firing rate
// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

