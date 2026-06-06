import { useState, useEffect } from "react";
import useRfq from "./useRfq";
import { validateRfqData } from "../utils/rfq.utils";
import { toast } from "react-toastify";

export default function useRfqForm(rfqId = null) {
  const {
    selectedRfq,
    loadingDetails,
    vendors,
    loadingVendors,
    submitting,
    loadRfqDetails,
    loadVendors,
    publishRfq,
    updateRfqDetails,
  } = useRfq();

  // Local Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [items, setItems] = useState([
    { product_name: "", description: "", unit: "Units", quantity: 1 }
  ]);
  const [selectedVendors, setSelectedVendors] = useState([]);

  // Fetch initial details and active vendors list
  useEffect(() => {
    if (rfqId) {
      loadRfqDetails(rfqId).catch((err) => {
        toast.error(err.message || "Failed to load RFQ details");
      });
    }
    loadVendors().catch((err) => {
      toast.error(err.message || "Failed to load active vendors");
    });
  }, [rfqId, loadRfqDetails, loadVendors]);

  // Pre-populate fields once details are loaded (Edit mode)
  useEffect(() => {
    if (rfqId && selectedRfq) {
      setTitle(selectedRfq.title || "");
      setDescription(selectedRfq.description || "");
      setStatus(selectedRfq.status || "OPEN");

      if (selectedRfq.deadline) {
        try {
          const d = new Date(selectedRfq.deadline);
          const offset = d.getTimezoneOffset() * 60000;
          const localIso = new Date(d.getTime() - offset).toISOString().slice(0, 16);
          setDeadline(localIso);
        } catch {
          setDeadline("");
        }
      }

      if (selectedRfq.items && selectedRfq.items.length > 0) {
        setItems(
          selectedRfq.items.map((item) => ({
            product_name: item.product_name || "",
            description: item.product_description || "",
            unit: item.unit || "Units",
            quantity: item.quantity ? Number(item.quantity) : 1,
          }))
        );
      }

      if (selectedRfq.vendors) {
        setSelectedVendors(selectedRfq.vendors.map((v) => Number(v.vendor_id)));
      }
    }
  }, [rfqId, selectedRfq]);

  // Handle Item Modifications
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Add Empty Item Row
  const addItem = () => {
    setItems([...items, { product_name: "", description: "", unit: "Units", quantity: 1 }]);
  };

  // Remove Item Row
  const removeItem = (index) => {
    if (items.length === 1) {
      toast.warning("At least one item is required in the RFQ");
      return;
    }
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  // Toggle Invited Vendor Selection
  const handleVendorToggle = (vendorId) => {
    const numericId = Number(vendorId);
    if (selectedVendors.includes(numericId)) {
      setSelectedVendors(selectedVendors.filter((id) => id !== numericId));
    } else {
      setSelectedVendors([...selectedVendors, numericId]);
    }
  };

  // Submit Handler for Create Mode
  const submitCreate = async () => {
    const validationError = validateRfqData({ title, deadline, items });
    if (validationError) {
      toast.error(validationError);
      return false;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        deadline,
        items: items.map((item) => ({
          product_name: item.product_name.trim(),
          description: item.description.trim(),
          unit: item.unit,
          quantity: Number(item.quantity),
        })),
        vendor_ids: selectedVendors,
      };

      await publishRfq(payload);
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to create RFQ");
      return false;
    }
  };

  // Submit Handler for Edit Mode
  const submitEdit = async () => {
    if (!rfqId) return false;

    const validationError = validateRfqData({ title, deadline, items });
    if (validationError) {
      toast.error(validationError);
      return false;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        deadline,
        status,
        items: items.map((item) => ({
          product_name: item.product_name.trim(),
          description: item.description.trim(),
          unit: item.unit,
          quantity: Number(item.quantity),
        })),
        vendor_ids: selectedVendors,
      };

      await updateRfqDetails(rfqId, payload);
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to save RFQ updates");
      return false;
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    deadline,
    setDeadline,
    status,
    setStatus,
    items,
    handleItemChange,
    addItem,
    removeItem,
    selectedVendors,
    handleVendorToggle,
    submitCreate,
    submitEdit,
    vendors,
    loadingVendors,
    loadingDetails,
    submitting,
  };
}
