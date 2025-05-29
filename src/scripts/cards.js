

export const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];

export function createCard(cardData) {
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

/*// Функция создания карточки
export function createCard(cardData, handleLikeClick, handleDeleteClick, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // лайк карточке
  likeButton.addEventListener('click', () => {
    handleLikeClick(likeButton);
  });

  // Обработчик лайка карточки
  const handleLikeClick = (likeButton) => {
    likeButton.classList.toggle('card__like-button_is-active');
  };

  // удаление карточки
  deleteButton.addEventListener('click', () => {
    handleDeleteClick(cardElement);
  });

  // Обработчик удаления карточки
  const handleDeleteClick = (cardElement) => {
    cardElement.remove();
  };

  // Добавляем обработчик клика на изображение карточки
  cardImage.addEventListener('click', () => {
    handleImageClick(cardData.link, cardData.name);
  });
  
  return cardElement;
};*/