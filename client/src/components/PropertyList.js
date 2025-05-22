import React from "react";

const PropertyList = ({ properties }) => {
  return (
    <div>
      <h2 className="animated-heading">Property List</h2>

      <ul>
        {properties.map((property) => (
          <li key={property._id}>
            <h3>{property.title}</h3>
            <p>{property.description}</p>
            <img src={property.image} alt={property.title} width="150" />
            <p>Contact: {property.contact}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
