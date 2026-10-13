import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    payment: "Cash on Delivery",
  });

  const total = cart.reduce(
    (sum, product) =>
      sum + product.price * (product.quantity || 1),
    0
  );

  const totalItems = cart.reduce(
    (sum, product) =>
      sum + (product.quantity || 1),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      `Order placed successfully!\n\nThank you ${formData.name}!`
    );

    setCart([]);

    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">🛒</div>

          <p className="checkout-label">
            YASEEN SHOP
          </p>

          <h1>Your Cart is Empty</h1>

          <p>
            Please add some products before
            checkout.
          </p>

          <Link
            to="/"
            className="continue-shopping"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* HEADER */}
        <div className="checkout-header">
          <div>
            <p className="checkout-label">
              YASEEN SHOP
            </p>

            <h1>Checkout</h1>
          </div>

          <Link
            to="/cart"
            className="back-shopping"
          >
            ← Back to Cart
          </Link>
        </div>

        <div className="checkout-layout">

          {/* CUSTOMER FORM */}
          <div className="checkout-form-card">

            <h2>Delivery Information</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="03XX-XXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PAYMENT */}
              <div className="form-group">
                <label>
                  Payment Method
                </label>

                <div className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={
                      formData.payment ===
                      "Cash on Delivery"
                    }
                    onChange={handleChange}
                  />

                  <span>
                    💵 Cash on Delivery
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
              >
                Place Order →
              </button>

            </form>
          </div>

          {/* ORDER SUMMARY */}
          <div className="checkout-summary">

            <h2>Your Order</h2>

            <div className="checkout-products">

              {cart.map((product) => (
                <div
                  className="checkout-product"
                  key={product.id}
                >
                  <div className="checkout-product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <div className="checkout-product-info">
                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      Qty: {product.quantity || 1}
                    </p>
                  </div>

                  <strong>
                    Rs.{" "}
                    {(
                      product.price *
                      (product.quantity || 1)
                    ).toLocaleString()}
                  </strong>
                </div>
              ))}

            </div>

            <div className="checkout-summary-line"></div>

            <div className="checkout-summary-row">
              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>
            </div>

            <div className="checkout-summary-row">
              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>
            </div>

            <div className="checkout-total">
              <span>
                Total
              </span>

              <strong>
                Rs. {total.toLocaleString()}
              </strong>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;