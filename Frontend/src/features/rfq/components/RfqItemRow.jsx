import React from "react";

export default function RfqItemRow({ item, index, handleItemChange, removeItem }) {
  return (
    <div className="item-row">
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label>Product Name</label>
        <input
          type="text"
          placeholder="e.g. A4 Copy Paper"
          value={item.product_name}
          onChange={(e) => handleItemChange(index, "product_name", e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label>Item Specifications</label>
        <input
          type="text"
          placeholder="e.g. 80GSM, White"
          value={item.description}
          onChange={(e) => handleItemChange(index, "description", e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label>Quantity</label>
        <input
          type="number"
          placeholder="Qty"
          value={item.quantity}
          min="1"
          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label>Unit</label>
        <input
          type="text"
          placeholder="Unit (e.g. Boxes, Kg)"
          value={item.unit}
          onChange={(e) => handleItemChange(index, "unit", e.target.value)}
          required
        />
      </div>

      <button
        type="button"
        className="remove-item-btn"
        onClick={() => removeItem(index)}
        title="Remove Item"
      >
        &times;
      </button>
    </div>
  );
}
