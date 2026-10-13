const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import AdminDashboard from "./AdminDashboard.jsx";
import "./App.css";

import headphones from "./assets/headphones.jpg";
import smartwatch from "./assets/smartwatch.jpg";
import shoes from "./assets/shoes.jpg";
import backpack from "./assets/backpack.jpg";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 4999,
    category: "Electronics",
    image: headphones,
    rating: 4.8,
    description:
      "Enjoy your favorite music with stylish wireless headphones, comfortable ear cushions and clear sound.",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 6999,
    category: "Electronics",
    image: smartwatch,
    rating: 4.7,
    description:
      "A modern smartwatch for everyday style, activity tracking and convenient daily use.",
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 5499,
    category: "Fashion",
    image: shoes,
    rating: 4.6,
    description:
      "Comfortable running shoes designed for daily walking, exercise and casual outfits.",
  },
  {
    id: 4,
    name: "Premium Backpack",
    price: 3499,
    category: "Fashion",
    image: backpack,
    rating: 4.8,
    description:
      "A practical backpack for students, travel and everyday essentials.",
  },
];

const money = (amount) =>
  `Rs. ${Number(amount).toLocaleString("en-PK")}`;

function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          Yaseen<span>Shop.</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="/#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/#products" onClick={() => setMenuOpen(false)}>Products</a>
          <a href="/#categories" onClick={() => setMenuOpen(false)}>Categories</a>
          <a href="/#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>

        <Link to="/cart" className="cart-btn">
          <span>🛒</span> Cart
          <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </header>
  );
}

function Home({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow">WELCOME TO YASEEN SHOP</span>
          <h1>
            Shop Smart.
            <br />
            Live <span>Better.</span>
          </h1>
          <p>
            Discover quality products at amazing prices.
            Find your everyday essentials in one place.
          </p>
          <a href="#products" className="primary-btn">
            Explore Products <span>→</span>
          </a>
          <div className="hero-trust">
            <span>✓ Quality products</span>
            <span>✓ Easy shopping</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow"></div>
          <img src={headphones} alt="Featured wireless headphones" />
          <div className="floating-card">
            <span>✨ Customer favorite</span>
            <strong>Premium Collection</strong>
            <small>Find something you love.</small>
          </div>
          <div className="hero-badge">NEW<br />COLLECTION</div>
        </div>
      </section>

      <section className="benefits">
        <div><span>🚚</span><div><strong>Fast Delivery</strong><small>Convenient delivery</small></div></div>
        <div><span>🔒</span><div><strong>Secure Checkout</strong><small>Simple order process</small></div></div>
        <div><span>⭐</span><div><strong>Quality Picks</strong><small>Selected products</small></div></div>
      </section>

      <section className="categories section" id="categories">
        <div className="section-heading">
          <div><span className="eyebrow">FIND YOUR STYLE</span><h2>Shop by Category</h2></div>
          <p>Explore products for your everyday needs.</p>
        </div>

        <div className="category-grid">
          <button className="category-card electronics" onClick={() => { setCategory("Electronics"); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>🎧</span><strong>Electronics</strong><small>Gadgets and accessories</small>
          </button>
          <button className="category-card fashion" onClick={() => { setCategory("Fashion"); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>👟</span><strong>Fashion</strong><small>Style for every day</small>
          </button>
          <button className="category-card home-category" onClick={() => { setSearch(""); setCategory("All"); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>🏠</span><strong>Everyday Essentials</strong><small>Useful things, all in one place</small>
          </button>
        </div>
      </section>

      <section className="products section" id="products">
        <div className="section-heading">
          <div><span className="eyebrow">OUR COLLECTION</span><h2>Featured Products</h2></div>
          <p>Find your next favorite item.</p>
        </div>

        <div className="product-tools">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
          <div className="filter-buttons">
            {["All", "Electronics", "Fashion"].map((item) => (
              <button
                key={item}
                className={category === item ? "filter-btn active" : "filter-btn"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`} className="product-image">
                <span className="product-label">POPULAR</span>
                <img src={product.image} alt={product.name} />
              </Link>

              <div className="product-info">
                <small className="product-category">{product.category}</small>
                <Link to={`/product/${product.id}`} className="product-title">
                  {product.name}
                </Link>
                <div className="product-rating">★ {product.rating} <span>(Customer rating)</span></div>
                <div className="product-bottom">
                  <strong>{money(product.price)}</strong>
                  <button onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>+ Add</button>
                </div>
                <Link to={`/product/${product.id}`} className="details-link">View details →</Link>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-search">
            <span>🔎</span>
            <h3>No products found</h3>
            <p>Try another search or select a different category.</p>
            <button className="primary-btn" onClick={() => { setSearch(""); setCategory("All"); }}>Show all products</button>
          </div>
        )}
      </section>

      <section className="about-section" id="about">
        <div>
          <span className="eyebrow">THE YASEEN SHOP PROMISE</span>
          <h2>A better shopping experience starts here.</h2>
          <p>Discover useful products with a clean, simple and convenient shopping experience.</p>
        </div>
        <div className="about-features">
          <div><span>01</span><h3>Simple Shopping</h3><p>Find products and add them to your cart easily.</p></div>
          <div><span>02</span><h3>Clear Pricing</h3><p>See product prices and your order total.</p></div>
          <div><span>03</span><h3>Easy Checkout</h3><p>Enter your delivery details to prepare an order.</p></div>
        </div>
      </section>
    </>
  );
}

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const changeQuantity = (id, amount) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <main className="inner-page">
      <div className="page-heading">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>Shopping Cart</h1>
        <p>Review your items before checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <span>🛒</span><h2>Your cart is empty</h2>
          <p>Explore our collection and find something you like.</p>
          <Link to="/#products" className="primary-btn">Continue Shopping →</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <small>{item.category}</small>
                  <h3>{item.name}</h3>
                  <strong>{money(item.price)}</strong>
                  <button className="remove-btn" onClick={() => setCart((current) => current.filter((p) => p.id !== item.id))}>Remove</button>
                </div>
                <div className="quantity-box">
                  <button onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity">−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                </div>
                <strong className="item-total">{money(item.price * item.quantity)}</strong>
              </article>
            ))}
            <button className="text-btn" onClick={() => setCart([])}>Clear cart</button>
          </div>

          <aside className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-line"><span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span><strong>{money(total)}</strong></div>
            <div className="summary-line"><span>Delivery</span><strong>Calculated later</strong></div>
            <div className="summary-total"><span>Subtotal</span><strong>{money(total)}</strong></div>
            <button className="primary-btn full-btn" onClick={() => navigate("/checkout")}>Proceed to Checkout →</button>
            <Link className="continue-link" to="/">← Continue shopping</Link>
          </aside>
        </div>
      )}
    </main>
  );
}

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <main className="inner-page empty-state"><h1>Product not found</h1><Link to="/" className="primary-btn">Back to shop</Link></main>;
  }

  return (
    <main className="inner-page">
      <Link to="/" className="back-link">← Back to shop</Link>
      <div className="details-layout">
        <div className="details-image"><img src={product.image} alt={product.name} /></div>
        <div className="details-info">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="product-rating">★ {product.rating} <span>Customer rating</span></div>
          <h2 className="details-price">{money(product.price)}</h2>
          <p>{product.description}</p>
          <div className="detail-perks"><span>✓ Quality selection</span><span>✓ Easy ordering</span><span>✓ Convenient checkout</span></div>
          <button className="primary-btn" onClick={() => { addToCart(product); navigate("/cart"); }}>Add to Cart →</button>
          <button className="secondary-btn" onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>
    </main>
  );
}

function CheckoutPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity
          }))
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Order submit nahi hua.");
      }

      setOrderId(result.orderId);
      setOrderPlaced(true);
      setCart([]);
    } catch (error) {
      setSubmitError(
        error.message || "Backend se connection nahi ho saka. Server check karo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <main className="inner-page empty-state">
        <span>🛍️</span><h2>Your cart is empty</h2>
        <p>Add a product before checking out.</p>
        <Link to="/" className="primary-btn">Browse Products</Link>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="inner-page">
        <div className="success-state">
          <span>✓</span><h1>Order placed successfully!</h1>
          <p>Your order has been saved to the database.</p>
          <p><strong>Order number: #{orderId}</strong></p>
          <p>Total: {money(total)}</p>
          <p className="demo-note">Payment method: Cash on Delivery. Order status: Pending.</p>
          <button className="primary-btn" onClick={() => navigate("/")}>Return to Shop</button>
        </div>
      </main>
    );
  }

  return (
    <main className="inner-page">
      <div className="page-heading">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Checkout</h1>
        <p>Enter your delivery details below.</p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Delivery Information</h2>
          <label>Full Name<input name="name" value={form.name} onChange={updateField} placeholder="Enter your full name" required /></label>
          <label>Phone Number<input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="03XX XXXXXXX" required /></label>
          <label>Delivery Address<textarea name="address" value={form.address} onChange={updateField} placeholder="House, street and area" rows="3" required /></label>
          <label>City<input name="city" value={form.city} onChange={updateField} placeholder="Enter your city" required /></label>
          <div className="payment-note"><span>💵</span><div><strong>Cash on Delivery</strong><p>Payment method shown for this frontend demo.</p></div></div>
          {submitError && <p className="demo-note" role="alert">{submitError}</p>}
          <button className="primary-btn full-btn" type="submit" disabled={submitting}>
            {submitting ? "Saving Order..." : "Place Order →"}
          </button>
        </form>
        <aside className="summary-card">
          <h2>Your Order</h2>
          {cart.map((item) => (
            <div className="checkout-product" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div><strong>{item.name}</strong><small>Quantity: {item.quantity}</small></div>
              <b>{money(item.price * item.quantity)}</b>
            </div>
          ))}
          <div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>
        </aside>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="logo">Yaseen<span>Shop.</span></Link>
      <p>Discover your everyday essentials.</p>
      <small>© 2026 YaseenShop. Frontend demo.</small>
    </footer>
  );
}

function AppContent() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />
        <Route path="*" element={<main className="inner-page empty-state"><h1>Page not found</h1><Link to="/" className="primary-btn">Go Home</Link></main>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
