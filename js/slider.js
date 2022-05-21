import Swiper from 'https://unpkg.com/swiper@8/swiper-bundle.esm.browser.min.js'


const slider = () => {
  const swiper = new Swiper('.swiper', {

    // прокрутка по кругу
    loop: true,

    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });

}

export default slider;