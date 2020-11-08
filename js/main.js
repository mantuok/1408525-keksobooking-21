'use strict';

const Key = {
  ENTER: `Enter`,
  ESC: `Escape`
};
const Mouse = {
  LEFT_BUTTON: 0,
};
const advertForm = document.querySelector(`.ad-form`);
const mapPinMain = document.querySelector(`.map__pin--main`);
const titleInput = advertForm.querySelector(`[name='title']`);
const typeSelect = advertForm.querySelector(`[name='type']`);
const priceInput = advertForm.querySelector(`[name='price']`);
const roomsSelect = advertForm.querySelector(`[name='rooms']`);
const guestsSelect = advertForm.querySelector(`[name='capacity']`);
const checkInSelect = advertForm.querySelector(`[name='timein']`);
const checkOutSelect = advertForm.querySelector(`[name='timeout']`);
const resetButton = advertForm.querySelector(`.ad-form__reset`);
const filterByType = document.querySelector(`[name='housing-type']`);
const filterByPrice = document.querySelector(`[name='housing-price']`);
const filterByRooms = document.querySelector(`[name='housing-rooms']`);
const filterByGuests = document.querySelector(`[name='housing-guests']`);
const filterByFeatures = Array.from(document.querySelectorAll(`[name='features']`));
const pins = document.querySelector(`.map__pins`);
const submitButton = document.querySelector(`.ad-form__submit`);

const onDownloadSuccess = (adverts) => {
  window.advertsList = adverts;
};

const onSuccesUpload = () => {
  advertForm.reset();
  window.messageHandler.show(`success`);
  window.pageMode.deactivate();
};

const onFailedUpload = () => {
  window.messageHandler.show(`error`);
};

const filterList = window.debounce(function () {
  if (document.querySelector(`.map__card`)) {
    window.cardPopup.close();
  }
  const filteredAdverts = window.filterAdverts.list();
  window.elementsRender.filteredPins(filteredAdverts);
});

mapPinMain.addEventListener(`mousedown`, window.pageMode.activateOnMousedown);

mapPinMain.addEventListener(`keydown`, window.pageMode.activateOnKeydown);

window.pageMode.deactivate();

window.backend.download(onDownloadSuccess, window.messageHandler.onDownloadError);

mapPinMain.addEventListener(`mousedown`, function (evt) {
  return window.pinMove.move(evt);
});

pins.addEventListener(`click`, function (evt) {
  const target = evt.target;
  const targetParent = target.parentNode;
  if (targetParent.classList.contains(`map__pin`) && !targetParent.classList.contains(`map__pin--main`)) {
    evt.preventDefault();
    window.cardPopup.close();
    window.cardPopup.open(target.alt);
  }
});

pins.addEventListener(`keydown`, function (evt) {
  const target = evt.target;
  if (evt.key === Key.ENTER && !target.classList.contains(`map__pin--main`)) {
    evt.preventDefault();
    window.cardPopup.close();
    window.cardPopup.open(target.querySelector(`img`).alt);
  }
}, true);

titleInput.addEventListener(`input`, window.formValidation.onTitleEnter);

typeSelect.addEventListener(`change`, window.formValidation.onTypeChange);

priceInput.addEventListener(`input`, window.formValidation.onPriceEnter);

checkInSelect.addEventListener(`change`, function () {
  return window.formValidation.onCheckInOutChange(checkInSelect, checkOutSelect);
});

checkOutSelect.addEventListener(`change`, function () {
  return window.formValidation.onCheckInOutChange(checkOutSelect, checkInSelect);
});

guestsSelect.addEventListener(`change`, window.formValidation.onRoomsOrGuestsChange);

roomsSelect.addEventListener(`change`, window.formValidation.onRoomsOrGuestsChange);

submitButton.addEventListener(`click`, window.formValidation.onSubmitValidateAll);

submitButton.addEventListener(`keydown`, window.utils.invokeIfKeyIs(Key.ENTER, window.formValidation.onSubmitValidateAll));

advertForm.addEventListener(`submit`, function (evt) {
  const advertData = new FormData(advertForm);
  window.backend.upload(onSuccesUpload, onFailedUpload, advertData);
  evt.preventDefault();
});

resetButton.addEventListener(`click`, function () {
  advertForm.reset();
});

filterByType.addEventListener(`change`, filterList);
filterByPrice.addEventListener(`change`, filterList);
filterByRooms.addEventListener(`change`, filterList);
filterByGuests.addEventListener(`change`, filterList);
filterByFeatures.forEach((feature) => feature.addEventListener(`change`, filterList));
