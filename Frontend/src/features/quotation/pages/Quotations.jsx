import { useState, useEffect } from "react";
import useAuth from "../../auth/hook/useAuth";
import useQuotation from "../hook/useQuotation";
import { formatAmount } from "../utils/quotation.utils";
import { useNavigate } from "react-router";
import axios from "axios";
import "../../../styles/dashboard.scss";

const approvalsApi = axios.create({
  baseURL: "http://localhost:3000/api/approvals",
  withCredentials: true,
});

export default function Quotations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isVendor = user?.role === "VENDOR";

  const {
    rfqs,
    selectedRfq,
    vendorQuotation,
    rfqQuotations,
    negThread,
    loading,
    error: hookError,
    loadRfqs,
    loadRfqContext,
    saveBid,
    cancelBid,
    loadNegotiations,
  } = useQuotation();

  // Local UI states
  const [isEditing, setIsEditing] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState("");
  const [notes, setNotes] = useState("");
  const [itemPrices, setItemPrices] = useState({}); // { rfq_item_id: price }
  const [negMessage, setNegMessage] = useState("");
  const [negProposedAmount, setNegProposedAmount] = useState("");
  const [localError, setLocalError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadRfqs().then((data) => {
      if (data && data.length > 0) {
        handleSelectRfq(data[0]);
      }
    });
  }, [loadRfqs]);

  const handleSelectRfq = async (rfq) => {
    setLocalError(null);
    setSuccessMsg(null);
    setIsEditing(false);
    setDeliveryDays("");
    setNotes("");
    setItemPrices({});
    setNegMessage("");
    setNegProposedAmount("");

    await loadRfqContext(rfq, isVendor);
  };

  // Populate vendor fields when vendorQuotation changes
  useEffect(() => {
    if (vendorQuotation) {
      setDeliveryDays(vendorQuotation.delivery_days || "");
      setNotes(vendorQuotation.notes || "");
      const pricesMap = {};
      vendorQuotation.items?.forEach((it) => {
        pricesMap[it.rfq_item_id] = it.unit_price;
      });
      setItemPrices(pricesMap);
    }
  }, [vendorQuotation]);

  const handleSaveQuotation = async (e) => {
    e.preventDefault();
    if (!selectedRfq) return;

    const itemsPayload = selectedRfq.items?.map((it) => ({
      rfq_item_id: it.id,
      unit_price: Number(itemPrices[it.id] || 0),
    })) || [];

    if (itemsPayload.some((it) => it.unit_price <= 0)) {
      setLocalError("Please fill out valid unit prices for all items");
      return;
    }
    if (!deliveryDays || Number(deliveryDays) <= 0) {
      setLocalError("Please enter a valid delivery timeline");
      return;
    }

    try {
      setLocalError(null);
      setSuccessMsg(null);
      const qId = vendorQuotation?.id;
      const res = await saveBid(qId, selectedRfq.id, deliveryDays, notes, itemsPayload);
      setSuccessMsg(qId ? "Quotation updated successfully" : "Quotation submitted successfully");
      setIsEditing(false);
      const newQuote = res.quotation || res;
      if (newQuote && newQuote.id) {
        await loadNegotiations(newQuote.id);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || "Failed to save quotation");
    }
  };

  const handleCancelQuotation = async () => {
    if (!vendorQuotation) return;
    if (!window.confirm("Are you sure you want to cancel and delete this quotation?")) return;

    try {
      setLocalError(null);
      setSuccessMsg(null);
      await cancelBid(vendorQuotation.id);
      setDeliveryDays("");
      setNotes("");
      setItemPrices({});
      setSuccessMsg("Quotation cancelled and deleted successfully");
    } catch (err) {
      setLocalError(err.response?.data?.message || "Failed to cancel quotation");
    }
  };

  const handleSendNegotiation = async (e) => {
    e.preventDefault();
    const qId = vendorQuotation?.id || (rfqQuotations.length > 0 ? rfqQuotations[0].id : null);
    if (!qId) return;
    if (!negMessage.trim()) return;

    try {
      setLocalError(null);
      setSendingMessage(true);
      
      const negotiationsApi = axios.create({
        baseURL: "http://localhost:3000/api/negotiations",
        withCredentials: true,
      });

      await negotiationsApi.post("/", {
        quotation_id: qId,
        message: negMessage,
        proposed_amount: negProposedAmount ? Number(negProposedAmount) : null,
      });

      setNegMessage("");
      setNegProposedAmount("");
      await loadNegotiations(qId);
      setSuccessMsg("Negotiation message sent!");
    } catch (err) {
      setLocalError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSelectQuote = async (quote) => {
    try {
      setLocalError(null);
      setSuccessMsg(null);
      await approvalsApi.post("/", {
        quotation_id: quote.id,
        status: "APPROVED",
        remarks: "Quotation selected for approval chain from comparison card view",
      });

      setSuccessMsg(`Quotation ${quote.quotation_number} selected. Navigating to Approvals page...`);
      setTimeout(() => {
        navigate("/approvals");
      }, 1500);
    } catch (err) {
      setLocalError(err.response?.data?.message || "Failed to select quotation for approval");
    }
  };

  if (loading && rfqs.length === 0) {
    return (
      <div className="dashboard-container">
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

  const activeError = localError || hookError;
  const lowestPrice = rfqQuotations.length > 0 
    ? Math.min(...rfqQuotations.map((q) => Number(q.total_amount))) 
    : Infinity;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 className="dashboard-title">{isVendor ? "My Quotations" : "Compare Quotations"}</h1>
          <p className="dashboard-subtitle">
            {isVendor 
              ? "Apply, edit, or cancel bids on assigned Requests for Quotation (RFQs)"
              : "Analyze and compare vendor bids side-by-side to initiate approvals"
            }
          </p>
        </div>
      </div>

      {activeError && (
        <div className="alert alert-error" style={{
          background: "#fee2e2",
          color: "#b91c1c",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: 600,
          border: "1px solid #fca5a5"
        }}>
          ⚠️ {activeError}
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

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>
        {/* Left column: RFQs list */}
        <div className="table-card" style={{ padding: "16px" }}>
          <div className="card-title" style={{ fontSize: "1rem", marginBottom: "12px" }}>Invited RFQs</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {rfqs.map((r) => {
              const isActive = selectedRfq?.id === r.id;
              const isClosed = r.status === "CLOSED" || r.status === "AWARDED" || r.status === "CANCELLED";
              return (
                <div
                  key={r.id}
                  onClick={() => handleSelectRfq(r)}
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
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#3a3d52" }}>{r.rfq_number}</div>
                  <div style={{ fontSize: "0.8rem", color: "#7a7f9a", margin: "2px 0 6px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.title}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`status-badge`} style={{
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: isClosed ? "#e2e8f0" : "#dcfce7",
                      color: isClosed ? "#475569" : "#166534",
                    }}>
                      {r.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {rfqs.length === 0 && (
              <div style={{ fontSize: "0.85rem", color: "#a8adc4", textAlign: "center", padding: "20px" }}>
                No RFQs found.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Form or Comparison details */}
        <div>
          {selectedRfq ? (
            <div className="table-card" style={{ minHeight: "450px" }}>
              <div style={{ borderBottom: "1px solid rgba(200, 202, 212, 0.4)", paddingBottom: "16px", marginBottom: "20px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#5b6af0", letterSpacing: "1px" }}>
                  Selected RFQ
                </span>
                <h2 style={{ margin: "4px 0", fontSize: "1.3rem", fontWeight: 800, color: "#3a3d52" }}>
                  {selectedRfq.rfq_number} — {selectedRfq.title}
                </h2>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#7a7f9a" }}>
                  Deadline: {new Date(selectedRfq.deadline).toLocaleDateString()} | Status: <strong>{selectedRfq.status}</strong>
                </p>
              </div>

              {/* VENDOR VIEW: Submit, Edit, Cancel bid */}
              {isVendor && (
                <div>
                  {selectedRfq.status !== "OPEN" && !vendorQuotation ? (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#7a7f9a" }}>
                      🔒 Submissions are closed for this RFQ (status: {selectedRfq.status}).
                    </div>
                  ) : (
                    <>
                      {vendorQuotation && !isEditing ? (
                        <div>
                          <div style={{ background: "#eef0f5", padding: "16px", borderRadius: "12px", border: "1px solid rgba(200,202,212,0.5)", marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                              <div>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 600 }}>Quotation Number</div>
                                <div style={{ fontWeight: 800, color: "#3a3d52" }}>{vendorQuotation.quotation_number}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 600 }}>Quotation Status</div>
                                <span className={`status-badge`} style={{
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  background: vendorQuotation.status === "SELECTED" ? "#dcfce7" : vendorQuotation.status === "REJECTED" ? "#fee2e2" : "#fef3c7",
                                  color: vendorQuotation.status === "SELECTED" ? "#166534" : vendorQuotation.status === "REJECTED" ? "#991b1b" : "#92400e",
                                }}>
                                  {vendorQuotation.status}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                              <div>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 600 }}>Grand Total Amount</div>
                                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#5b6af0" }}>{formatAmount(vendorQuotation.total_amount)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 600 }}>Delivery Timeline</div>
                                <div style={{ fontWeight: 700, color: "#3a3d52" }}>{vendorQuotation.delivery_days} Days</div>
                              </div>
                            </div>
                            {vendorQuotation.notes && (
                              <div style={{ marginTop: "12px" }}>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#a8adc4", fontWeight: 600 }}>Vendor Notes</div>
                                <div style={{ fontSize: "0.85rem", color: "#7a7f9a" }}>{vendorQuotation.notes}</div>
                              </div>
                            )}
                          </div>

                          <div className="form-section-title">Submitted Unit Prices</div>
                          <div className="nm-table-wrapper" style={{ marginBottom: "20px" }}>
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
                                {vendorQuotation.items?.map((it) => (
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

                          {selectedRfq.status === "OPEN" && (
                            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                              <button className="action-btn" onClick={() => setIsEditing(true)} style={{ minWidth: "150px" }}>
                                Change Quotation
                              </button>
                              <button className="action-btn secondary" style={{ color: "#ef4444", minWidth: "150px" }} onClick={handleCancelQuotation}>
                                Cancel Quotation
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Submission or Edit Mode Form */
                        <form onSubmit={handleSaveQuotation}>
                          <div className="form-section-title">Enter Product Unit Prices</div>
                          <div className="nm-table-wrapper" style={{ marginBottom: "24px" }}>
                            <table>
                              <thead>
                                <tr>
                                  <th>Product Name</th>
                                  <th>Specifications</th>
                                  <th>Quantity Needed</th>
                                  <th>Unit Price (₹)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRfq.items?.map((it) => (
                                  <tr key={it.id} style={{ transform: "none", boxShadow: "none" }}>
                                    <td style={{ fontWeight: 700 }}>{it.product_name}</td>
                                    <td style={{ color: "#7a7f9a" }}>{it.product_description || "-"}</td>
                                    <td style={{ fontWeight: 700 }}>{it.quantity} {it.unit}</td>
                                    <td>
                                      <input
                                        type="number"
                                        min="1"
                                        required
                                        value={itemPrices[it.id] || ""}
                                        onChange={(e) => setItemPrices({ ...itemPrices, [it.id]: e.target.value })}
                                        style={{
                                          width: "120px",
                                          padding: "8px",
                                          borderRadius: "8px",
                                          border: "none",
                                          background: "#e8eaf0",
                                          boxShadow: "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff",
                                          fontWeight: 700,
                                          color: "#3a3d52",
                                          outline: "none"
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                            <div>
                              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#3a3d52" }}>
                                Delivery Timeline (in Days) *
                              </label>
                              <input
                                type="number"
                                min="1"
                                required
                                value={deliveryDays}
                                onChange={(e) => setDeliveryDays(e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  border: "none",
                                  background: "#e8eaf0",
                                  boxShadow: "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff",
                                  marginTop: "6px",
                                  fontWeight: 600,
                                  outline: "none"
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#3a3d52" }}>
                                Additional Remarks / Notes
                              </label>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows="2"
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  border: "none",
                                  background: "#e8eaf0",
                                  boxShadow: "inset 2px 2px 5px #c8cad4, inset -2px -2px 5px #ffffff",
                                  marginTop: "6px",
                                  fontWeight: 600,
                                  outline: "none",
                                  resize: "none"
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "12px" }}>
                            <button type="submit" className="action-btn" style={{ minWidth: "160px" }}>
                              {vendorQuotation ? "Submit Updates" : "Apply Quotation"}
                            </button>
                            {vendorQuotation && (
                              <button type="button" className="action-btn secondary" onClick={() => setIsEditing(false)} style={{ minWidth: "150px" }}>
                                Discard Changes
                              </button>
                            )}
                          </div>
                        </form>
                      )}

                      {/* NEGOTIATION / BARGAINING PANEL FOR VENDOR */}
                      {vendorQuotation && (
                        <div style={{ marginTop: "32px", borderTop: "1px solid rgba(200, 202, 212, 0.4)", paddingTop: "24px" }}>
                          <div className="form-section-title">Bargaining & Negotiations</div>
                          <div style={{ background: "#eef0f5", padding: "16px", borderRadius: "16px", boxShadow: "inset 3px 3px 8px #c8cad4, inset -3px -3px 8px #ffffff", maxHeight: "300px", overflowY: "auto", marginBottom: "16px" }}>
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
                                No bargaining comments recorded yet.
                              </div>
                            )}
                          </div>

                          <form onSubmit={handleSendNegotiation} style={{ display: "grid", gridTemplateColumns: "1fr 160px 110px", gap: "10px" }}>
                            <input
                              type="text"
                              required
                              placeholder="Type reply message..."
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
                              placeholder="Proposed ₹ (opt)"
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
                            <button type="submit" className="action-btn" style={{ padding: "10px", minWidth: "90px" }} disabled={sendingMessage}>
                              {sendingMessage ? "..." : "Send"}
                            </button>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* MANAGER / ADMIN VIEW: Compare Vendors Cards & select bid */}
              {!isVendor && (
                <div>
                  <div className="form-section-title">Vendor Quotation Comparison</div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                    {rfqQuotations.map((q) => {
                      const isLowest = Number(q.total_amount) === lowestPrice;
                      return (
                        <div
                          key={q.id}
                          style={{
                            background: isLowest ? "#dcfce7" : "#eef0f5",
                            borderRadius: "16px",
                            padding: "20px",
                            boxShadow: "6px 6px 12px #c8cad4, -6px -6px 12px #ffffff",
                            border: isLowest ? "2px solid #22c55e" : "1px solid rgba(200, 202, 212, 0.4)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "12px",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontWeight: 800, fontSize: "1rem", color: "#3a3d52" }}>
                                {q.company_name}
                              </span>
                              {isLowest && (
                                <span style={{
                                  background: "#22c55e",
                                  color: "#ffffff",
                                  fontSize: "0.65rem",
                                  fontWeight: 900,
                                  padding: "2px 6px",
                                  borderRadius: "6px",
                                  whiteSpace: "nowrap"
                                }}>
                                  LOWEST PRICE
                                </span>
                              )}
                            </div>
                            <div style={{ color: "#7a7f9a", fontSize: "0.75rem", marginBottom: "8px" }}>
                              Quote: {q.quotation_number}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#7a7f9a" }}>Grand Total:</span>
                                <span style={{ fontWeight: 800, color: "#3a3d52" }}>{formatAmount(q.total_amount)}</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#7a7f9a" }}>GST %:</span>
                                <span style={{ fontWeight: 700, color: "#3a3d52" }}>18%</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#7a7f9a" }}>Delivery:</span>
                                <span style={{ fontWeight: 700, color: "#3a3d52" }}>{q.delivery_days} days</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#7a7f9a" }}>Vendor Rating:</span>
                                <span style={{ fontWeight: 700, color: "#5b6af0" }}>{(q.rating || 0)} / 5</span>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#7a7f9a" }}>Payment terms:</span>
                                <span style={{ fontWeight: 600, color: "#3a3d52" }}>30 days</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            {q.status === "DRAFT" || q.status === "SUBMITTED" || q.status === "UNDER_NEGOTIATION" ? (
                              <button
                                className="action-btn"
                                style={{ width: "100%", background: isLowest ? "#22c55e" : "#5b6af0", minHeight: "38px" }}
                                onClick={() => handleSelectQuote(q)}
                              >
                                {isLowest ? "Select & Approve" : "Select"}
                              </button>
                            ) : (
                              <span className="status-badge" style={{
                                display: "block",
                                textAlign: "center",
                                padding: "8px",
                                borderRadius: "10px",
                                background: q.status === "SELECTED" ? "#dcfce7" : "#fee2e2",
                                color: q.status === "SELECTED" ? "#166534" : "#991b1b",
                                fontWeight: 700,
                                fontSize: "0.8rem"
                              }}>
                                Status: {q.status}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {rfqQuotations.length === 0 && (
                      <div style={{ gridColumn: "span 3", textAlign: "center", color: "#a8adc4", padding: "40px 20px" }}>
                        No quotations received for this RFQ yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="table-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "450px" }}>
              <div style={{ textAlign: "center", color: "#a8adc4" }}>
                <span style={{ fontSize: "3rem" }}>📋</span>
                <p>Select an RFQ from the left list to view quotations.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
