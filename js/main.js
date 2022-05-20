const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

// открытие/закрытие корзины
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
function toggleModal() {
  modal.classList.toggle("is-open");
}



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

// открытие/закрытие окна авторизации
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open")
}


function autorized() {

  function logOut() {

    login = null;
    localStorage.removeItem('name');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  // показываю кнопки
  buttonAuth.style.display = 'none'
  userName.style.display = 'inline'
  buttonOut.style.display = 'block'

  // при выходе получаю начальную авторизацию
  buttonOut.addEventListener('click', logOut);

  console.log('авторизован');
}

function notAuthorized() {

  function logIn(e) {
    e.preventDefault();
    login = loginInput.value;

    localStorage.setItem('name', login);

    toggleModalAuth();

    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);

    logInForm.reset();
    checkAuth();
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

function btnDisabled() {
  if (login) {
    console.log(login);
    buttonLogin.disabled = 'true'
  } else {
    buttonLogin.disabled = 'false'
  }
}


checkAuth();