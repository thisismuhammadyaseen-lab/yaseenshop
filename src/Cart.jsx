cat > ~/Desktop/ecommerce-frontend/src/pages/Cart.jsx <<'EOF'
import { Link } from "react-router-dom";

function Cart({ cart, setCart }) {
  const removeFromCart = (indexToRemove) => {
    setCart((currentCart) =>
      currentCart.filter((_, index) => index !== indexToRemove)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce(
    (sum, product) => sum + product.price,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart is Empty</h1>
        <p>You haven't added any products yet.</p>

        <Link to="/">
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <div>
            <p>YASEEN SHOP</p>
            <h1>Shopping Cart</h1>
          </div>

          <Link to="/">
            ← Continue Shopping
          </Link>
        </div>

        <div className="cart-items">
          {cart.map((product, index) => (
            <div className="cart-item" key={`${product.id}-${index}`}>

              <img
                src={product.image}
                alt={product.name}
                width="150"
              />

              <div>
                <small>{product.category}</small>
                <h3>{product.name}</h3>

                <strong>
                  Rs. {product.price.toLocaleString()}
                </strong>
              </div>

              <button
                onClick={() => removeFromCart(index)}
              >
                Remove
              </button>

            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <p>
            Items: {cart.length}
          </p>

          <p>
            Total: Rs. {total.toLocaleString()}
          </p>

          <button onClick={clearCart}>
            Clear Cart
          </button>

          <button
            onClick={() => alert("Checkout coming soon!")}
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Cart;
EOF