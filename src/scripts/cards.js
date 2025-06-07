import { openModal } from './modal.js'

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

export function createCard(cardData) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
 
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');

  const likeCountElement = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Устанавливаем количество лайков на карточке
  // Проверяем, существует ли массив likes и если да, то берем его длину
  if (cardData.likes && Array.isArray(cardData.likes)) { // ДОБАВЬТЕ ЭТОТ БЛОК
    likeCountElement.textContent = cardData.likes.length;
  } else {
    likeCountElement.textContent = '0'; // Если лайков нет или свойство отсутствует, отображаем 0
  }
 
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