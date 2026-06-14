import nodemailer from "nodemailer";

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallback;
  return value.toLowerCase() === "true";
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = toBoolean(process.env.SMTP_SECURE, port === 465);
  const user = process.env.SMTP_USER;
  const passRaw = process.env.SMTP_PASS;
  // strip spaces if any
  const pass = typeof passRaw === "string" ? passRaw.replace(/\s+/g, "") : passRaw;

  if (!host || !user || !pass) {
    console.warn("⚠️ SMTP settings are incomplete in environment variables.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendInvoiceEmail({ toEmail, invoice, items }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.error("❌ Cannot send invoice email: Transporter not configured.");
    return;
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const subtotalVal = Number(invoice.subtotal || 0);
  const cgstVal = subtotalVal * 0.09;
  const sgstVal = subtotalVal * 0.09;
  const totalVal = subtotalVal + cgstVal + sgstVal;

  const itemsHtml = items && items.length
    ? items.map(item => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: left;">${item.product_name}</td>
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: center;">${item.quantity} ${item.unit || 'units'}</td>
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: right;">₹${Number(item.unit_price || 0).toFixed(2)}</td>
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: right; font-weight: 600;">₹${Number(item.total_price || 0).toFixed(2)}</td>
        </tr>
      `).join("")
    : `
      <tr>
        <td colspan="4" style="padding: 16px; text-align: center; color: #64748b; font-size: 14px;">No items found</td>
      </tr>
    `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoice_number}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 20px; color: #2D3748;">
      <div style="max-width: 650px; margin: 20px auto; background-color: #FAF6F0; border: 1px solid #E2E8F0; padding: 40px; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 30px; border-bottom: 2px solid #C2410C; padding-bottom: 10px;">
          <h1 style="font-size: 36px; font-weight: 800; color: #C2410C; margin: 0; text-transform: uppercase;">INVOICE</h1>
          <span style="font-size: 18px; font-weight: 700; color: #C2410C;">${invoice.invoice_number}</span>
        </div>

        <div style="margin-bottom: 30px; line-height: 1.5;">
          <div style="font-size: 12px; font-weight: 800; color: #C2410C; text-transform: uppercase; margin-bottom: 5px;">FROM</div>
          <div style="font-size: 16px; font-weight: 700; color: #1A202C; margin-bottom: 4px;">${invoice.company_name}</div>
          <div style="font-size: 13px; color: #4A5568;">
            ${invoice.vendor_address || 'Surat, Gujarat'}<br>
            GSTIN: ${invoice.gst_number || 'N/A'}<br>
            Phone: ${invoice.vendor_phone || 'N/A'}
          </div>
        </div>

        <div style="margin-bottom: 30px; line-height: 1.5;">
          <div style="font-size: 12px; font-weight: 800; color: #C2410C; text-transform: uppercase; margin-bottom: 5px;">BILL TO</div>
          <div style="font-size: 16px; font-weight: 700; color: #1A202C; margin-bottom: 4px;">Your Organization Name</div>
          <div style="font-size: 13px; color: #4A5568;">
            123 business park, ahmedabad<br>
            GSTIN: 25383438AFB
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #C2410C;">
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: left;">Description</th>
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: center;">Qty</th>
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: right;">Rate</th>
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="border: none; padding: 12px 0 4px 0;"></td>
              <td style="font-weight: 600; font-size: 13px; color: #718096; padding: 12px 0 4px 0; text-align: right;">Subtotal:</td>
              <td style="font-weight: 600; font-size: 13px; color: #4A5568; padding: 12px 0 4px 0; text-align: right;">₹${subtotalVal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="border: none; padding: 4px 0;"></td>
              <td style="font-weight: 600; font-size: 13px; color: #718096; padding: 4px 0; text-align: right;">CGST (9%):</td>
              <td style="font-weight: 600; font-size: 13px; color: #4A5568; padding: 4px 0; text-align: right;">₹${cgstVal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="border: none; padding: 4px 0;"></td>
              <td style="font-weight: 600; font-size: 13px; color: #718096; padding: 4px 0; text-align: right;">SGST (9%):</td>
              <td style="font-weight: 600; font-size: 13px; color: #4A5568; padding: 4px 0; text-align: right;">₹${sgstVal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #C2410C; color: #FFFFFF; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; border-radius: 4px; margin-top: 10px;">
          <span>TOTAL</span>
          <span>₹${totalVal.toFixed(2)}</span>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log(`✉️ Sending invoice email for ${invoice.invoice_number} to ${toEmail}...`);
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `[VendorBridge] Invoice Generated: ${invoice.invoice_number}`,
      html: htmlContent,
    });
    console.log(`✅ Invoice email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send invoice email to ${toEmail}:`, error.message);
  }
}

export async function sendApprovedQuotationEmail({ toEmail, quotation, items }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.error("❌ Cannot send approved quotation email: Transporter not configured.");
    return;
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const itemsHtml = items && items.length
    ? items.map(item => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: left;">${item.product_name}</td>
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: center;">${item.quantity} ${item.unit || 'units'}</td>
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: right;">₹${Number(item.unit_price || 0).toFixed(2)}</td>
          <td style="padding: 12px; font-size: 14px; color: #334155; text-align: right; font-weight: 600;">₹${Number(item.total_price || 0).toFixed(2)}</td>
        </tr>
      `).join("")
    : `
      <tr>
        <td colspan="4" style="padding: 16px; text-align: center; color: #64748b; font-size: 14px;">No items found</td>
      </tr>
    `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quotation ${quotation.quotation_number} Approved</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #FAF6F0; margin: 0; padding: 20px; color: #2D3748;">
      <div style="max-width: 650px; margin: 20px auto; background-color: #FAF6F0; border: 1px solid #E2E8F0; padding: 40px; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 30px; border-bottom: 2px solid #C2410C; padding-bottom: 10px;">
          <h1 style="font-size: 28px; font-weight: 800; color: #C2410C; margin: 0; text-transform: uppercase;">QUOTATION APPROVED</h1>
          <span style="font-size: 16px; font-weight: 700; color: #C2410C;">${quotation.quotation_number}</span>
        </div>

        <div style="margin-bottom: 20px; line-height: 1.5; font-size: 14px;">
          <p>The manager has approved your quotation for RFQ: <strong>${quotation.rfq_number} — ${quotation.rfq_title}</strong>.</p>
          <p><strong>Vendor:</strong> ${quotation.company_name}</p>
          <p><strong>Delivery Timeline:</strong> ${quotation.delivery_days} Days</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #C2410C;">
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: left;">Description</th>
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: center;">Qty</th>
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: right;">Rate</th>
              <th style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #C2410C; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #C2410C; color: #FFFFFF; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700; border-radius: 4px; margin-top: 10px;">
          <span>TOTAL APPROVED BID</span>
          <span>₹${Number(quotation.total_amount || 0).toFixed(2)}</span>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log(`✉️ Sending quotation approval email for ${quotation.quotation_number} to ${toEmail}...`);
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `[VendorBridge] Quotation Approved: ${quotation.quotation_number}`,
      html: htmlContent,
    });
    console.log(`✅ Quotation approval email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send quotation approval email to ${toEmail}:`, error.message);
  }
}
