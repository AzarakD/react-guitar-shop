import {
  FocusEvent,
  useState
} from 'react';
import {
  setGuitarType,
  setPrice
} from '../../../../utils';
import { Count } from '../../../../const';
import { Guitar } from '../../../../types/guitar';

export default function CartItem({guitar}: {guitar: Guitar}): JSX.Element {
  const {
    name,
    vendorCode,
    type,
    previewImg,
    stringCount,
    price,
  } = guitar;

  const [totalPrice, setTotalPrice] = useState(price);
  const [userInput, setUserInput] = useState(Count.Min);

  const onMinusEvent = () => {
    const total = userInput - 1;

    if (total >= Count.Min) {
      setTotalPrice(totalPrice - price);
      setUserInput(total);
    }
  };

  const onPlusEvent = () => {
    const total = userInput + 1;

    if (total < Count.Max) {
      setTotalPrice(totalPrice + price);
      setUserInput(total);
    }
  };

  const onBlur = (evt: FocusEvent<HTMLInputElement, Element>) => {
    let inputValue = +evt.currentTarget.value;

    if (inputValue < Count.Min) {
      inputValue = Count.Min;
    } else if (inputValue > Count.Max) {
      inputValue = Count.Max;
    }
    setTotalPrice(inputValue * price);
    setUserInput(inputValue);
  };

  return (
    <div className="cart-item">
      <button className="cart-item__close-button button-cross" type="button" aria-label="Удалить">
        <span className="button-cross__icon"></span>
        <span className="cart-item__close-button-interactive-area"></span>
      </button>
      <div className="cart-item__image">
        <img src={previewImg.replace('/', '/content/')} width="55" height="130" alt={name}/>
      </div>
      <div className="product-info cart-item__info">
        <p className="product-info__title">{name}</p>
        <p className="product-info__info">Артикул: {vendorCode}</p>
        <p className="product-info__info">{setGuitarType(type)}, {stringCount} струнная</p>
      </div>
      <div className="cart-item__price">{setPrice(price)}</div>
      <div className="quantity cart-item__quantity">
        <button
          className="quantity__button"
          aria-label="Уменьшить количество"
          onClick={onMinusEvent}
        >
          <svg width="8" height="8" aria-hidden="true">
            <use xlinkHref="#icon-minus"></use>
          </svg>
        </button>
        <input
          className="quantity__input"
          type="number"
          placeholder={`${Count.Min}`}
          id="2-count"
          name="2-count"
          max={`${Count.Max}`}
          onChange={(evt) => setUserInput(+evt.currentTarget.value)}
          onBlur={onBlur}
          value={userInput}
        />
        <button
          className="quantity__button"
          aria-label="Увеличить количество"
          onClick={onPlusEvent}
        >
          <svg width="8" height="8" aria-hidden="true">
            <use xlinkHref="#icon-plus"></use>
          </svg>
        </button>
      </div>
      <div className="cart-item__price-total">{setPrice(totalPrice)}</div>
    </div>
  );
}
