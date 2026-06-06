import { useNavigate } from "react-router";
import useRfqForm from "../hook/useRfqForm";
import { toast } from "react-toastify";
import RfqItemRow from "../components/RfqItemRow";
import VendorSelector from "../components/VendorSelector";
import "../styles/rfq.scss";

const CreateRfq = () => {
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    description,
    setDescription,
    deadline,
    setDeadline,
    items,
    handleItemChange,
    addItem,
    removeItem,
    selectedVendors,
    handleVendorToggle,
    submitCreate,
    vendors,
    loadingVendors,
    submitting,
  } = useRfqForm();

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitCreate();
    if (success) {
      toast.success("RFQ created and sent to vendors successfully!");
      navigate("/rfqs");
    }
  };


  return (
    <div className="rfq-container">
      {/* RFQ Header Bar */}
      <div className="rfq-header-bar">
        <div className="rfq-title-area">
          <h1 className="rfq-title">Create New RFQ</h1>
          <p className="rfq-subtitle">
            Publish a Request for Quotation to source products from verified vendors
          </p>
        </div>
      </div>

      {/* RFQ Create Form Card */}
      <form onSubmit={handleSubmit} className="rfq-form-card">
        
        {/* Basic Details Section */}
        <div className="form-section-title">RFQ Basic Information</div>
        <div className="form-group">
          <label htmlFor="rfq-title-input">RFQ Title</label>
          <input
            id="rfq-title-input"
            type="text"
            placeholder="e.g. Bulk Office Supplies Procurement - Q3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="rfq-deadline-input">Quotation Deadline</label>
            <input
              id="rfq-deadline-input"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="rfq-desc-input">RFQ Description / Terms</label>
          <textarea
            id="rfq-desc-input"
            placeholder="Specify procurement terms, delivery guidelines, or overall project details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Dynamic Items List Section */}
        <div className="form-section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Required Product Items</span>
          <button 
            type="button" 
            className="action-btn" 
            onClick={addItem} 
            style={{ minWidth: "120px", minHeight: "38px", display: "inline-flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}
          >
            + Add Item
          </button>
        </div>

        <div className="items-list-container">
          {items.map((item, index) => (
            <RfqItemRow
              key={index}
              item={item}
              index={index}
              handleItemChange={handleItemChange}
              removeItem={removeItem}
            />
          ))}
        </div>

        {/* Vendors Selection Section */}
        <div className="form-section-title">Invite Vendors</div>
        <VendorSelector
          vendors={vendors}
          loadingVendors={loadingVendors}
          selectedVendors={selectedVendors}
          handleVendorToggle={handleVendorToggle}
        />

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="action-btn secondary"
            onClick={() => navigate("/rfqs")}
            disabled={submitting}
            style={{ minWidth: "140px", minHeight: "42px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="action-btn"
            disabled={submitting}
            style={{ minWidth: "140px", minHeight: "42px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            {submitting ? "Publishing..." : "Publish RFQ"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateRfq;