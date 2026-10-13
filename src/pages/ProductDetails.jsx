import { Link, useParams } from "react-router-dom";

import headphones from "../assets/headphones.jpg";
import smartwatch from "../assets/smartwatch.jpg";
import shoes from "../assets/shoes.jpg";
import backpack from "../assets/backpack.jpg";

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 4999,
      category: "Electronics",
      image: headphones,
      description:
        "Enjoy clear and powerful sound with these comfortable wireless headphones. Perfect for music, videos, gaming and everyday use.",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 6999,
      category: "Electronics",
      image: smartwatch,
      description:
        "A modern smart watch designed for everyday life. Track your activities, stay connected and keep your style simple.",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 5499,
      category: "Fashion",
      image: shoes,
      description:
        "Comfortable running shoes made for daily walking, exercise and sports activities.",
    },
    {
      id: 4,
      name: "Premium Backpack",
      price: 3499,
      category: "Fashion",
      image: backpack,
      description:
        "A stylish and durable backpack with enough space for your laptop, books and everyday essentials.",
    },
  ];

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>

        <p>
          Sorry, this product does not exist.
        </p>

        <Link to="/" className="continue-shopping">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-details-page">

      <div className="product-details-container">

        <Link to="/" className="details-back">
          ← Back to Shop
        </Link>

        <div className="product-details">

          <div className="details-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="details-info">

            <p className="details-category">
              {product.category}
            </p>

            <h1>{product.name}</h1>

            <div className="details-rating">
              ⭐⭐⭐⭐⭐
              <span> 4.8 / 5</span>
            </div>

            <h2>
              Rs. {product.price.toLocaleString()}
            </h2>

            <p className="details-description">
              {product.description}
            </p>

            <div className="details-features">
              <div>
                ✓ Quality Product
              </div>

              <div>
                ✓ Fast Delivery
              </div>

              <div>
                ✓ Secure Payment
              </div>
            </div>

            <button
              className="details-cart-btn"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

            <Link
              to="/cart"
              className="details-view-cart"
            >
              View Cart →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;