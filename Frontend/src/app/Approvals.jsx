import { useState } from "react";
import "../styles/approvals.scss";

export default function Approvals() {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      rfqTitle: "Office furniture Q2",
      vendor: "Infra Supplies",
      poNumber: "PO-2024-001",
      amount: 185400,
      rating: "4.5/5",
      delivery: "10 days",
      status: "L2 approval",
      currentStep: 3,
      totalSteps: 4,
      approvalChain: [
        {
          id: 1,
          name: "Rahul Mehta",
          role: "Procurement head",
          status: "approved",
          timestamp: "Approved on may 20, 10:32 Am",
          avatar: "RM",
        },
        {
          id: 2,
          name: "Priya Shah",
          role: "Finance manager",
          status: "awaiting",
          timestamp: "Assigned on may 21",
          avatar: "PS",
        },
      ],
      comments: [],
      vendorName: "Peaceful Swallow",
      quotationDetails: {
        vendor: "Peaceful Swallow",
        total: 185400,
        delivery: "10 days",
        rating: "4.5/5",
      },
    },
    {
      id: 2,
      rfqTitle: "IT Equipment Q2",
      vendor: "Tech Core",
      poNumber: "PO-2024-002",
      amount: 245000,
      rating: "4.8/5",
      delivery: "5 days",
      status: "L1 Review",
      currentStep: 2,
      totalSteps: 4,
      approvalChain: [
        {
          id: 1,
          name: "Rahul Mehta",
          role: "Procurement head",
          status: "pending",
          timestamp: "Pending since may 22",
          avatar: "RM",
        },
      ],
      comments: [],
      vendorName: "Tech Core LTD",
      quotationDetails: {
        vendor: "Tech Core LTD",
        total: 245000,
        delivery: "5 days",
        rating: "4.8/5",
      },
    },
  ]);

  const [selectedApproval, setSelectedApproval] = useState(approvals[0]);
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      setSelectedApproval((prev) => ({
        ...prev,
        comments: [
          ...prev.comments,
          {
            id: Date.now(),
            text: commentText,
            author: "You",
            timestamp: new Date(),
          },
        ],
      }));
      setCommentText("");
    }
  };

  const handleApprove = () => {
    // Call API to approve
    alert("Approval submitted");
  };

  const handleReject = () => {
    // Call API to reject
    alert("Rejection submitted");
  };

  return (
    <div className="approvals-container">
      {/* Page Header */}
      <div className="approvals-header">
        <div className="header-content">
          <h1 className="approvals-title">Approvals</h1>
          <p className="approvals-subtitle">
            Review and approve procurement requests
          </p>
        </div>
      </div>

      <div className="approvals-main">
        {/* Left: Approvals List */}
        <div className="approvals-list-section">
          <div className="list-header">
            <h2>Pending Approvals</h2>
            <span className="count-badge">{approvals.length}</span>
          </div>

          <div className="approvals-list">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className={`approval-card ${selectedApproval.id === approval.id ? "active" : ""}`}
                onClick={() => setSelectedApproval(approval)}
              >
                <div className="approval-card-header">
                  <h3 className="approval-title">{approval.rfqTitle}</h3>
                  <span
                    className={`status-badge status-${approval.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {approval.status}
                  </span>
                </div>

                <div className="approval-info">
                  <p className="vendor-name">
                    <span className="label">Vendor:</span>
                    {approval.vendor}
                  </p>
                  <p className="po-number">
                    <span className="label">PO#:</span>
                    {approval.poNumber}
                  </p>
                  <p className="amount">
                    <span className="label">Amount:</span>₹
                    {approval.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Approval Details */}
        <div className="approval-details-section">
          {selectedApproval && (
            <>
              {/* Workflow Timeline */}
              <div className="workflow-section">
                <h2 className="section-title">Approval Workflow</h2>
                <p className="workflow-subtitle">
                  RFQ: {selectedApproval.rfqTitle} - Vendor:{" "}
                  {selectedApproval.vendor} - {selectedApproval.poNumber}
                </p>

                <div className="workflow-timeline">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="workflow-step">
                      <div
                        className={`step-circle ${
                          step < selectedApproval.currentStep
                            ? "completed"
                            : step === selectedApproval.currentStep
                              ? "current"
                              : "pending"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 4 && <div className="step-line"></div>}
                      <p className="step-label">
                        {step === 1 && "Submitted"}
                        {step === 2 && "L1 Review"}
                        {step === 3 && "L2 approval"}
                        {step === 4 && "Generate PO"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Chain */}
              <div className="approval-chain-section">
                <h2 className="section-title">Approval Chain</h2>
                <div className="chain-list">
                  {selectedApproval.approvalChain.map((approver, index) => (
                    <div key={approver.id} className="chain-item">
                      <div className="approver-avatar">{approver.avatar}</div>
                      <div className="approver-info">
                        <h4 className="approver-name">{approver.name}</h4>
                        <p className="approver-role">{approver.role}</p>
                        <p
                          className={`approver-status status-${approver.status}`}
                        >
                          {approver.status === "approved" &&
                            "✓ " + approver.timestamp}
                          {approver.status === "awaiting" &&
                            "⏳ " + approver.timestamp}
                          {approver.status === "pending" &&
                            "○ " + approver.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h2 className="section-title">Comments & Conditions</h2>
                <div className="comments-box">
                  <textarea
                    className="comment-input"
                    placeholder="Add your comments or conditions...."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    className="comment-btn"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    Add Comment
                  </button>
                </div>

                {selectedApproval.comments.length > 0 && (
                  <div className="comments-list">
                    {selectedApproval.comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <p className="comment-author">{comment.author}</p>
                        <p className="comment-text">{comment.text}</p>
                        <p className="comment-time">
                          {comment.timestamp.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quotation Details */}
              <div className="quotation-details-section">
                <h2 className="section-title">Quotation Summary</h2>
                <div className="quotation-card">
                  <div className="quotation-row">
                    <span className="label">Vendor:</span>
                    <span className="vendor-tag">
                      {selectedApproval.quotationDetails.vendor}
                    </span>
                  </div>
                  <div className="quotation-row">
                    <span className="label">Total:</span>
                    <span className="amount-value">
                      ₹
                      {selectedApproval.quotationDetails.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="quotation-row">
                    <span className="label">Delivery:</span>
                    <span className="delivery-value">
                      {selectedApproval.quotationDetails.delivery}
                    </span>
                  </div>
                  <div className="quotation-row">
                    <span className="label">Rating:</span>
                    <span className="rating-value">
                      {selectedApproval.quotationDetails.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="approve-btn" onClick={handleApprove}>
                  Approve
                </button>
                <button className="reject-btn" onClick={handleReject}>
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
