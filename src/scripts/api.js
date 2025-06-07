
// Объект конфигурации для всех запросов, запрос к сереру (API)
const config = {
    baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202', // Проверьте, что это ваш актуальный cohortId
    headers: {
        authorization: '03f97712-def8-4441-86d0-7714121d8da0', // Проверьте, что это ваш актуальный токен
        'Content-Type': 'application/json'
    }
};

// Get - запрос на адрес
export function getUserInfo() {
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
export function getInitialCards(){
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
export function updateUserInfo(name, about){
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

// Добавление новой карточки
export function addNewCard(name, link){
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

// Удаление карточки
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

// для смены аватара
export function updateUserAvatar(avatarLink){
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