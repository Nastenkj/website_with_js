import { openModal } from './modal.js';
import { deleteCardFromServer, likeCard, unlikeCard } from './index.js'; 

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

export function createCard(cardData, currentUserId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
 
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');

  const likeCountElement = cardElement.querySelector('.card__like-count');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button'); // Находим кнопку удаления

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Устанавливаем количество лайков на карточке
  // Проверяем, существует ли массив likes и если да, то берем его длину
  if (cardData.likes && Array.isArray(cardData.likes)) { // ДОБАВЬТЕ ЭТОТ БЛОК
    likeCountElement.textContent = cardData.likes.length;
    // Проверяем, лайкнул ли текущий пользователь карточку 
    const hasLiked = cardData.likes.some(user => user._id === currentUserId); 
    if (hasLiked) { 
      likeButton.classList.add('card__like-button_is-active'); 
    }
  } else {
    likeCountElement.textContent = '0'; // Если лайков нет или свойство отсутствует, отображаем 0
  }

  // Логика отображения кнопки удаления
  // Проверяем, если owner._id карточки совпадает с currentUserId, то показываем кнопку
  if (cardData.owner && cardData.owner._id === currentUserId) {
    deleteButton.style.display = 'block'; // Или удалите класс, который скрывает кнопку
    // Добавляем обработчик клика на кнопку удаления
    deleteButton.addEventListener('click', function(evt){
        const cardId = cardData._id; // Получаем ID карточки
        deleteCardFromServer(cardId)
            .then(() => {
                // Если удаление с сервера прошло успешно, удаляем карточку из DOM
                evt.target.closest('.card').remove();
            })
            .catch(err => {
                console.error('Ошибка при удалении карточки:', err);
                // Можно добавить отображение ошибки пользователю
            });
    });
  } else {
    deleteButton.style.display = 'none'; // Скрываем кнопку, если карточка не наша. Или можно было бы удалить сам элемент: deleteButton.remove();
  }

  // Обработчик события для лайка/дизлайка 
  likeButton.addEventListener('click', function(evt){ 
    const cardId = cardData._id; 
    const isLiked = evt.target.classList.contains('card__like-button_is-active'); 
    if (isLiked) { 
      unlikeCard(cardId) 
        .then(updatedCard => { 
          evt.target.classList.remove('card__like-button_is-active'); 
          likeCountElement.textContent = updatedCard.likes.length; 
        })
        .catch(err => { 
          console.error('Ошибка при снятии лайка:', err); 
        }); 
      } else { 
        likeCard(cardId) 
          .then(updatedCard => { 
            evt.target.classList.add('card__like-button_is-active'); 
            likeCountElement.textContent = updatedCard.likes.length; 
          }) 
          .catch(err => { 
            console.error('Ошибка при постановке лайка:', err); 
          });
        } 
      });

  // лайк карточке
  /*cardElement.querySelector('.card__like-button').addEventListener('click', function(evt){
    evt.target.classList.toggle('card__like-button_is-active');
  });*/
 
  // удаление карточки
  /*cardElement.querySelector('.card__delete-button').addEventListener('click', function(evt){
    evt.target.closest('.card').remove();
  })*/
 
  // Добавляем обработчик клика на изображение карточки
  cardImage.addEventListener('click', function() {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopup);
  });
 
  return cardElement;
}