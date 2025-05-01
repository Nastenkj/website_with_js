export const enableValidation = (settings) => {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));
    formList.forEach((formElement) => {
      setEventListeners(formElement, settings);
    });
};
 
const setEventListeners = (profileFormElement, settings) => {
 
    // Находим все поля внутри формы, сделаем из них массив методом Array.from
    const inputList = Array.from(profileFormElement.querySelectorAll(settings.inputSelector));
    const buttonElement = profileFormElement.querySelector(settings.submitButtonSelector);
 
    // Вызовем toggleButtonState, чтобы не ждать ввода данных в поля
    toggleButtonState(inputList, buttonElement,settings);
 
    // Обойдём все элементы полученной коллекции
    inputList.forEach((inputElement) => {
      // каждому полю добавим обработчик события input
      inputElement.addEventListener('input', () => {
        // Внутри колбэка вызовем isValid, передав ей форму и проверяемый элемент
        checkInputValidity(profileFormElement, inputElement, settings);
 
        // Вызовем toggleButtonState и передадим ей массив полей и кнопку
        toggleButtonState(inputList, buttonElement,settings);
      });
    });
};
 
    // добавляет текст ошибки
const showInputError = (formElement, inputElement, settings) => {
 
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
 
    inputElement.classList.add(settings.inputErrorClass);
    textError.textContent = errorMessage;
};
 
    // удаляет текст ошибки
const hideInputError = (formElement, inputElement, settings) => {
 
    // сообщение об ошибке в редоктировании профиля
    const textError = formElement.querySelector(`.${inputElement.id}-error`);
 
    inputElement.classList.remove(settings.inputErrorClass);
    textError.textContent = '';
};
 
const checkInputValidity = (formElement, inputElement, settings) => {
    if (!inputElement.validity.valid) {
        let errorMessage = inputElement.validationMessage;
 
        if (inputElement.validity.valueMissing) {
          errorMessage = 'Вы пропустили это поле.';
        } else if (inputElement.type === 'url' && !inputElement.validity.valid) {
          errorMessage = 'Введите адрес картинки';
        }
 
        showInputError(formElement, inputElement, errorMessage, settings);
    } else {
        hideInputError(formElement, inputElement, settings);
    }
};
 
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
    });
};
 
export const toggleButtonState = (inputList, buttonElement,settings) => {           // Функция принимает массив полей ввода и элемент кнопки, состояние которой нужно менять
    // Если есть хотя бы один невалидный инпут
    if (hasInvalidInput(inputList)) {
 
        // сделай кнопку неактивной
        buttonElement.disabled = true;
        buttonElement.classList.add(settings.inactiveButtonClass);
    } else {
 
        // иначе сделай кнопку активной
        buttonElement.disabled = false;
        buttonElement.classList.remove(settings.inactiveButtonClass);
    }
};