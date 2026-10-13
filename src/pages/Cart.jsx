import { Link } from "react-router-dom";

function Cart({ cart, setCart }) {
  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: (item.quantity || 1) - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce(
    (sum, product) =>
      sum +
      product.price * (product.quantity || 1),
    0
  );

  const totalItems = cart.reduce(
    (sum, product) =>
      sum + (product.quantity || 1),
    0
  );

  /* EMPTY CART */
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">

          <div className="empty-icon">
            🛒
          </div>

          <p className="cart-label">
            YASEEN SHOP
          </p>

          <h1>
            Your Cart is Empty
          </h1>

          <p className="empty-text">
            You haven't added any products
            to your cart yet.
          </p>

          <Link
            to="/"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* HEADER */}
        <div className="cart-header">

          <div>
            <p className="cart-label">
              YASEEN SHOP
            </p>

            <h1>
              Shopping Cart
            </h1>
          </div>

          <Link
            to="/"
            className="back-shopping"
          >
            ← Continue Shopping
          </Link>

        </div>

        <div className="cart-layout">

          {/* CART PRODUCTS */}
          <div className="cart-items">

            {cart.map((product) => (
              <div
                className="cart-item"
                key={product.id}
              >

                {/* IMAGE */}
                <div className="cart-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                {/* PRODUCT INFO */}
                <div className="cart-product-info">

                  <small>
                    {product.category}
                  </small>

                  <h3>
                    {product.name}
                  </h3>

                  <strong>
                    Rs.{" "}
                    {product.price.toLocaleString()}
                  </strong>

                  {/* QUANTITY */}
                  <div className="quantity-box">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          product.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {product.quantity || 1}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          product.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="cart-item-right">

                  <strong className="item-total">
                    Rs.{" "}
                    {(
                      product.price *
                      (product.quantity || 1)
                    ).toLocaleString()}
                  </strong>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(
                        product.id
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* ORDER SUMMARY */}
          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                Rs.{" "}
                {total.toLocaleString()}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>

            <div className="summary-line"></div>

            <div className="total-row">

              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {total.toLocaleString()}
              </strong>

            </div>

            {/* CHECKOUT BUTTON */}
            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout →
            </Link>

            {/* CLEAR CART */}
            <button
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Cart;