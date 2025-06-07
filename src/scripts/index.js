import "../pages/index.css";
import './cards.js';
import { createCard } from './cards.js';
import { enableValidation, toggleButtonState } from '../components/validate.js';
import { openModal, closeModal, closeByOverlay } from './modal.js'
 
// Переменная для хранения ID текущего пользователя
let currentUserId = null;

// запрос к сереру (API)
const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',  // адрес группы на сервере
    headers: {      // заголовки запроса
      authorization: '03f97712-def8-4441-86d0-7714121d8da0',    // мой уникальный токен
      'Content-Type': 'application/json'    // тип данных, с которыми работает сервер (Json)
    }
};

// Функция для отображения состояния загрузки на кнопке
function renderLoading(isLoading, buttonElement, initialText = 'Сохранить') {
    if (isLoading) {
        buttonElement.textContent = 'Сохранение...';
    } else {
        buttonElement.textContent = initialText;
    }
}

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
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
};

// берем карточки с сервера
function getCards(){
    return fetch(`${config.baseUrl}/cards`, {
      headers: config.headers
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка при загрузке карточек: ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
};

// обновляем информацию о пользователе на сервере
function updateUserInfo(name, about){
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: name,
            about: about
        })
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка при загрузке карточек: ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
};

// для смены аватара
function updateUserAvatar(avatarLink){
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: avatarLink
        })
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка при смене аватара: ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
}

// Добавление новой карточки
function addNewCards(name, link){
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: name,
            link: link
        })
    })
    .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка при добавлении карточки: ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
};

export function deleteCardFromServer(cardId) {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(res => {
        if(res.ok){
            return res.json();
        }
        return Promise.reject(`Ошибка при удалении карточки: ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
}

// ставим лайк
export function likeCard(cardId) {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers
    })
    .then(res => {
        if(res.ok){
            return res.json();
        }
        return Promise.reject(`Ошибка при посановке лайка: ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
}

// удаляем лайк
export function unlikeCard(cardId) {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
    .then(res => {
        if(res.ok){
            return res.json();
        }
        return Promise.reject(`Ошибка при снятии лайка: ${res.status}`);
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });
}

const profileImageElement = document.querySelector('.profile__image');
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');

const cardsContainer = document.querySelector('.places__list');

// Загрузка информации о пользователе и карточки с сервера
document.addEventListener('DOMContentLoaded', function () {
  
    Promise.all([getUserInfo(), getCards()])
      .then(([user,cards]) => {
        profileTitleElement.textContent = user.name;
        profileDescriptionElement.textContent = user.about;
        profileImageElement.style.backgroundImage = `url(${user.avatar})`;

        currentUserId = user._id; // СОХРАНЯЕМ ID ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ

         // Отрисовываем начальные карточки
        cards.forEach(cardData => {
            cardsContainer.append(createCard(cardData, currentUserId));
        });
    })
    .catch(err => {
        console.error('Ошибка при загрузке данных:', err);
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
});  
 
const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'profile__button-inactive',
    inputErrorClass: 'form__input_type_error',
    errorClass: 'popup__error_visible'
};
 
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

// НОВЫЙ ПОПАП АВАТАРА
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
 
const profileFormElement  = profilePopup.querySelector('.popup__form');
 
// поля ввода в попапе профеля
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const descriptionInput = profileFormElement.querySelector('.popup__input_type_description');
 
// Обработчики для профиля
const buttonOpenProfileEdit = document.querySelector('.profile__edit-button');
const buttonCloseProfileEdit = profilePopup.querySelector('.popup__close');

const profileSubmitButton = profileFormElement.querySelector('.popup__button'); // Кнопка формы профиля
 
// Элементы для аватара
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarLinkInput = avatarFormElement.querySelector('#avatar-link-input');
const buttonCloseAvatarEdit = avatarPopup.querySelector('.popup__close');

const avatarSubmitButton = avatarFormElement.querySelector('.popup__button'); // Кнопка формы аватара

// Открытие попапа редактирования аватара
profileImageElement.addEventListener('click', function() {
    avatarLinkInput.value = ''; // Очищаем поле при открытии
    openModal(avatarPopup);
    const inputList = Array.from(avatarFormElement.querySelectorAll('.popup__input'));
    const buttonElement = avatarFormElement.querySelector('.popup__button');
    toggleButtonState(inputList, buttonElement, validationSettings);
});

// Закрытие попапа редактирования аватара
buttonCloseAvatarEdit.addEventListener('click', function() {
    closeModal(avatarPopup);
});

// Обработчик отправки формы аватара
function handleAvatarFormSubmit(evt) {
    evt.preventDefault();
    const newAvatarLink = avatarLinkInput.value;

    renderLoading(true, avatarSubmitButton); // Показываем "Сохранение..."

    updateUserAvatar(newAvatarLink)
        .then(updatedUser => {
            profileImageElement.style.backgroundImage = `url(${updatedUser.avatar})`;
            closeModal(avatarPopup);    // Закрываем попап только при успехе
            avatarFormElement.reset(); // Сброс формы после успешной отправки
        })
        .catch(err => {
            console.error('Ошибка при обновлении аватара:', err);
            // Попап остается открытым при ошибке
        })
        .finally(() => {
            renderLoading(false, avatarSubmitButton); // Возвращаем исходный текст кнопки
        });
}
avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

buttonOpenProfileEdit.addEventListener('click', function(){
    nameInput.value = profileTitleElement.textContent;
    descriptionInput.value = profileDescriptionElement.textContent;
    openModal(profilePopup);
 
    // Активируем кнопку сразу при открытии попапа
    const inputList = Array.from(profileFormElement.querySelectorAll('.popup__input'));
    const buttonElement = profileFormElement.querySelector('.popup__button');
    toggleButtonState(inputList, buttonElement, validationSettings);
});
 
buttonCloseProfileEdit.addEventListener('click', function(){
    closeModal(profilePopup);
});

// Обработчик «отправки» формы, хотя пока она никуда отправляться не будет
function handleProfileFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

    const newName = nameInput.value;
    const newAbout = descriptionInput.value;

    renderLoading(true, profileSubmitButton); // Показываем "Сохранение..."

    updateUserInfo(newName, newAbout)
    .then(updatedUser => {
        profileTitleElement.textContent = updatedUser.name;
        profileDescriptionElement.textContent = updatedUser.about;
        closeModal(profilePopup);   // Закрываем попап только при успехе
    })
    .catch(err => {
        console.error('Ошибка при сохранении данных профиля:', err);
        // Попап остается открытым при ошибке
    })
    .finally(() => {
        renderLoading(false, profileSubmitButton); // Возвращаем исходный текст кнопки
    });
}
 
// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
profileFormElement.addEventListener('submit', handleProfileFormSubmit);
 
const profileAddButton = document.querySelector('.profile__add-button')
const buttonCloseAdd = cardPopup.querySelector('.popup__close');
const cardFormElemnt = cardPopup.querySelector('.popup__form');
const newCardSubmitButton = cardFormElemnt.querySelector('.popup__button'); // Кнопка формы добавления карточки

 
profileAddButton.addEventListener('click', function(){
    openModal(cardPopup);

    // Сброс состояния кнопки для новой карточки при открытии попапа 
    const inputList = Array.from(cardPopup.querySelectorAll('.popup__input')); 
    const buttonElement = cardPopup.querySelector('.popup__button'); 
    toggleButtonState(inputList, buttonElement, validationSettings);
});
 
buttonCloseAdd.addEventListener('click', function(){
    closeModal(cardPopup);
});
 
// поля ввода в попапе добавления места
const namePlaces = cardFormElemnt.querySelector('.popup__input_type_card-name');
const urlPlaces = cardFormElemnt.querySelector('.popup__input_type_url');
 
// Обработчик «отправки» формы
function handleCardFormSubmit (evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
 
    const cardName = namePlaces.value;
    const cardLink = urlPlaces.value;

    renderLoading(true, newCardSubmitButton, 'Создать'); // Показываем "Сохранение...", исходный текст "Создать"

    addNewCards(cardName, cardLink)
        .then(newCardData => {
            const cardsContainer = document.querySelector('.places__list');
            cardsContainer.prepend(createCard(newCardData, currentUserId));    /*метод, который вставляет элемент в начало контейнера*/
            cardFormElemnt.reset(); // Очищаем форму после добавления карточки
 
            closeModal(cardPopup);  // Закрываем попап только при успехе
        })
        .catch(err => {
            console.error('Ошибка при добавлении новой карточки:', err);
            // Попап остается открытым при ошибке
        })
        .finally(() => {
            renderLoading(false, newCardSubmitButton, 'Создать'); // Возвращаем исходный текст кнопки
        });
}
 
cardFormElemnt.addEventListener('submit', handleCardFormSubmit );
 
const imagePopupClose = imagePopup.querySelector('.popup__close');
 
imagePopupClose.addEventListener('click', function(){
    closeModal(imagePopup);
});