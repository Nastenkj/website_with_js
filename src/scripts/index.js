import "../pages/index.css";
import './cards.js';
import { initialCards } from './cards.js';
import { enableValidation } from '../components/validate.js';
import { toggleButtonState } from '../components/validate.js';
 
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
    inactiveButtonClass: 'profile__button-inactive',
  inputErrorClass: 'form__input_type_error',
    errorClass: 'popup__error_visible'
};
 
function createCard(cardData) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
 
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
 
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
 
    // лайк карточке
    cardElement.querySelector('.card__like-button').addEventListener('click', function(evt){
      evt.target.classList.toggle('card__like-button_is-active');
    });
 
    // удаление карточки
    cardElement.querySelector('.card__delete-button').addEventListener('click', function(evt){
      evt.target.closest('.card').remove();
    })
 
    // Добавляем обработчик клика на изображение карточки
    cardImage.addEventListener('click', function() {
      popupImage.src = cardData.link;
      popupImage.alt = cardData.name;
      popupCaption.textContent = cardData.name;
      openModal(imagePopup);
    });
 
    return cardElement;
}
 
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
 
 
// Функция открытия попапа
function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEsc); // Добавляем обработчик для закрытия на Esc
}
 
// Функция закрытия попапа
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEsc); // Удаляем обработчик для закрытия на Esc
}
 
 function closeByOverlay(evt) {
    if (evt.target === evt.currentTarget) {     // evt.target - это конкретный элемент, по которому кликнули
                                                // evt.currentTarget - это элемент, на котором висит обработчик события (в нашем случае - сам попап)
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}
 
function closeByEsc(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}
 
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