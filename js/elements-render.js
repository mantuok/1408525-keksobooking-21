'use strict';

(function () {
  const PIN_NUMBER = 5;
  const PropertyType = {
    flat: `Квартира`,
    bungalow: `Бунгало`,
    house: `Дом`,
    palace: `Дворец`
  };
  const ProprtyFeature = {
    wifi: `popup__feature--wifi`,
    dishwasher: `popup__feature--dishwasher`,
    parking: `popup__feature--parking`,
    washer: `popup__feature--washer`,
    elevator: `popup__feature--elevator`,
    conditioner: `popup__feature--conditioner`
  };
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  const map = document.querySelector(`.map`);
  const mapFilter = document.querySelector(`.map__filters-container`);
  const pins = document.querySelector(`.map__pins`);

  const getPropertyPhotos = (advert, cardElement) => {
    const photos = Array.from(advert.offer.photos);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < photos.length; i++) {
      const photoElement = document.createElement(`img`);
      photoElement.src = `${advert.offer.photos[i]}`;
      photoElement.width = `45`;
      photoElement.height = `40`;
      photoElement.alt = `Фотография жилья`;
      photoElement.classList.add(`popup__photo`);
      fragment.appendChild(photoElement);
    }
    cardElement.querySelector(`.popup__photos`).appendChild(fragment);
  };

  const getPropertyFeatures = (advert, cardElement) => {
    const featureList = cardElement.querySelector(`.popup__features`);
    const features = Array.from(advert.offer.features);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < features.length; i++) {
      const featureElement = document.createElement(`li`);
      featureElement.classList.add(`popup__feature`, `${ProprtyFeature[features[i]]}`);
      fragment.appendChild(featureElement);
    }
    featureList.appendChild(fragment);
  };

  const renderData = (element, block, type, value) => {
    if (value !== undefined) {
      element.querySelector(block)[type] = value;
    } else {
      element.querySelector(block).style.display = `none`;
    }
  };

  const renderPin = (advert) => {
    const pinElement = pinTemplate.cloneNode(true);
    pinElement.style = `top: ${advert.location.y + pinElement.offsetHeight / 2}px; left: ${advert.location.x + pinElement.offsetWidth / 2}px`;
    renderData(pinElement, `img`, `src`, `${advert.author.avatar}`);
    renderData(pinElement, `img`, `alt`, `${advert.offer.title}`);
    return pinElement;
  };

  const renderCard = (advert) => {
    const cardElement = cardTemplate.cloneNode(true);
    Array.from(cardElement.querySelectorAll(`.popup__feature`)).forEach((element) => element.remove());
    cardElement.querySelector(`.popup__photo`).remove();
    renderData(cardElement, `.popup__avatar`, `src`, `${advert.author.avatar}`);
    renderData(cardElement, `.popup__title`, `textContent`, `${advert.offer.title}`);
    renderData(cardElement, `.popup__text--address`, `textContent`, `${advert.offer.address}`);
    renderData(cardElement, `.popup__text--price`, `textContent`, `${advert.offer.price} руб./ночь`);
    renderData(cardElement, `.popup__type`, `textContent`, `${PropertyType[advert.offer.type]}`);
    renderData(cardElement, `.popup__text--capacity`, `textContent`, `Количество комнат: ${advert.offer.rooms}; Максимальное количество гостей: ${advert.offer.guests}`);
    renderData(cardElement, `.popup__text--time`, `textContent`, `Заезд после ${advert.offer.checkin}, выезд до ${advert.offer.checkout}`);
    getPropertyFeatures(advert, cardElement);
    renderData(cardElement, `.popup__description`, `textContent`, `${advert.offer.description}`);
    getPropertyPhotos(advert, cardElement);
    return cardElement;
  };

  const renderAllPins = (adverts) => {
    const fragment = document.createDocumentFragment();
    window.utils.getTruncatedArray(adverts, PIN_NUMBER)
      .map(renderPin)
      .forEach((renderedPin) =>
        fragment.appendChild(renderedPin));
    pins.appendChild(fragment);
  };

  const renderSelectedCard = (adverts, selectedCard) => {
    const fragment = document.createDocumentFragment();
    adverts.forEach((advert) => {
      if (selectedCard === advert.offer.title) {
        fragment.appendChild(renderCard(advert));
      }
    });
    map.insertBefore(fragment, mapFilter);
  };

  window.elementsRender = {
    pin: renderPin,
    card: renderCard,
    allPins: renderAllPins,
    selectedCard: renderSelectedCard
  };
})();
