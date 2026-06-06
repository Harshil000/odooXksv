import { useState, useEffect } from "react";
import useAuth from "../../auth/hook/useAuth";
import useApproval from "../hook/useApproval";
import "../../../styles/approvals.scss";

const formatAmount = (amount) => {
  return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
};

export default function Approvals() {
  const { user } = useAuth();
  const {
    quotations,
    selectedQuote,
    approvalHistory,
    negThread,
    loading,
    error,
    successMsg,
    fetchPending,
    loadQuoteContext,
    approveQuotation,
    rejectQuotation,
    sendNegotiation,
  } = useApproval();

  // Form states
  const [remarks, setRemarks] = useState("");
  const [negMessage, setNegMessage] = useState("");
  const [negProposedAmount, setNegProposedAmount] = useState("");
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    fetchPending().then((pending) => {
      if (pending && pending.length > 0) {
        loadQuoteContext(pending[0]);
      }
    });
  }, [fetchPending, loadQuoteContext]);

  const handleSelectQuote = (quote) => {
    setRemarks("");
    setNegMessage("");
    setNegProposedAmount("");
    loadQuoteContext(quote);
  };

  const handleApprove = async () => {
    if (!selectedQuote) return;
    try {
      setActioning(true);
      await approveQuotation(selectedQuote.id, remarks);
      setRemarks("");
      setTimeout(() => {
        fetchPending();
      }, 2000);
    } catch (err) {
      // Handled in hook error state
    } finally {
      setActioning(false);
    }
  };

  const handleReject = async () => {
    if (!selectedQuote) return;
    try {
      setActioning(true);
      await rejectQuotation(selectedQuote.id, remarks);
      setRemarks("");
      setTimeout(() => {
        fetchPending();
      }, 1500);
    } catch (err) {
      // Handled in hook error state
    } finally {
      setActioning(false);
    }
  };

  const handleSendNegotiation = async (e) => {
    e.preventDefault();
    if (!selectedQuote) return;
    if (!negMessage.trim()) return;

    try {
      setActioning(true);
      await sendNegotiation(selectedQuote.id, negMessage, negProposedAmount);
      setNegMessage("");
      setNegProposedAmount("");
    } catch (err) {
      // Handled in hook error state
    } finally {
      setActioning(false);
    }
  };

  if (loading && quotations.length === 0) {
    return (
      <div className="approvals-container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <div className="loader" style={{
            width: "40px",
            height: "40px",
            border: "4px solid #c8cad4",
            borderTop: "4px solid #5b6af0",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="approvals-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Quotations Approval & Negotiation</h1>
        <p className="dashboard-subtitle">
          Review vendor quotations, negotiate unit prices and approve orders in real-time
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{
          background: "#fee2e2",
          color: "#b91c1c",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: 600,
          border: "1px solid #fca5a5"
        }}>
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{
          background: "#ecfdf5",
          color: "#047857",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: 600,
          border: "1px solid #6ee7b7"
        }}>
          ✓ {successMsg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "start" }}>

        {/* Left column: Pending list */}
        <div className="table-card" style={{ padding: "16px" }}>
          <div className="card-title" style={{ fontSize: "1rem", marginBottom: "12px" }}>Pending Quotes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {quotations.map((q) => {
              const isActive = selectedQuote?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuote(q)}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isActive ? "#e0e7ff" : "#eef0f5",
                    borderLeft: isActive ? "4px solid #5b6af0" : "4px solid transparent",
                    boxShadow: isActive
                      ? "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff"
                      : "3px 3px 6px #c8cad4, -3px -3px 6px #ffffff"
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#3a3d52" }}>{q.quotation_number}</div>
                  <div style={{ fontSize: "0.8rem", color: "#7a7f9a", margin: "2px 0 6px 0" }}>
                    {q.company_name} | RFQ: {q.rfq_number}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "#5b6af0", fontSize: "0.8rem" }}>{formatAmount(q.total_amount)}</span>
                    <span className="status-badge" style={{
                      padding: "2px 6px",
                      borderRadius: "6px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      background: q.status === "SUBMITTED" ? "#e0e7ff" : "#fef3c7",
                      color: q.status === "SUBMITTED" ? "#3730a3" : "#92400e",
                    }}>
                      {q.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {quotations.length === 0 && (
              <div style={{ textAlign: "center", color: "#a8adc4", padding: "20px", fontSize: "0.85rem" }}>
                No pending quotations for approval.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Quotation Approval Details */}
        <div>
          {selectedQuote ? (
            <div className="table-card" style={{ padding: "24px" }}>
              <div style={{ borderBottom: "1px solid rgba(200, 202, 212, 0.4)", paddingBottom: "16px", marginBottom: "20px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#5b6af0", letterSpacing: "1px" }}>
                  Selected Quotation for Approval
                </span>
                <h2 style={{ margin: "4px 0", fontSize: "1.3rem", fontWeight: 800, color: "#3a3d52" }}>
                  {selectedQuote.quotation_number} (by {selectedQuote.company_name})
                </h2>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#7a7f9a" }}>
                  Assigned to RFQ: <strong>{selectedQuote.rfq_number} — {selectedQuote.title}</strong>
                </p>
              </div>

              {/* Vendor details overview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", background: "#eef0f5", padding: "16px", borderRadius: "12px", marginBottom: "20px", border: "1px solid rgba(200,202,212,0.4)" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 700 }}>Total Bidded Amount</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#5b6af0" }}>{formatAmount(selectedQuote.total_amount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 700 }}>Delivery Timeline</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#3a3d52" }}>{selectedQuote.delivery_days} Days</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 700 }}>Vendor Rating</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#10b981" }}>{(selectedQuote.rating || 0)} / 5</div>
                </div>
              </div>

              {/* Product specifications table */}
              <div className="form-section-title">Product Specifications Breakdown</div>
              <div className="nm-table-wrapper" style={{ marginBottom: "24px" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items?.map((it) => (
                      <tr key={it.id}>
                        <td style={{ fontWeight: 700 }}>{it.product_name}</td>
                        <td>{it.quantity} {it.unit}</td>
                        <td style={{ fontWeight: 700, color: "#5b6af0" }}>{formatAmount(it.unit_price)}</td>
                        <td style={{ fontWeight: 700 }}>{formatAmount(it.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bargaining / Negotiations Log */}
              <div className="form-section-title">Bargaining & Chat Log with Vendor</div>
              <div style={{ background: "#eef0f5", padding: "16px", borderRadius: "16px", boxShadow: "inset 3px 3px 8px #c8cad4, inset -3px -3px 8px #ffffff", maxHeight: "250px", overflowY: "auto", marginBottom: "16px" }}>
                {negThread.map((n) => {
                  const isMe = Number(n.sender_user_id) === Number(user.id);
                  return (
                    <div key={n.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                      <div style={{
                        maxWidth: "70%",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: isMe ? "#5b6af0" : "#ffffff",
                        color: isMe ? "#ffffff" : "#3a3d52",
                        boxShadow: isMe ? "2px 2px 5px rgba(91,106,240,0.3)" : "2px 2px 5px rgba(0,0,0,0.05)",
                        textAlign: "left"
                      }}>
                        <div style={{ fontSize: "0.7rem", opacity: 0.8, fontWeight: 700, marginBottom: "2px" }}>
                          {n.sender_name} ({n.sender_role})
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{n.message}</div>
                        {n.proposed_amount && (
                          <div style={{
                            marginTop: "4px",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            background: isMe ? "rgba(255,255,255,0.2)" : "#fee2e2",
                            color: isMe ? "#ffffff" : "#b91c1c",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            display: "inline-block"
                          }}>
                            Proposed Price: {formatAmount(n.proposed_amount)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {negThread.length === 0 && (
                  <div style={{ textAlign: "center", color: "#a8adc4", fontSize: "0.85rem", padding: "20px" }}>
                    No bargaining log details recorded yet.
                  </div>
                )}
              </div>

              {/* Chat action form */}
              <form onSubmit={handleSendNegotiation} style={{ display: "grid", gridTemplateColumns: "1fr 180px 100px", gap: "10px", marginBottom: "32px" }}>
                <input
                  type="text"
                  required
                  placeholder="Type message to bargaining..."
                  value={negMessage}
                  onChange={(e) => setNegMessage(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#e8eaf0",
                    boxShadow: "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff",
                    outline: "none",
                    fontWeight: 500
                  }}
                />
                <input
                  type="number"
                  placeholder="Proposed Amount (₹)"
                  value={negProposedAmount}
                  onChange={(e) => setNegProposedAmount(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#e8eaf0",
                    boxShadow: "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff",
                    outline: "none",
                    fontWeight: 600
                  }}
                />
                <button type="submit" className="action-btn" style={{ padding: "10px", minWidth: "80px" }} disabled={actioning}>
                  Send
                </button>
              </form>

              {/* Approval logs timeline */}
              <div className="form-section-title">Approval Audit Trails</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                {approvalHistory.map((log) => (
                  <div key={log.id} style={{ display: "flex", gap: "12px", background: "#eef0f5", padding: "12px 16px", borderRadius: "10px", borderLeft: "4px solid #5b6af0", fontSize: "0.85rem" }}>
                    <div style={{ fontWeight: 800, minWidth: "120px" }}>{log.approver_name}</div>
                    <div style={{ color: "#7a7f9a", minWidth: "80px" }}>{log.status}</div>
                    <div style={{ fontStyle: "italic", flex: 1 }}>{log.remarks}</div>
                    <div style={{ color: "#a8adc4", fontSize: "0.75rem" }}>{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                ))}
                {approvalHistory.length === 0 && (
                  <div style={{ color: "#a8adc4", fontStyle: "italic", fontSize: "0.85rem" }}>
                    No audit records registered yet.
                  </div>
                )}
              </div>

              {/* Action Buttons Panel */}
              <div className="form-section-title">Make Decision (L1/L2 Approval chain)</div>
              <div>
                <textarea
                  placeholder="Enter remarks/instructions for decision action..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#e8eaf0",
                    boxShadow: "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff",
                    outline: "none",
                    fontWeight: 600,
                    resize: "none",
                    marginBottom: "16px"
                  }}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="action-btn" onClick={handleApprove} style={{ background: "#10b981", minWidth: "180px", color: "#ffffff" }} disabled={actioning}>
                    ✓ Approve Quotation
                  </button>
                  <button className="action-btn secondary" onClick={handleReject} style={{ color: "#ef4444", minWidth: "160px" }} disabled={actioning}>
                    ✕ Reject Quotation
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="table-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "450px" }}>
              <div style={{ textAlign: "center", color: "#a8adc4" }}>
                <span style={{ fontSize: "3.5rem" }}>🔍</span>
                <p>Select a pending quotation from the left side panel to review.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
