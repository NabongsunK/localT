import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { pop, change } from "../../store/cartSlice";

import styles from "./cartlistitem.module.css";

const CartListItem = function (props) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.myCartSlice.myCarts);

  const removeItem = function (id) {
    cartItems.forEach((item, i) => {
      if (item.index === id) {
        dispatch(pop({ index: i }));
        return false;
      }
    });
  };

  const increaseQuantity = function (id) {
    cartItems.forEach((item, i) => {
      if (item.index === id) {
        const updateItem = { ...item, quantity: item.quantity + 1 };
        dispatch(change({ index: i, updateItem }));
        return false;
      }
    });
  };

  const decreaseQuantity = function (id) {
    cartItems.forEach((item, i) => {
      if (item.index === id) {
        if (item.quantity === 1) {
          dispatch(pop({ index: i }));
        } else {
          const updateItem = { ...item, quantity: item.quantity - 1 };
          dispatch(change({ index: i, updateItem }));
        }
        return false;
      }
    });
  };
  const img = props.item.image;

  const poster =
    props.item.image === "" ? (
      <div
        className={styles.mycartitem}
        style={{
          backgroundImage: "url('/assets/images/fes_default.jpg')",
          // width: "",
          height: "200px",
          backgroundSize: "cover",
        }}
      ></div>
    ) : (
      <div
        className={styles.mycartitem}
        style={{
          backgroundImage: `url("${img}")`,
          width: "100%",
          height: "200px",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    );

  return (
    <div className="single-cart-item">
      <Link to="#" className="product-image">
        <div className="row">
          <div className="col-4 p-0">{poster}</div>
          <div className="col-8">
            <div className="cart-item-desc">
              <div className="row">
                <div
                  className="col-9"
                  style={{ overflow: "hidden", paddingRight: "0" }}
                >
                  <span className="badge">{props.item.badge}</span>
                </div>
                <div className="col-2">
                  <div className="product-remove">
                    <i
                      className="fa fa-close"
                      aria-hidden="true"
                      onClick={() => removeItem(props.item.index)}
                    ></i>
                  </div>
                </div>
              </div>

              <h6>{props.item.name}</h6>
              <p className="size">
                수량:{" "}
                <button
                  className="mybtn"
                  onClick={() => decreaseQuantity(props.item.index)}
                >
                  <i className="fa fa-minus"></i>
                </button>
                {props.item.quantity}
                <button
                  className="mybtn"
                  onClick={() => increaseQuantity(props.item.index)}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </p>
              <p className="price">
                {(props.item.price * props.item.quantity).toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CartListItem;
