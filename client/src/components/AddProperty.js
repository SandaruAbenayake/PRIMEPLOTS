import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const API_BASE_URL = "http://localhost:5000/api/properties";

const AddProperty = () => {
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    image: "",
    contact: "",
  });

  const [properties, setProperties] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({}); // to store review inputs by property id

  // Fetch all properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleAddProperty = async () => {
    try {
      const response = await axios.post(API_BASE_URL, newProperty);
      console.log("Property added:", response.data);
      setProperties((prev) => [...prev, response.data]);
      setNewProperty({
        title: "",
        description: "",
        image: "",
        contact: "",
      });
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  const handleAddReview = async (propertyId) => {
    const review = reviewInputs[propertyId];
    if (!review || !review.user || !review.rating) {
      alert("Please enter your name and rating.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/${propertyId}/review`,
        review
      );
      setProperties((prev) =>
        prev.map((property) =>
          property._id === propertyId ? response.data : property
        )
      );
      setReviewInputs((prev) => ({
        ...prev,
        [propertyId]: { user: "", rating: "", comment: "" },
      }));
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/${propertyId}`);
      setProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2
        style={{
          color: "#007BFF",
          fontSize: "28px",
          fontWeight: "700",
          opacity: 1,
          marginBottom: "20px",
        }}
      >
        Add a New Property
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProperty();
        }}
        style={{ marginBottom: "40px" }}
      >
        <div className="form-row">
          <div className="form-group" style={{ flex: 1, marginRight: "10px" }}>
            <label className="animated-label">Title</label>
            <input
              type="text"
              className="animated-input"
              value={newProperty.title}
              onChange={(e) =>
                setNewProperty({ ...newProperty, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="animated-label">Description</label>
            <input
              type="text"
              className="animated-input"
              value={newProperty.description}
              onChange={(e) =>
                setNewProperty({ ...newProperty, description: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-row" style={{ marginTop: "15px" }}>
          <div className="form-group" style={{ flex: 1, marginRight: "10px" }}>
            <label className="animated-label">Image URL</label>
            <input
              type="text"
              className="animated-input"
              value={newProperty.image}
              onChange={(e) =>
                setNewProperty({ ...newProperty, image: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="animated-label">Contact</label>
            <input
              type="text"
              className="animated-input"
              value={newProperty.contact}
              onChange={(e) =>
                setNewProperty({ ...newProperty, contact: e.target.value })
              }
              required
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "20px",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "scale(1)";
          }}
        >
          Add Property
        </button>
      </form>

      {/* List all properties */}
      <h3 style={{ marginBottom: "20px" }}>Properties List</h3>
      {properties.length === 0 && <p>No properties found.</p>}
      {properties.map((property) => (
        <div
          key={property._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h4>{property.title}</h4>
          <p>{property.description}</p>
          <img
            src={property.image}
            alt={property.title}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <p>
            <strong>Contact:</strong> {property.contact}
          </p>

          <button
            onClick={() => handleDeleteProperty(property._id)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Delete Property
          </button>

          <h5>Reviews:</h5>
          {property.reviews.length === 0 && <p>No reviews yet.</p>}
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {property.reviews.map((review, index) => (
              <li
                key={index}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                }}
              >
                <strong>{review.user}</strong> - Rating: {review.rating}/5
                <br />
                {review.comment}
              </li>
            ))}
          </ul>

          {/* Add Review Form */}
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Your Name"
              value={reviewInputs[property._id]?.user || ""}
              onChange={(e) =>
                setReviewInputs((prev) => ({
                  ...prev,
                  [property._id]: {
                    ...prev[property._id],
                    user: e.target.value,
                  },
                }))
              }
              style={{ marginRight: "5px" }}
            />
            <input
              type="number"
              placeholder="Rating (1-5)"
              value={reviewInputs[property._id]?.rating || ""}
              onChange={(e) =>
                setReviewInputs((prev) => ({
                  ...prev,
                  [property._id]: {
                    ...prev[property._id],
                    rating: e.target.value,
                  },
                }))
              }
              style={{ marginRight: "5px" }}
              min="1"
              max="5"
            />
            <input
              type="text"
              placeholder="Comment"
              value={reviewInputs[property._id]?.comment || ""}
              onChange={(e) =>
                setReviewInputs((prev) => ({
                  ...prev,
                  [property._id]: {
                    ...prev[property._id],
                    comment: e.target.value,
                  },
                }))
              }
              style={{ marginRight: "5px" }}
            />
            <button
              onClick={() => handleAddReview(property._id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddProperty;
