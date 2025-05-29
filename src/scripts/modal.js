// Функция открытия попапа
export function openModal(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeByEsc); // Добавляем обработчик для закрытия на Esc
}
 
// Функция закрытия попапа
export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeByEsc); // Удаляем обработчик для закрытия на Esc
}
 
export function closeByOverlay(evt) {
    if (evt.target === evt.currentTarget) {     // evt.target - это конкретный элемент, по которому кликнули
                                                // evt.currentTarget - это элемент, на котором висит обработчик события (в нашем случае - сам попап)
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}
 
export function closeByEsc(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}