import { useEffect, useState } from "react";
import "./App.css";
import AdminDashboard from "./AdminDashboard";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  quantity: number;
}

interface User {
  role: "user" | "admin";
}

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showAdmin, setShowAdmin] = useState(false);

  const [showRegister, setShowRegister] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [authLoading, setAuthLoading] = useState(false);

  /* =========================================
     READ USER FROM TOKEN
  ========================================= */

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const parts = token.split(".");

      if (parts.length !== 3) {
        throw new Error("Invalid token");
      }

      const base64 = parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const padded =
        base64 +
        "=".repeat((4 - (base64.length % 4)) % 4);

      const payload = JSON.parse(atob(padded));

      console.log("JWT payload:", payload);

      setUser({
        role: payload.role === "admin" ? "admin" : "user",
      });
    } catch (err) {
      console.error("Token error:", err);

      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, [token]);

  /* =========================================
     LOGIN
  ========================================= */

  const handleLogin = async () => {
    try {
      setError("");
      setMessage("");

      if (!loginEmail || !loginPassword) {
        setError("Email and password are required");
        return;
      }

      setAuthLoading(true);

      const response = await fetch(
        "https://car-dealership-backend-wd20.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setLoginPassword("");
      setMessage("Login successful!");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server");
    } finally {
      setAuthLoading(false);
    }
  };

  /* =========================================
     REGISTER
  ========================================= */

  const handleRegister = async () => {
    try {
      setError("");
      setMessage("");

      if (
        !registerName ||
        !registerEmail ||
        !registerPassword
      ) {
        setError("All fields are required");
        return;
      }

      setAuthLoading(true);

      const response = await fetch(
        "https://car-dealership-backend-wd20.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");

      setShowRegister(false);
      setLoginEmail(registerEmail);

      setMessage(
        "Registration successful! Please login."
      );
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server");
    } finally {
      setAuthLoading(false);
    }
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();

    setToken(null);
    setUser(null);
    setShowAdmin(false);

    setVehicles([]);

    setSearch("");
    setCategory("All");
    setMaxPrice("");

    setMessage("");
    setError("");
  };

  /* =========================================
     LOAD VEHICLES
  ========================================= */

  const loadVehicles = async () => {
    try {
      setError("");

      const response = await fetch(
        "https://car-dealership-backend-wd20.onrender.com/api/vehicles"
      );

      if (!response.ok) {
        throw new Error("Unable to load vehicles");
      }

      const data = await response.json();

      setVehicles(data.vehicles || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load vehicles");
    }
  };

  useEffect(() => {
    if (token) {
      loadVehicles();
    }
  }, [token]);

  /* =========================================
     PURCHASE
  ========================================= */

  const handlePurchase = async (id: string) => {
    try {
      setMessage("");
      setError("");

      const currentToken =
        localStorage.getItem("token");

      if (!currentToken) {
        setError("Please login first");
        return;
      }

      const response = await fetch(
        `https://car-dealership-backend-wd20.onrender.com/api/vehicles/${id}/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Purchase failed"
        );
        return;
      }

      setMessage(
        "Vehicle purchased successfully!"
      );

      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) =>
          vehicle._id === id
            ? {
                ...vehicle,
                quantity: data.vehicle.quantity,
              }
            : vehicle
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the server"
      );
    }
  };

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = [
    "All",
    ...Array.from(
      new Set(
        vehicles.map(
          (vehicle) => vehicle.category
        )
      )
    ),
  ];

  /* =========================================
     FILTER
  ========================================= */

  const filteredVehicles = vehicles.filter(
    (vehicle) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        vehicle.make
          .toLowerCase()
          .includes(searchText) ||
        vehicle.model
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        vehicle.category === category;

      const priceLimit = Number(maxPrice);

      const matchesPrice =
        maxPrice.trim() === "" ||
        (
          Number.isFinite(priceLimit) &&
          vehicle.price <= priceLimit
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    }
  );

  /* =========================================
     LOGIN PAGE
  ========================================= */

  if (!token) {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-logo">
            🚗
          </div>

          <h1>Car Dealership</h1>

          {!showRegister ? (
            <>
              <h2>Welcome Back</h2>

              <p className="login-subtitle">
                Login to continue
              </p>

              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="login-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={loginEmail}
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setLoginEmail(e.target.value)
                  }
                />
              </div>

              <div className="login-form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={loginPassword}
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setLoginPassword(e.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="login-button"
                onClick={handleLogin}
                disabled={authLoading}
              >
                {authLoading
                  ? "Logging in..."
                  : "Login"}
              </button>

              <p className="auth-switch">
                Don't have an account?

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(true);
                    setError("");
                    setMessage("");
                  }}
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Create Account</h2>

              <p className="login-subtitle">
                Register to continue
              </p>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="login-form-group">
                <label>Name</label>

                <input
                  type="text"
                  value={registerName}
                  placeholder="Enter your name"
                  onChange={(e) =>
                    setRegisterName(e.target.value)
                  }
                />
              </div>

              <div className="login-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={registerEmail}
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setRegisterEmail(e.target.value)
                  }
                />
              </div>

              <div className="login-form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={registerPassword}
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setRegisterPassword(e.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="login-button"
                onClick={handleRegister}
                disabled={authLoading}
              >
                {authLoading
                  ? "Registering..."
                  : "Register"}
              </button>

              <p className="auth-switch">
                Already have an account?

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError("");
                    setMessage("");
                  }}
                >
                  Login
                </button>
              </p>
            </>
          )}

        </div>

      </div>
    );
  }

  /* =========================================
     ADMIN DASHBOARD
  ========================================= */

  if (
    showAdmin &&
    user?.role === "admin"
  ) {
    return (
      <AdminDashboard
        token={token}
        onBack={() => setShowAdmin(false)}
      />
    );
  }

  /* =========================================
     VEHICLE PAGE
  ========================================= */

  return (
    <div className="app">

      <nav className="navbar">

        <h1>Car Dealership</h1>

        <div className="navbar-actions">

          {user?.role === "admin" && (
            <button
              type="button"
              className="admin-nav-button"
              onClick={() =>
                setShowAdmin(true)
              }
            >
              Admin Dashboard
            </button>
          )}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      <main className="container">

        <div className="page-heading">

          <div>
            <h2>
              Available Vehicles
            </h2>

            <p>
              Find your perfect vehicle
            </p>
          </div>

        </div>

        {/* FILTERS */}

        <div className="filter-box">

          <div className="filter-group">

            <label>
              Search
            </label>

            <input
              type="text"
              placeholder="Search by make or model..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="filter-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>

          <div className="filter-group">

            <label>
              Maximum Price
            </label>

            <input
              type="number"
              min="0"
              placeholder="Enter maximum price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value)
              }
            />

          </div>

          <button
            type="button"
            className="clear-button"
            onClick={() => {
              setSearch("");
              setCategory("All");
              setMaxPrice("");
            }}
          >
            Clear Filters
          </button>

        </div>

        {/* MESSAGES */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* VEHICLES */}

        {filteredVehicles.length === 0 &&
        !error ? (

          <div className="no-results">

            <h3>
              No vehicles found
            </h3>

            <p>
              Try changing your search
              or filters.
            </p>

          </div>

        ) : (

          <div className="vehicle-grid">

            {filteredVehicles.map(
              (vehicle) => (

                <div
                  className="vehicle-card"
                  key={vehicle._id}
                >

                  <div className="vehicle-icon">
                    🚗
                  </div>

                  <h3>
                    {vehicle.make}{" "}
                    {vehicle.model}
                  </h3>

                  <div className="vehicle-details">

                    <p>
                      <strong>
                        Year:
                      </strong>{" "}
                      {vehicle.year}
                    </p>

                    <p>
                      <strong>
                        Category:
                      </strong>{" "}
                      {vehicle.category}
                    </p>

                    <p className="vehicle-price">
                      ₹
                      {vehicle.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p>
                      <strong>
                        Available:
                      </strong>{" "}

                      <span
                        className={
                          vehicle.quantity === 0
                            ? "out-stock"
                            : vehicle.quantity <= 2
                            ? "low-stock"
                            : "in-stock"
                        }
                      >
                        {vehicle.quantity}
                      </span>
                    </p>

                  </div>

                  <button
                    type="button"
                    className="purchase-button"
                    disabled={
                      vehicle.quantity === 0
                    }
                    onClick={() =>
                      handlePurchase(
                        vehicle._id
                      )
                    }
                  >
                    {vehicle.quantity === 0
                      ? "Out of Stock"
                      : "Purchase"}
                  </button>

                </div>
              )
            )}

          </div>
        )}

        <p className="result-count">
          Showing{" "}
          {filteredVehicles.length} of{" "}
          {vehicles.length} vehicles
        </p>

      </main>

    </div>
  );
}

export default App;