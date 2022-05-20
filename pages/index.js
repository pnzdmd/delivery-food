const modalCart = document.querySelector('.modal');
const openCart = document.querySelector('#button-cart');
const closeCart = document.querySelectorAll('.close-cart');

// открытие корзины
openCart.addEventListener('click', () => {
  modalCart.classList.add('is-open')
})
// закрытие корзины
closeCart.forEach((item) => {
  item.addEventListener('click', () => {
    modalCart.classList.remove('is-open')
  })
})

// активация анимаций
new WOW().init();
