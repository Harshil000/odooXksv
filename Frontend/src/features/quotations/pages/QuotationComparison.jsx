import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/quotation-comparison.scss";

const QuotationComparison = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);

  const quotations = [
    {
      id: 1,
      vendor: "Infra Supplies",
      total: 185000,
      gst: 18,
      deliveryDays: 10,
      rating: 4.5,
      paymentTerms: "30 Days",
      isLowest: true,
    },
    {
      id: 2,
      vendor: "TechCore Ltd",
      total: 200010,
      gst: 18,
      deliveryDays: 14,
      rating: 4.2,
      paymentTerms: "15 Days",
    },
    {
      id: 3,
      vendor: "Office Need Co",
      total: 214800,
      gst: 18,
      deliveryDays: 7,
      rating: 3.8,
      paymentTerms: "15 Days",
    },
  ];

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor.id);

    toast.success(
      `${vendor.vendor} selected. Approval workflow initiated.`
    );
  };

  return (
    <div className="quotation-comparison-page">
      <div className="page-header">
        <h1>Quotation Comparison</h1>
        <p>
          RFQ: Office Furniture Procurement Q2 • 3 Quotations Received
        </p>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Criteria</th>

              {quotations.map((quotation) => (
                <th
                  key={quotation.id}
                  className={quotation.isLowest ? "lowest-column" : ""}
                >
                  <div className="vendor-header">
                    {quotation.vendor}

                    {quotation.isLowest && (
                      <span className="winner-badge">
                        🏆 Lowest
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Grand Total</td>

              {quotations.map((quotation) => (
                <td
                  key={quotation.id}
                  className={quotation.isLowest ? "lowest-column" : ""}
                >
                  ₹{quotation.total.toLocaleString()}
                </td>
              ))}
            </tr>

            <tr>
              <td>GST %</td>

              {quotations.map((quotation) => (
                <td
                  key={quotation.id}
                  className={quotation.isLowest ? "lowest-column" : ""}
                >
                  {quotation.gst}%
                </td>
              ))}
            </tr>

            <tr>
              <td>Delivery Time</td>

              {quotations.map((quotation) => (
                <td
                  key={quotation.id}
                  className={quotation.isLowest ? "lowest-column" : ""}
                >
                  {quotation.deliveryDays} Days
                </td>
              ))}
            </tr>

            <tr>
              <td>Vendor Rating</td>

              {quotations.map((quotation) => (
                <td
                  key={quotation.id}
                  className={quotation.isLowest ? "lowest-column" : ""}
                >
                  ⭐ {quotation.rating}/5
                </td>
              ))}
            </tr>

            <tr>
              <td>Payment Terms</td>

              {quotations.map((quotation) => (
                <td
                  key={quotation.id}
                  className={quotation.isLowest ? "lowest-column" : ""}
                >
                  {quotation.paymentTerms}
                </td>
              ))}
            </tr>

            <tr>
              <td>Select Vendor</td>

              {quotations.map((quotation) => (
                <td
                  key={quotation.id}
                  className={quotation.isLowest ? "lowest-column" : ""}
                >
                  <button
                    className={`select-btn ${
                      selectedVendor === quotation.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectVendor(quotation)
                    }
                  >
                    {selectedVendor === quotation.id
                      ? "Selected"
                      : "Select & Approve"}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="comparison-note">
        Green highlighted quotation represents the most
        cost-effective vendor. Selecting a vendor initiates
        the approval workflow.
      </div>
    </div>
  );
};

export default QuotationComparison;