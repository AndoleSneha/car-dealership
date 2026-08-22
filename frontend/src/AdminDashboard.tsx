import { useEffect, useState } from "react";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  category: string;
  quantity: number;
}

interface AdminDashboardProps {
  token: string;
  onBack: () => void;
}

function AdminDashboard({
  token,
  onBack,
}: AdminDashboardProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://car-dealership-backend-wd20.onrender.com/api/vehicles"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load vehicles"
        );
        return;
      }

      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ---------------------------------------
  // ADD VEHICLE
  // ---------------------------------------

  const addVehicle = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "https://car-dealership-backend-wd20.onrender.com/api/vehicles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            make,
            model,
            year: Number(year),
            price: Number(price),
            category,
            quantity: Number(quantity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to add vehicle"
        );
        return;
      }

      setMessage("Vehicle added successfully!");

      setMake("");
      setModel("");
      setYear("");
      setPrice("");
      setCategory("");
      setQuantity("");

      setShowAddForm(false);

      fetchVehicles();
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  // ---------------------------------------
  // DELETE VEHICLE
  // ---------------------------------------

  const deleteVehicle = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://car-dealership-backend-wd20.onrender.com/api/vehicles/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Delete failed"
        );
        return;
      }

      setMessage(
        "Vehicle deleted successfully"
      );

      fetchVehicles();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete vehicle");
    }
  };

  // ---------------------------------------
  // RESTOCK VEHICLE
  // ---------------------------------------

  const restockVehicle = async (id: string) => {
    try {
      const response = await fetch(
        `https://car-dealership-backend-wd20.onrender.com/api/vehicles/${id}/restock`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: 5,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Restock failed"
        );
        return;
      }

      setMessage(
        "Vehicle restocked successfully"
      );

      fetchVehicles();
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to restock vehicle"
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Manage dealership inventory
          </p>
        </div>

        <button
          className="back-button"
          onClick={onBack}
        >
          Back to Vehicles
        </button>

      </div>

      {/* MESSAGE */}

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      {/* ADD VEHICLE BUTTON */}

      <div className="admin-top-actions">

        <button
          className="add-vehicle-button"
          onClick={() =>
            setShowAddForm(!showAddForm)
          }
        >
          {showAddForm
            ? "Cancel"
            : "+ Add Vehicle"}
        </button>

      </div>

      {/* ADD VEHICLE FORM */}

      {showAddForm && (
        <div className="add-vehicle-form">

          <h2>Add New Vehicle</h2>

          <form onSubmit={addVehicle}>

            <div className="form-row">

              <div className="admin-form-group">
                <label>Make</label>

                <input
                  type="text"
                  value={make}
                  onChange={(e) =>
                    setMake(e.target.value)
                  }
                  placeholder="Toyota"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Model</label>

                <input
                  type="text"
                  value={model}
                  onChange={(e) =>
                    setModel(e.target.value)
                  }
                  placeholder="Camry"
                  required
                />
              </div>

            </div>

            <div className="form-row">

              <div className="admin-form-group">
                <label>Year</label>

                <input
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value)
                  }
                  placeholder="2025"
                  min="1900"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Price</label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  placeholder="2500000"
                  min="0"
                  required
                />
              </div>

            </div>

            <div className="form-row">

              <div className="admin-form-group">
                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Sedan">
                    Sedan
                  </option>

                  <option value="SUV">
                    SUV
                  </option>

                  <option value="Hatchback">
                    Hatchback
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Luxury">
                    Luxury
                  </option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  placeholder="5"
                  min="0"
                  required
                />
              </div>

            </div>

            <button
              className="save-vehicle-button"
              type="submit"
            >
              Add Vehicle
            </button>

          </form>
        </div>
      )}

      {/* VEHICLE INVENTORY */}

      <h2 className="inventory-title">
        Vehicle Inventory
      </h2>

      <div className="admin-grid">

        {vehicles.map((vehicle) => (

          <div
            className="admin-card"
            key={vehicle._id}
          >

            <div className="admin-card-icon">
              🚗
            </div>

            <h2>
              {vehicle.make}{" "}
              {vehicle.model}
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
              <strong>Price:</strong>{" "}
              ₹
              {vehicle.price.toLocaleString(
                "en-IN"
              )}
            </p>

            <p>
              <strong>Quantity:</strong>{" "}
              {vehicle.quantity}
            </p>

            <div className="admin-actions">

              <button
                className="restock-button"
                onClick={() =>
                  restockVehicle(
                    vehicle._id
                  )
                }
              >
                Restock +5
              </button>

              <button
                className="delete-button"
                onClick={() =>
                  deleteVehicle(
                    vehicle._id
                  )
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminDashboard;