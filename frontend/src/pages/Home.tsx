import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  category: string;
  quantity: number;
  imageUrl: string;
}

const API_URL =
  "https://car-dealership-backend-wd20.onrender.com";

const Home = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVehicles();
    fetchFavorites();
  }, []);

  // ========================================
  // GET VEHICLES
  // ========================================

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/vehicles`
      );

      console.log(
        "HOME VEHICLES:",
        response.data.vehicles
      );

      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error(
        "Vehicle loading error:",
        error
      );

      setMessage("Unable to load vehicles");
    }
  };

  // ========================================
  // GET FAVORITES
  // ========================================

  const fetchFavorites = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ids = response.data
        .filter(
          (favorite: any) =>
            favorite.vehicle
        )
        .map(
          (favorite: { vehicle: Vehicle }) =>
            favorite.vehicle._id
        );

      setFavoriteIds(ids);
    } catch (error) {
      console.error(
        "Unable to load favorites:",
        error
      );
    }
  };

  // ========================================
  // ADD / REMOVE FAVORITE
  // ========================================

  const toggleFavorite = async (
    vehicleId: string
  ) => {
    if (!token) {
      navigate("/login");
      return;
    }

    const isFavorite =
      favoriteIds.includes(vehicleId);

    try {
      if (isFavorite) {
        await axios.delete(
          `${API_URL}/api/favorites/${vehicleId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setFavoriteIds((prev) =>
          prev.filter(
            (id) => id !== vehicleId
          )
        );
      } else {
        await axios.post(
          `${API_URL}/api/favorites/${vehicleId}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setFavoriteIds((prev) => [
          ...prev,
          vehicleId,
        ]);
      }
    } catch (error) {
      console.error(
        "Favorite error:",
        error
      );

      setMessage(
        "Unable to update favorite"
      );
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <h1>Car Dealership</h1>

        <div className="navbar-actions">

          <button
            type="button"
            className="admin-nav-button"
            onClick={() =>
              navigate("/favorites")
            }
          >
            ❤️ Favorites
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="container">

        <div className="page-heading">

          <h2>
            Available Vehicles
          </h2>

          <p>
            Find your perfect vehicle
            from our collection.
          </p>

        </div>

        {/* ERROR MESSAGE */}

        {message && (
          <p className="error-message">
            {message}
          </p>
        )}

        {/* ================= VEHICLES ================= */}

        <div className="vehicle-grid">

          {vehicles.map((vehicle) => {

            const isFavorite =
              favoriteIds.includes(
                vehicle._id
              );

            return (

              <div
                className="vehicle-card"
                key={vehicle._id}
              >

                {/* ================= IMAGE ================= */}

                <div className="vehicle-card-top">

                  <div className="vehicle-image-container">

                    {vehicle.imageUrl ? (

                      <img
                        src={vehicle.imageUrl}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="vehicle-image"
                        onLoad={() => {
                          console.log(
                            "IMAGE LOADED:",
                            vehicle.imageUrl
                          );
                        }}
                        onError={(e) => {
                          console.error(
                            "IMAGE FAILED:",
                            vehicle.imageUrl
                          );

                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            e.currentTarget
                              .parentElement
                              ?.querySelector(
                                ".vehicle-fallback"
                              );

                          if (fallback) {
                            (
                              fallback as HTMLElement
                            ).style.display =
                              "flex";
                          }
                        }}
                      />

                    ) : null}

                    {/* FALLBACK */}

                    <div
                      className="vehicle-fallback"
                      style={{
                        display:
                          vehicle.imageUrl
                            ? "none"
                            : "flex",
                      }}
                    >
                      🚗
                    </div>

                  </div>

                  {/* ================= FAVORITE ================= */}

                  <button
                    type="button"
                    className={`favorite-button ${
                      isFavorite
                        ? "favorite-active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleFavorite(
                        vehicle._id
                      )
                    }
                    title={
                      isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {isFavorite
                      ? "❤️"
                      : "♡"}
                  </button>

                </div>

                {/* ================= NAME ================= */}

                <h3>
                  {vehicle.make}{" "}
                  {vehicle.model}
                </h3>

                {/* ================= DETAILS ================= */}

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
                      Quantity:
                    </strong>{" "}

                    <span
                      className={
                        vehicle.quantity === 0
                          ? "out-stock"
                          : vehicle.quantity <= 3
                          ? "low-stock"
                          : "in-stock"
                      }
                    >
                      {vehicle.quantity}
                    </span>

                  </p>

                </div>

                {/* ================= PURCHASE ================= */}

                <button
                  type="button"
                  className="purchase-button"
                  disabled={
                    vehicle.quantity === 0
                  }
                >
                  {vehicle.quantity === 0
                    ? "Out of Stock"
                    : "Purchase"}
                </button>

              </div>
            );
          })}

        </div>

      </main>

    </div>
  );
};

export default Home;