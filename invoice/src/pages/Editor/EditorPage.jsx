import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import InvoiceEditor from '../../components/features/invoice/InvoiceEditor/InvoiceEditor';
import InvoicePreview from '../../components/features/invoice/InvoicePreview/InvoicePreview';
import { useInvoice } from '../../hooks/useInvoice';
import { useToast } from '../../context/ToastContext';
import './EditorPage.css';

const EditorPage = () => {
  const [invoiceData, setInvoiceData] = useInvoice();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle "Remake" functionality from Invoices Page
  React.useEffect(() => {
    if (location.state?.remakeData) {
      const data = location.state.remakeData;
      
      // Map database record to frontend state structure
      const mappedData = {
        isExisting: false, 
        business: invoiceData.business, 
        client: {
          id: data.customer?.id || '',
          name: data.customer?.name || '',
          email: data.customer?.email || '',
          phoneCountryCode: data.customer?.phoneCountryCode || '',
          phoneNumber: data.customer?.phoneNumber || '',
          gstNumber: data.customer?.gstNumber || '',
          street: data.customer?.street || '',
          district: data.customer?.district || '',
          city: data.customer?.city || '',
          state: data.customer?.state || '',
          pincode: data.customer?.pincode || '',
          country: data.customer?.country || '',
        },
        meta: {
          invoiceNumber: '', // Clear to allow fetching next number
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dueDate: 'On Receipt' 
        },
        items: data.items.map(item => ({
          id: item.id || Date.now() + Math.random(),
          serviceId: item.serviceId || '',
          description: item.serviceNameSnapshot,
          longDescription: '', 
          rate: Number(item.unitPrice),
          quantity: item.quantity,
          gstRate: Number(item.gstRate),
        })),
        taxRate: Number(data.items[0]?.gstRate) || 18,
        discount: 0,
        footerNotes: 'Thank you for your business!'
      };

      setInvoiceData(mappedData);
      
      // Clear state so it doesn't re-trigger on navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, setInvoiceData, navigate, location.pathname, invoiceData.business]);

  const { showToast } = useToast();

  return (
    <div className="editor-layout-wrapper">
      <div className="editor-main">
        <div className="editor-topbar">
          <div>
            <div className="topbar-eyebrow">Invoice editor</div>
            <h1>New invoice</h1>
            <p>Fill in your business, client and line items — the preview updates as you go.</p>
          </div>
          <div className="topbar-actions">
            <div className="status-pill"><span className="dot"></span> Draft</div>
            <button className="editor-btn editor-btn-primary" onClick={() => {
              const previewExportBtn = document.getElementById('preview-export-btn');
              if (previewExportBtn) previewExportBtn.click();
            }}>
              Export PDF
            </button>
          </div>
        </div>

        <div className="content-grid">
          <div className="col-left">
            <InvoiceEditor data={invoiceData} onChange={setInvoiceData} showToast={showToast} />
          </div>
          <div className="col-right">
            <div className="preview-shell">
              <InvoicePreview data={invoiceData} onReset={() => {
                  fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/invoices/next-number`)
                    .then(res => res.json())
                    .then(resData => {
                        setInvoiceData(prev => ({
                            ...prev,
                            client: { id: '', name: '', address1: '', address2: '', phone: '', email: '', gstNumber: '' },
                            meta: { ...prev.meta, invoiceNumber: resData.nextNumber || '' },
                            items: [{ id: Date.now(), serviceId: '', description: '', longDescription: '', rate: 0, quantity: 1, gstRate: 0 }]
                        }));
                    })
                    .catch(err => console.error('Failed to refetch next invoice number:', err));
              }} showToast={showToast} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
