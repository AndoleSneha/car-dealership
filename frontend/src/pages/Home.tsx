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
}

const Home = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        "https://car-dealership-backend-wd20.onrender.com/api/vehicles"
      );

      setVehicles(response.data.vehicles);
    } catch (error) {
      setMessage("Unable to load vehicles");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <h2>Car Dealership</h2>

        <div>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="home-container">
        <h1>Available Vehicles</h1>

        {message && <p>{message}</p>}

        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <div
              className="vehicle-card"
              key={vehicle._id}
            >
              <h2>
                {vehicle.make} {vehicle.model}
              </h2>

              <p>
                <strong>Year:</strong>{" "}
                {vehicle.year}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {vehicle.category}
              </p>

              <p>
                <strong>Price:</strong> ₹
                {vehicle.price}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {vehicle.quantity}
              </p>

              <button>
                Purchase
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;