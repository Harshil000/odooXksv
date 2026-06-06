import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../auth/hook/useAuth";
import useRfq from "../hook/useRfq";
import { formatDate } from "../utils/rfq.utils";
import { toast } from "react-toastify";
import "../styles/rfq.scss";

const Rfq = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { rfqs, loading, loadRfqs } = useRfq();

  useEffect(() => {
    loadRfqs().catch((err) => {
      toast.error(err.message || "Failed to load RFQs");
    });
  }, [loadRfqs]);

  const handleRowClick = (rfqId) => {
    navigate(`/rfq/${rfqId}`);
  };

  const isVendor = user?.role === "VENDOR";

  return (
    <div className="rfq-container">
      {/* RFQ Header Bar */}
      <div className="rfq-header-bar">
        <div className="rfq-title-area">
          <h1 className="rfq-title">Requests For Quotation (RFQ)</h1>
          <p className="rfq-subtitle">
            {isVendor
              ? "Available requests seeking your quotation"
              : "Manage and publish requests for vendor quotation"}
          </p>
        </div>

        {/* Hide Create RFQ button from vendors */}
        {!isVendor && (
          <button
            className="action-btn"
            onClick={() => navigate("/rfq/create")}
          >
            + Create RFQ
          </button>
        )}
      </div>

      {/* RFQ Listing Card */}
      <div className="rfq-card-list">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#7a7f9a" }}>
            Loading RFQs...
          </div>
        ) : rfqs.length === 0 ? (
          <div className="rfq-empty-state">
            <span className="empty-icon">📋</span>
            <h3 className="empty-title">No RFQs Found</h3>
            <p className="empty-desc">
              {isVendor
                ? "No RFQs have been assigned to you yet."
                : "Get started by creating your first Request for Quotation."}
            </p>
            {!isVendor && (
              <button
                className="action-btn"
                onClick={() => navigate("/rfq/create")}
              >
                Create RFQ
              </button>
            )}
          </div>
        ) : (
          <div className="nm-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>RFQ Number</th>
                  <th>Title</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    onClick={() => handleRowClick(rfq.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <span className="rfq-num-tag">{rfq.rfq_number}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{rfq.title}</td>
                    <td>{formatDate(rfq.deadline)}</td>
                    <td>
                      <span className={`status-pill ${rfq.status.toLowerCase()}`}>
                        {rfq.status}
                      </span>
                    </td>
                    <td>{rfq.creator_name}</td>
                    <td>{formatDate(rfq.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rfq;