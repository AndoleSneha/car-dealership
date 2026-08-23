import { useEffect, useState } from "react";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
}

interface AdminDashboardProps {
  token: string;
  onBack: () => void;
}

const API_URL =
  "https://car-dealership-backend-wd20.onrender.com";

function AdminDashboard({
  token,
  onBack,
}: AdminDashboardProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Add form
  const [showAddForm, setShowAddForm] =
    useState(false);

  // Edit mode
  const [editingId, setEditingId] =
    useState<string | null>(null);

  // Form fields
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ========================================
  // FETCH VEHICLES
  // ========================================

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/vehicles`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load vehicles"
        );
        return;
      }

      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error(
        "Fetch vehicles error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ========================================
  // CLEAR FORM
  // ========================================

  const clearForm = () => {
    setMake("");
    setModel("");
    setYear("");
    setPrice("");
    setCategory("");
    setQuantity("");
    setImageUrl("");
    setEditingId(null);
  };

  // ========================================
  // ADD VEHICLE
  // ========================================

  const addVehicle = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/vehicles`,
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
            imageUrl,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "ADD VEHICLE RESPONSE:",
        data
      );

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to add vehicle"
        );
        return;
      }

      if (data.vehicle) {
        setVehicles(
          (currentVehicles) => [
            data.vehicle,
            ...currentVehicles,
          ]
        );
      }

      setMessage(
        "Vehicle added successfully!"
      );

      clearForm();
      setShowAddForm(false);
    } catch (error) {
      console.error(
        "Add vehicle error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  // ========================================
  // START EDIT
  // ========================================

  const startEdit = (
    vehicle: Vehicle
  ) => {
    setEditingId(vehicle._id);

    setMake(vehicle.make);
    setModel(vehicle.model);
    setYear(String(vehicle.year));
    setPrice(String(vehicle.price));
    setCategory(vehicle.category);
    setQuantity(String(vehicle.quantity));
    setImageUrl(vehicle.imageUrl || "");

    setShowAddForm(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // UPDATE VEHICLE
  // ========================================

  const updateVehicle = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (!editingId) return;

  setMessage("");

  try {
    const response = await fetch(
      `${API_URL}/api/vehicles/${editingId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          make: make.trim(),
          model: model.trim(),
          year: Number(year),
          price: Number(price),
          category: category.trim(),
          quantity: Number(quantity),
          imageUrl: imageUrl.trim(),
        }),
      }
    );

    const data = await response.json();

    console.log(
      "UPDATE VEHICLE RESPONSE:",
      data
    );

    if (!response.ok) {
      setMessage(
        data.message ||
          "Unable to update vehicle"
      );
      return;
    }

    console.log(
      "Vehicle updated in database:",
      data.vehicle
    );

    // IMPORTANT:
    // Fetch fresh data from MongoDB
    await fetchVehicles();

    setMessage(
      "Vehicle updated successfully!"
    );

    // Clear edit mode
    clearForm();

  } catch (error) {
    console.error(
      "Update vehicle error:",
      error
    );

    setMessage(
      "Unable to update vehicle"
    );
  }
};

  // ========================================
  // DELETE VEHICLE
  // ========================================

  const deleteVehicle = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this vehicle?"
      );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/vehicles/${id}`,
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
          data.message ||
            "Delete failed"
        );
        return;
      }

      setVehicles(
        (currentVehicles) =>
          currentVehicles.filter(
            (vehicle) =>
              vehicle._id !== id
          )
      );

      setMessage(
        "Vehicle deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete vehicle error:",
        error
      );

      setMessage(
        "Unable to delete vehicle"
      );
    }
  };

  // ========================================
  // RESTOCK VEHICLE
  // ========================================

  const restockVehicle = async (
    id: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/vehicles/${id}/restock`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            quantity: 5,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Restock failed"
        );
        return;
      }

      if (data.vehicle) {
        setVehicles(
          (currentVehicles) =>
            currentVehicles.map(
              (vehicle) =>
                vehicle._id === id
                  ? data.vehicle
                  : vehicle
            )
        );
      }

      setMessage(
        "Vehicle restocked successfully"
      );
    } catch (error) {
      console.error(
        "Restock error:",
        error
      );

      setMessage(
        "Unable to restock vehicle"
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="admin-container">
        <p>
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="admin-container">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <h1>
            Admin Dashboard
          </h1>

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

      {/* TOP ACTION */}

      <div className="admin-top-actions">

        <button
          className="add-vehicle-button"
          onClick={() => {
            clearForm();

            setShowAddForm(
              !showAddForm
            );
          }}
        >
          {showAddForm
            ? "Cancel"
            : "+ Add Vehicle"}
        </button>

        {editingId && (
          <button
            className="back-button"
            onClick={() => {
              clearForm();
            }}
          >
            Cancel Edit
          </button>
        )}

      </div>

      {/* FORM */}

      {(showAddForm || editingId) && (
        <div className="add-vehicle-form">

          <h2>
            {editingId
              ? "Edit Vehicle"
              : "Add New Vehicle"}
          </h2>

          <form
            onSubmit={
              editingId
                ? updateVehicle
                : addVehicle
            }
          >

            {/* MAKE + MODEL */}

            <div className="form-row">

              <div className="admin-form-group">

                <label>
                  Make
                </label>

                <input
                  type="text"
                  value={make}
                  onChange={(e) =>
                    setMake(
                      e.target.value
                    )
                  }
                  placeholder="Toyota"
                  required
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Model
                </label>

                <input
                  type="text"
                  value={model}
                  onChange={(e) =>
                    setModel(
                      e.target.value
                    )
                  }
                  placeholder="Camry"
                  required
                />

              </div>

            </div>

            {/* YEAR + PRICE */}

            <div className="form-row">

              <div className="admin-form-group">

                <label>
                  Year
                </label>

                <input
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(
                      e.target.value
                    )
                  }
                  placeholder="2025"
                  min="1900"
                  required
                />

              </div>

              <div className="admin-form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  placeholder="2500000"
                  min="0"
                  required
                />

              </div>

            </div>

            {/* CATEGORY + QUANTITY */}

            <div className="form-row">

              <div className="admin-form-group">

                <label>
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
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

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  placeholder="5"
                  min="0"
                  required
                />

              </div>

            </div>

            {/* IMAGE URL */}

            <div className="admin-form-group">

              <label>
                Vehicle Image URL
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) =>
                  setImageUrl(
                    e.target.value
                  )
                }
                placeholder="https://example.com/car.jpg"
                required
              />

              <small>
                Paste a direct URL of
                the vehicle image.
              </small>

            </div>

            {/* IMAGE PREVIEW */}

            {imageUrl && (
              <div className="image-preview">

                <p>
                  Image Preview
                </p>

                <img
                  src={imageUrl}
                  alt="Vehicle preview"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display =
                      "block";
                  }}
                />

              </div>
            )}

            {/* SAVE */}

            <button
              className="save-vehicle-button"
              type="submit"
            >
              {editingId
                ? "Save Changes"
                : "Add Vehicle"}
            </button>

          </form>

        </div>
      )}

      {/* INVENTORY */}

      <h2 className="inventory-title">
        Vehicle Inventory
      </h2>

      <div className="admin-grid">

        {vehicles.length === 0 ? (

          <div className="no-results">

            <h3>
              No vehicles found
            </h3>

            <p>
              Add your first vehicle
              using the button above.
            </p>

          </div>

        ) : (

          vehicles.map(
            (vehicle) => (

              <div
                className="admin-card"
                key={vehicle._id}
              >

                {/* IMAGE */}

                <div className="admin-card-image">

                  {vehicle.imageUrl ? (

                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="admin-card-icon">
                      🚗
                    </div>

                  )}

                </div>

                {/* INFO */}

                <h2>
                  {vehicle.make}{" "}
                  {vehicle.model}
                </h2>

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

                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  ₹
                  {vehicle.price.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p>
                  <strong>
                    Quantity:
                  </strong>{" "}
                  {vehicle.quantity}
                </p>

                {/* ACTIONS */}

                <div className="admin-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      startEdit(
                        vehicle
                      )
                    }
                  >
                    ✏️ Edit
                  </button>

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

            )
          )

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;