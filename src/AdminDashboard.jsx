
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages/AdminDashboard.css";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const money = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    () => sessionStorage.getItem("yaseenshop_admin_token") || ""
  );
  const [username, setUsername] = useState("yaseen");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyOrder, setBusyOrder] = useState(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem("yaseenshop_admin_token");
    setToken("");
    setOrders([]);
    setPassword("");
  }, []);

  const loadOrders = useCallback(async (activeToken) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await response.json();

      if (response.status === 401) {
        logout();
        setError("Session expire ho gaya. Dobara login karo.");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Orders load nahi ho sake.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Backend se connection nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) loadOrders(token);
  }, [token, loadOrders]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || "Login nahi ho saka.");
      }

      sessionStorage.setItem("yaseenshop_admin_token", data.token);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      setError(err.message || "Backend se connection nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setBusyOrder(orderId);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();

      if (response.status === 401) {
        logout();
        setError("Session expire ho gaya. Dobara login karo.");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Status update nahi hua.");
      }

      await loadOrders(token);
    } catch (err) {
      setError(err.message || "Status update nahi ho saka.");
    } finally {
      setBusyOrder(null);
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  if (!token) {
    return (
      <main className="admin-page">
        <section className="admin-login-card">
          <span className="admin-eyebrow">YASEENSHOP MANAGEMENT</span>
          <h1>Admin Login</h1>
          <p>Login karo taake customer orders manage kar sako.</p>

          <form onSubmit={handleLogin}>
            <label>
              Username
              <input
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button className="admin-primary-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          <button className="admin-back-btn" onClick={() => navigate("/")}>
            ← Back to shop
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-dashboard">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">YASEENSHOP MANAGEMENT</span>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {username}. Yahan se customer orders manage karo.</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-secondary-btn" onClick={() => loadOrders(token)}>
              Refresh
            </button>
            <button className="admin-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {error && <p className="admin-error" role="alert">{error}</p>}

        <section className="admin-stats">
          <article>
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </article>
          <article>
            <span>Pending orders</span>
            <strong>{orders.filter((order) => order.status === "Pending").length}</strong>
          </article>
          <article>
            <span>Total order value</span>
            <strong>{money(totalRevenue)}</strong>
          </article>
        </section>

        <section className="admin-orders-card">
          <div className="admin-orders-heading">
            <div>
              <h2>Customer Orders</h2>
              <p>Customer information aur delivery status.</p>
            </div>
            {loading && <span className="admin-loading">Loading...</span>}
          </div>

          {!loading && orders.length === 0 ? (
            <div className="admin-empty">
              <span>📦</span>
              <h3>Abhi koi order nahi</h3>
              <p>Customer ka order aane par yahan nazar aayega.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Delivery details</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                        <small>
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : ""}
                        </small>
                      </td>
                      <td>
                        <strong>{order.customer_name}</strong>
                        <small>{order.phone}</small>
                      </td>
                      <td>
                        <span>{order.address}</span>
                        <small>{order.city}</small>
                      </td>
                      <td><strong>{money(order.total)}</strong></td>
                      <td>
                        <span className={`admin-status status-${String(order.status).toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          aria-label={`Update order ${order.id} status`}
                          value={order.status}
                          disabled={busyOrder === order.id}
                          onChange={(event) => updateStatus(order.id, event.target.value)}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
