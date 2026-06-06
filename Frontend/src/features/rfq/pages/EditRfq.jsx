import { useParams, useNavigate } from "react-router";
import useRfqForm from "../hook/useRfqForm";
import { toast } from "react-toastify";
import RfqItemRow from "../components/RfqItemRow";
import VendorSelector from "../components/VendorSelector";
import "../styles/rfq.scss";

const EditRfq = () => {
  const { id } = useParams();
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
    submitEdit,
    vendors,
    loadingVendors,
    loadingDetails,
    submitting,
  } = useRfqForm(id);

  // Handle Submit Edit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitEdit();
    if (success) {
      toast.success("RFQ updated successfully!");
      navigate(`/rfq/${id}`);
    }
  };

  if (loadingDetails) {
    return (
      <div className="rfq-container">
        <div style={{ textAlign: "center", padding: "80px", color: "#7a7f9a" }}>
          Loading RFQ specifications for edit...
        </div>
      </div>
    );
  }


  return (
    <div className="rfq-container">
      {/* RFQ Header Bar */}
      <div className="rfq-header-bar">
        <div className="rfq-title-area">
          <h1 className="rfq-title">Edit RFQ</h1>
          <p className="rfq-subtitle">
            Update request information, items, or shift vendor invitations
          </p>
        </div>
      </div>

      {/* RFQ Edit Form Card */}
      <form onSubmit={handleSubmit} className="rfq-form-card">
        
        {/* Basic Details Section */}
        <div className="form-section-title">RFQ Basic Information</div>
        
        <div className="form-group">
          <label htmlFor="edit-rfq-title">RFQ Title</label>
          <input
            id="edit-rfq-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-rfq-deadline">Quotation Deadline</label>
          <input
            id="edit-rfq-deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-rfq-desc">RFQ Description / Terms</label>
          <textarea
            id="edit-rfq-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Dynamic Items List Section */}
        <div className="form-section-title" style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center" }}>
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
            onClick={() => navigate(`/rfq/${id}`)}
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
            {submitting ? "Saving Updates..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditRfq;
