//'use strict';
// открытие корзины
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");


// авторизация
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');

let login = localStorage.getItem('name');

// добавлечение карточек 
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');


// реализация работы корзины
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart')
const cart = [];


const inputAddress = document.querySelector('.input-address');
const inputSearch = document.querySelector('.input-search');




const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу: ${url}, статус ошибки: ${response.status}`)
  }

  return await response.json();
}


// открытие/закрытие корзины
function toggleModal() {
  modal.classList.toggle("is-open");
}

// открытие/закрытие окна авторизации
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function autorized() {

  function logOut() {

    login = null;
    localStorage.removeItem('name');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;
  // показываю кнопки
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  // при выходе получаю начальную авторизацию
  buttonOut.addEventListener('click', logOut);

  console.log('авторизован');
}

function notAuthorized() {

  function logIn(e) {
    e.preventDefault();
    //если логин есть то
    if (loginInput.value) {
      loginInput.style.borderColor = '';

      login = loginInput.value;

      localStorage.setItem('name', login);

      toggleModalAuth();

      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);

      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

// проверка авторизации
function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAuthorized();
  }
}

// создание карточек ресторана
function createCardRestaurant(restaurants) {

  const {
    name,
    image,
    time_of_delivery: timeOfDelivery,
    stars, price,
    kitchen,
    products } = restaurants;

  const card = `
    <a class="card card-restaurant" data-products="${products}" >
      <img src= ${image} alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title"> ${name} </h3>
          <span class="card-tag tag"> ${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
           ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category"> ${kitchen} </div>
        </div>
      </div>
  </a>`;

  cardsRestaurants.insertAdjacentHTML('beforeend', card)
}


// создание меню ресторана
function createCardGood(goods) {

  const {
    id,
    name,
    description,
    price,
    image } = goods;

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
     <img src=${image} alt="image" class="card-image"/>
     <div class="card-text">
       <div class="card-heading">
         <h3 class="card-title card-title-reg">${name}</h3>
       </div>
       <div class="card-info">
         <div class="ingredients">${description}
         </div>
       </div>
       <div class="card-buttons">
         <button class="button button-primary button-add-cart"id=${id} >
           <span class="button-card-text">В корзину</span>
           <span class="button-cart-svg"></span>
         </button>
         <strong class="card-price-bold card-price">${price} ₽</strong>
       </div>
     </div>`);

  //cardsMenu.insertAdjacentElement('beforeend', card);
  cardsMenu.prepend(card);

}

function openGoods(e) {
  const target = e.target;

  const restaurant = target.closest('.card-restaurant');

  if (restaurant) {
    cardsMenu.textContent = '';

    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    getData(`./db/${restaurant.dataset.products}`).then((data) => {
      data.forEach(createCardGood)
    })
  }
}


// реализация корзины
function addToCart(e) {
  const target = e.target;

  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(el => el.id === id)

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }
  }
}
// отрисовка товаров в корзине
function renderCart() {
  modalBody.textContent = '';

  cart.forEach(item => {

    const { id, title, cost, count } = item;

    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id=${id}>-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id=${id}>+</button>
      </div>
    </div>
    `;

    modalBody.insertAdjacentHTML('beforeend', itemCart)

  })
  const totalPrice = cart.reduce((result, item) => {
    return result + (parseFloat(item.cost) * item.count)
  }, 0)
  modalPrice.textContent = totalPrice + ' ₽';
}


function changeCount(e) {
  const target = e.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find((item) => {
      return item.id === target.dataset.id;
    })
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1)
      }
    }
    if (target.classList.contains('counter-plus')) {
      food.count++;
    }

    renderCart();
  }
}




function init() {
  // вывод данных ресторанов
  getData('./db/partners.json').then((data) => {
    data.forEach(createCardRestaurant)
  })

  modalBody.addEventListener('click', changeCount)

  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  })

  cardsMenu.addEventListener('click', addToCart)


  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });


  checkAuth();
}

init();


