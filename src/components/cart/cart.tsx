import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCart } from '../../store/selectors';
import Footer from '../common/footer/footer';
import Header from '../common/header/header';
import Icons from '../common/icons/icons';
import CartItem from './components/cart-item/cart-item';
import { setPrice } from '../../utils';
import { AppRoute } from '../../const';
import { useState } from 'react';
import Coupon from './components/coupon/coupon';

const PERCENT = 100;
const DEFAULT_DISCOUNT = 0;

export default function Cart(): JSX.Element {
  const [discount, setDiscount] = useState(DEFAULT_DISCOUNT);
  const cart = useSelector(getCart);

  const totalPrice = cart.reduce((sum, {item}) => sum + item.price, 0);
  const totalCount = cart.reduce((sum, {count}) => sum + count, 0);

  const totalValue = totalPrice * totalCount;
  const discountValue = discount / PERCENT * totalValue;
  const paymentValue = totalValue - discountValue;

  return (
    <>
      <Icons />
      <div className="wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <h1 className="title title--bigger page-content__title">Корзина</h1>
            <ul className="breadcrumbs page-content__breadcrumbs page-content__breadcrumbs--on-cart-page">
              <li className="breadcrumbs__item">
                <Link to={AppRoute.Main} className="link">Главная</Link>
              </li>
              <li className="breadcrumbs__item">
                <Link to={AppRoute.Main} className="link">Каталог</Link>
              </li>
              <li className="breadcrumbs__item">
                <Link to={'#'} className="link">Корзина</Link>
              </li>
            </ul>
            <div className="cart">
              {
                !cart?.length
                  ? <>Корзина пуста</>
                  : cart.map((item) => <CartItem key={item.id} guitar={item.item} />)
              }
              <div className="cart__footer">
                {/* <div className="cart__coupon coupon">
                  <h2 className="title title--little coupon__title">Промокод на скидку</h2>
                  <p className="coupon__info">Введите свой промокод, если он у вас есть.</p>
                  <form className="coupon__form" id="coupon-form" method="post" action="/">
                    <div className="form-input coupon__input">
                      <label className="visually-hidden">Промокод</label>
                      <input type="text" placeholder="Введите промокод" id="coupon" name="coupon"/>
                      <p className="form-input__message form-input__message--success">Промокод принят</p>
                    </div>
                    <button className="button button--big coupon__button">Применить</button>
                  </form>
                </div> */}
                <Coupon setDiscount={setDiscount}/>
                <div className="cart__total-info">
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">Всего:</span>
                    <span className="cart__total-value">
                      {setPrice(totalValue)}
                    </span>
                  </p>
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">Скидка:</span>
                    <span className="cart__total-value cart__total-value--bonus">
                      - {setPrice(discountValue)}
                    </span>
                  </p>
                  <p className="cart__total-item">
                    <span className="cart__total-value-name">К оплате:</span>
                    <span className="cart__total-value cart__total-value--payment">
                      {setPrice(paymentValue)}
                    </span>
                  </p>
                  <button className="button button--red button--big cart__order-button">Оформить заказ</button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
