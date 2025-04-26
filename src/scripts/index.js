// Добавляем модификатор для анимации всем попапам при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
      popup.classList.add('popup_is-animated');

      // Добавляем обработчик клика на оверлей для закрытия попапа
      popup.addEventListener('mousedown', closeByOverlay);

    });

    enableValidation();
});  

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
    toggleButtonState(inputList, buttonElement);
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

    initialCards.unshift(newCard);

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


// добавляет текст ошибки
const showInputError = (formElement, inputElement) => {

    // сообщение об ошибке в редоктировании профиля
    const textError = formElement.querySelector(`.${inputElement.id}-error`);

    let errorMessage = inputElement.validationMessage;

    if(inputElement.validity.valueMissing){
        errorMessage = 'Вы пропустили это поле.';
    }
    // Кастомное сообщение для невалидного URL
    else if(inputElement.type === 'url' && !inputElement.validity.valid) {
        errorMessage = 'Введите адрес картинки';
    };

    inputElement.classList.add('form__input_type_error');
    textError.textContent = errorMessage;
};

// удаляет текст ошибки
const hideInputError = (formElement, inputElement) => {

    // сообщение об ошибке в редоктировании профиля
    const textError = formElement.querySelector(`.${inputElement.id}-error`);

    inputElement.classList.remove('form__input_type_error');
    textError.textContent = '';
}

const isValid = (formElement, inputElement) => {
    if (!inputElement.validity.valid) {
        // Если поле не проходит валидацию, покажем ошибку
        showInputError(formElement, inputElement);
    }
    else {
        // Если проходит, скроем
        hideInputError(formElement, inputElement);
    }
};


const hasInvalidInput = (inputList) => {            // Функция принимает массив полей
    // проходим по этому массиву методом some
    return inputList.some((inputElement) => {
      // Если поле не валидно, колбэк вернёт true. Обход массива прекратится и вся функция hasInvalidInput вернёт true
  
      return !inputElement.validity.valid;
    })
};

const toggleButtonState = (inputList, buttonElement) => {           // Функция принимает массив полей ввода и элемент кнопки, состояние которой нужно менять
    // Если есть хотя бы один невалидный инпут
    if (hasInvalidInput(inputList)) {

      // сделай кнопку неактивной
      buttonElement.disabled = true;
      buttonElement.classList.add('profile__button-inactive');
    } else {
        
      // иначе сделай кнопку активной
      buttonElement.disabled = false;
      buttonElement.classList.remove('profile__button-inactive');
    }
};

const setEventListeners = (profileFormElement) => {

    // Находим все поля внутри формы, сделаем из них массив методом Array.from
    const inputList = Array.from(profileFormElement.querySelectorAll('.popup__input'));
    const buttonElement = profileFormElement.querySelector('.popup__button');

    // Вызовем toggleButtonState, чтобы не ждать ввода данных в поля
    toggleButtonState(inputList, buttonElement);

    // Обойдём все элементы полученной коллекции
    inputList.forEach((inputElement) => {
      // каждому полю добавим обработчик события input
      inputElement.addEventListener('input', () => {
        // Внутри колбэка вызовем isValid, передав ей форму и проверяемый элемент
        isValid(profileFormElement, inputElement);

        // Вызовем toggleButtonState и передадим ей массив полей и кнопку
        toggleButtonState(inputList, buttonElement);
      });
    });
};

const enableValidation = () => {
    // Найдём все формы с указанным классом в DOM, сделаем из них массив методом Array.from
    const formList = Array.from(document.querySelectorAll('.popup__form'));
  
    // Переберём полученную коллекцию
    formList.forEach((formElement) => {
      // Для каждой формы вызовем функцию setEventListeners, передав ей элемент формы
      setEventListeners(formElement);
    });
};

enableValidation();

