import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router";
import { toast } from 'react-toastify'
import {
  submitQuotation,
  saveDraftQuotation,
  getQuotationById,
  updateQuotation,
} from '../services/quotations.api.js'
import '../styles/quotations.scss'

const QuotationSubmission = () => {
  const navigate = useNavigate()
  const { rfqId, quotationId } = useParams()

  const [loading, setLoading] = useState(false)
  const [rfqData, setRfqData] = useState(null)
  const [items, setItems] = useState([
    { id: 1, name: 'Ergonomic chair', qty: 25, unitPrice: 3500, total: 87500, delivery: 7 },
    { id: 2, name: 'Task Card LTD', qty: 10, unitPrice: 9200, total: 92000, delivery: 19 },
  ])
  const [taxRate, setTaxRate] = useState(18)
  const [notes, setNotes] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('Payment terms: 20 days net...')

  // Load quotation if editing
  useEffect(() => {
    if (quotationId) {
      loadQuotation()
    }
  }, [quotationId])

  const loadQuotation = async () => {
    try {
      setLoading(true)
      const data = await getQuotationById(quotationId)
      setItems(data.items || [])
      setTaxRate(data.tax_rate || 18)
      setNotes(data.notes || '')
      setPaymentTerms(data.payment_terms || '')
    } catch (error) {
      toast.error(error?.message || 'Failed to load quotation')
    } finally {
      setLoading(false)
    }
  }

  // Calculate subtotal
  const subtotal = items.reduce((acc, item) => acc + (item.total || 0), 0)
  const gstAmount = (subtotal * taxRate) / 100
  const grandTotal = subtotal + gstAmount

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items]
    updatedItems[index][field] = value

    if (field === 'qty' || field === 'unitPrice') {
      updatedItems[index].total = (updatedItems[index].qty || 0) * (updatedItems[index].unitPrice || 0)
    }

    setItems(updatedItems)
  }

  // Add new item row
  const addItemRow = () => {
    setItems([
      ...items,
      { id: items.length + 1, name: '', qty: 0, unitPrice: 0, total: 0, delivery: 0 },
    ])
  }

  // Remove item row
  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  // Submit quotation
  const handleSubmit = async (isDraft = false) => {
    if (!items.length) {
      toast.error('Please add at least one item')
      return
    }

    try {
      setLoading(true)
      const payload = {
        items,
        tax_rate: taxRate,
        notes,
        payment_terms: paymentTerms,
        subtotal,
        gst_amount: gstAmount,
        grand_total: grandTotal,
      }

      if (quotationId) {
        await updateQuotation(quotationId, payload)
        toast.success('Quotation updated successfully!')
      } else {
        if (isDraft) {
          await saveDraftQuotation(rfqId, payload)
          toast.success('Quotation saved as draft!')
        } else {
          await submitQuotation(rfqId, payload)
          toast.success('Quotation submitted successfully!')
        }
      }

      setTimeout(() => navigate('/quotations/compare/1'), 1500)
    } catch (error) {
      toast.error(error?.message || 'Failed to submit quotation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="quotation-submission">
      <div className="page-header">
        <h1>Submit Quotation</h1>
        <p>RFQ: office furniture procurement q2 - deadline 15 June 2025</p>
      </div>
      <div className="quotation-module-actions">

  <button
    className="module-btn secondary"
    onClick={() => navigate("/quotations")}
  >
    Submit Quotation
  </button>

  <button
    className="module-btn primary"
    onClick={() => navigate("/quotations/compare/1")}
  >
    Compare Quotations
  </button>

</div>

      {/* RFQ Summary Card */}
      <div className="rfq-summary-card">
        <h3>RFQ Summary</h3>
        <p>Ergonomic chair x 25, standing desk x 10 - category furniture</p>
      </div>

      {/* Items Table */}
      <div className="items-section">
        <h3>Your Quotation</h3>
        <div className="table-wrapper">
          <table className="quotation-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit price</th>
                <th>Total</th>
                <th>Delivery (days)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="Item name"
                      className="input-cell"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)}
                      className="input-cell"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="input-cell"
                    />
                  </td>
                  <td className="total-cell">₹{item.total?.toLocaleString('en-IN')}</td>
                  <td>
                    <input
                      type="number"
                      value={item.delivery}
                      onChange={(e) => handleItemChange(index, 'delivery', parseFloat(e.target.value) || 0)}
                      className="input-cell"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => removeItemRow(index)}
                      className="btn-remove"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addItemRow} className="btn-add-item">
          + Add Item
        </button>
      </div>

      {/* Tax and Notes Section */}
      <div className="tax-notes-section">
        <div className="tax-section">
          <div className="form-group">
            <label>Tax / GST %</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="input-field"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Notes / Terms</label>
            <textarea
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Payment terms: 20 days net..."
              className="textarea-field"
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* Summary Box */}
        <div className="summary-box">
          <div className="summary-row">
            <span>Subtotal</span>
            <span className="amount">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row">
            <span>GST ({taxRate}%)</span>
            <span className="amount">₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>Grand total</span>
            <span className="amount">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="additional-notes">
        <label>Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes or comments..."
          className="textarea-field"
          rows="3"
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="btn btn-secondary"
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Submitting...' : 'Submit Quotation'}
        </button>
      </div>
    </div>
  )
}

export default QuotationSubmission
