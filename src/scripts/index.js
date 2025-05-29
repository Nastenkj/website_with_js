import "../pages/index.css";
import './cards.js';
import { createCard } from './cards.js';
import { initialCards } from './cards.js';
import { openModal, closeModal, closeByOverlay, closeByEsc} from './modal.js';
import { enableValidation } from '../components/validate.js';
import { toggleButtonState } from '../components/validate.js';
 
// запрос к сереру
const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',  // адрес группы на сервере
    headers: {      // заголовки запроса
      authorization: '03f97712-def8-4441-86d0-7714121d8da0',    // мой уникальный токен
      'Content-Type': 'application/json'    // тип данных, с которыми работает сервер (Json)
    }
};

// Get - запрос на адрес
function getUserInfo() {
    return fetch(`${config.baseUrl}/users/me`, {
      headers: config.headers
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    });
}

// Загрузка информации о пользователе с сервера
document.addEventListener('DOMContentLoaded', function () {
    const profileImage = document.querySelector('.profile__image');
    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
  
    getUserInfo()
      .then(user => {
        profileTitle.textContent = user.name;
        profileDescription.textContent = user.about;
        profileImage.style.backgroundImage = `url(${user.avatar})`;
    })
    .catch(err => {
        console.error('Ошибка при загрузке информации о пользователе:', err);
    });
});

// Добавляем модификатор для анимации всем попапам при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
      popup.classList.add('popup_is-animated');
 
      // Добавляем обработчик клика на оверлей для закрытия попапа
      popup.addEventListener('mousedown', closeByOverlay);
 
    });
 
    enableValidation(validationSettings);
    /*renderInitialCards();*/
});  
 
const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'profile__button-inactive',
    inputErrorClass: 'form__input_type_error',
    errorClass: 'popup__error_visible'
};
 
function renderInitialCards() {
    const cardsContainer = document.querySelector('.places__list');
    initialCards.forEach(cardData => {
      cardsContainer.append(createCard(cardData));
    });
}
 
renderInitialCards();
 
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
 
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
 
const profileFormElement  = profilePopup.querySelector('.popup__form');
 
// поля ввода в попапе профеля
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const descriptionInput = profileFormElement.querySelector('.popup__input_type_description');
 
// Обработчики для профиля
const buttonOpenProfileEdit = document.querySelector('.profile__edit-button');
const buttonCloseProfileEdit = profilePopup.querySelector('.popup__close');
 
buttonOpenProfileEdit.addEventListener('click', function(){
    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;
    openModal(profilePopup);
 
    // Активируем кнопку сразу при открытии попапа
    const inputList = Array.from(profileFormElement.querySelectorAll('.popup__input'));
    const buttonElement = profileFormElement.querySelector('.popup__button');
    toggleButtonState(inputList, buttonElement, validationSettings);
    buttonElement.disabled = false;
});
 
buttonCloseProfileEdit.addEventListener('click', function(){
    closeModal(profilePopup);
});
 
// Обработчик «отправки» формы, хотя пока она никуда отправляться не будет
function handleProfileFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
 
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;
    // Получите значение полей jobInput и nameInput из свойства value
    // Выберите элементы, куда должны быть вставлены значения полей
    // Вставьте новые значения с помощью textContent
    closeModal(profilePopup);
}
 
// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
profileFormElement.addEventListener('submit', handleProfileFormSubmit);
 
const profileAddButton = document.querySelector('.profile__add-button')
const buttonCloseAdd = cardPopup.querySelector('.popup__close');
 
profileAddButton.addEventListener('click', function(){
    openModal(cardPopup);
});
 
buttonCloseAdd.addEventListener('click', function(){
    closeModal(cardPopup);
});
 
const cardFormElemnt = cardPopup.querySelector('.popup__form');
 
// поля ввода в попапе добавления места
const namePlaces = cardFormElemnt.querySelector('.popup__input_type_card-name');
const urlPlaces = cardFormElemnt.querySelector('.popup__input_type_url');
 
// Обработчик «отправки» формы
function handleCardFormSubmit (evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
 
    const newCard = {
        name: namePlaces.value,
        link: urlPlaces.value
    }
 
    const cardsContainer = document.querySelector('.places__list');
    cardsContainer.prepend(createCard(newCard));    /*метод, который вставляет элемент в начало контейнера*/
    cardFormElemnt.reset(); // Очищаем форму после добавления карточки
 
    closeModal(cardPopup);
}
 
cardFormElemnt.addEventListener('submit', handleCardFormSubmit );
 
const imagePopupOpen = document.querySelector('.places');
const imagePopupClose = imagePopup.querySelector('.popup__close');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
 
imagePopupClose.addEventListener('click', function(){
    closeModal(imagePopup);
});