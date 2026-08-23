import { useEffect, useState } from "react";
import axios from "axios";

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

interface Favorite {
  _id: string;
  vehicle: Vehicle;
}

interface FavoritesProps {
  onBack: () => void;
}

const API_URL =
  "https://car-dealership-backend-wd20.onrender.com";

const Favorites = ({
  onBack,
}: FavoritesProps) => {

  const [favorites, setFavorites] =
    useState<Favorite[]>([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {

    if (!token) {
      setMessage("Please login first");
      setLoading(false);
      return;
    }

    try {

      const response = await axios.get(
        `${API_URL}/api/favorites`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const validFavorites =
        response.data.filter(
          (favorite: Favorite) =>
            favorite.vehicle
        );

      setFavorites(validFavorites);

    } catch (error) {

      console.error(
        "Favorites error:",
        error
      );

      setMessage(
        "Unable to load favorites"
      );

    } finally {

      setLoading(false);

    }
  };

  const removeFavorite = async (
    vehicleId: string
  ) => {

    if (!token) return;

    try {

      await axios.delete(
        `${API_URL}/api/favorites/${vehicleId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setFavorites(
        (currentFavorites) =>
          currentFavorites.filter(
            (favorite) =>
              favorite.vehicle._id !==
              vehicleId
          )
      );

    } catch (error) {

      console.error(
        "Remove favorite error:",
        error
      );

      setMessage(
        "Unable to remove favorite"
      );
    }
  };

  if (loading) {

    return (
      <div className="app">

        <nav className="navbar">
          <h1>Car Dealership</h1>
        </nav>

        <main className="container">
          <p>Loading favorites...</p>
        </main>

      </div>
    );
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">

        <h1>Car Dealership</h1>

        <div className="navbar-actions">

          <button
            type="button"
            className="admin-nav-button"
            onClick={onBack}
          >
            🏠 Home
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              window.location.reload();

            }}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* MAIN */}
      <main className="container">

        <div className="page-heading">

          <h2>❤️ My Favorites</h2>

          <p>
            Vehicles you have saved for later.
          </p>

        </div>

        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        {/* EMPTY STATE */}

        {favorites.length === 0 ? (

          <div className="no-results">

            <h3>
              No favorites yet ❤️
            </h3>

            <p>
              You haven't added any
              vehicles to your favorites.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={onBack}
            >
              Browse Vehicles
            </button>

          </div>

        ) : (

          /* FAVORITES */

          <div className="vehicle-grid">

            {favorites.map(
              (favorite) => {

                const vehicle =
                  favorite.vehicle;

                return (

                  <div
                    className="vehicle-card"
                    key={favorite._id}
                  >

                    {/* IMAGE */}
                    <div className="vehicle-card-top">

                      <div className="vehicle-image-container">

                        {vehicle.imageUrl ? (

                          <img
                            src={
                              vehicle.imageUrl
                            }
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="vehicle-image"
                            onError={(e) => {

                              e.currentTarget.style.display =
                                "none";

                              const parent =
                                e.currentTarget
                                  .parentElement;

                              if (parent) {
                                parent.innerHTML =
                                  `<div class="vehicle-fallback">🚗</div>`;
                              }

                            }}
                          />

                        ) : (

                          <div className="vehicle-fallback">
                            🚗
                          </div>

                        )}

                      </div>

                      {/* REMOVE FAVORITE */}
                      <button
                        type="button"
                        className="favorite-button favorite-active"
                        onClick={() =>
                          removeFavorite(
                            vehicle._id
                          )
                        }
                        title="Remove from favorites"
                      >
                        ❤️
                      </button>

                    </div>

                    {/* NAME */}
                    <h3>
                      {vehicle.make}{" "}
                      {vehicle.model}
                    </h3>

                    {/* DETAILS */}
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
                              : vehicle.quantity <= 3
                              ? "low-stock"
                              : "in-stock"
                          }
                        >
                          {vehicle.quantity}
                        </span>

                      </p>

                    </div>

                    {/* PURCHASE */}
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
              }
            )}

          </div>

        )}

      </main>

    </div>
  );
};

export default Favorites;