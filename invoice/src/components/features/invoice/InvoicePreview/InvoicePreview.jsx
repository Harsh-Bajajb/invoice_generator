import React from 'react';
import Invoice from '../InvoiceDetails/invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LuCircleAlert } from 'react-icons/lu';
import './InvoicePreview.css';

const InvoicePreview = ({ data, onReset, showToast }) => {
    const hasQuantityError = data?.items?.some(item => item.quantity > 1000);
    const isReadyToExport = data?.client?.id && data?.items?.some(item => item.serviceId) && !hasQuantityError;
    const [isExporting, setIsExporting] = React.useState(false);
    const [scale, setScale] = React.useState(1);
    const wrapperRef = React.useRef(null);

    const calculateScale = React.useCallback(() => {
        if (!wrapperRef.current) return;
        const width = wrapperRef.current.clientWidth;
        const padding = 52;

        let newScale = (width - padding) / 850;

        // Prevent vertical overflow gracefully without shrinking too aggressively
        const maxAllowedHeight = window.innerHeight * 0.85;
        const a4Height = 700 * 1.414;

        if ((a4Height * newScale) > maxAllowedHeight) {
            newScale = maxAllowedHeight / a4Height;
        }

        setScale(Math.min(1, newScale));
    }, []);

    React.useEffect(() => {
        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [calculateScale]);

    const downloadPDF = async (e) => {
        if (e) e.preventDefault();

        setIsExporting(true);

        // Capture after slight delay to ensure UI stability
        setTimeout(() => {
            const input = document.querySelector('.invoice-container');
            if (!input) {
                setIsExporting(false);
                return;
            }

            // Temporarily reset any transforms that might interfere with html2canvas
            const originalTransform = input.style.transform;
            input.style.transform = 'none';

            html2canvas(input, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 850,
                windowWidth: 850,
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    const clonedInput = clonedDoc.querySelector('.invoice-container');
                    const clonedWrapper = clonedDoc.querySelector('.preview-scale-wrapper');

                    if (clonedInput) {
                        clonedInput.style.width = '850px';
                        clonedInput.style.transform = 'none';
                        clonedInput.style.position = 'relative';
                        clonedInput.style.margin = '0';
                        clonedInput.style.boxShadow = 'none';
                        clonedInput.style.border = 'none';
                    }
                    if (clonedWrapper) {
                        clonedWrapper.style.transform = 'none';
                        clonedWrapper.style.width = '850px';
                        clonedWrapper.style.minWidth = '850px';
                    }
                }
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/jpeg', 0.75);
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

                const invoiceNum = data?.meta?.invoiceNumber || 'Invoice';
                const fileName = `${invoiceNum}.pdf`;

                pdf.save(fileName);

                if (!data.isExisting) {
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/invoices`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
                        },
                        body: JSON.stringify(data)
                    }).then(async (res) => {
                        if (!res.ok) {
                            const errorData = await res.json();
                            throw new Error(errorData.message || 'Failed to save invoice');
                        }
                        if (onReset) onReset();
                    }).catch(err => {
                        console.error('Error saving invoice:', err);
                        if (showToast) showToast(`Error: ${err.message}`);
                    })
                        .finally(() => setIsExporting(false));
                } else {
                    setIsExporting(false);
                }
            });
        }, 100);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div className="preview-label">
                <span>Preview</span>
                <span className="preview-pill">Live Update</span>
            </div>

            {/* Hidden button triggered by EditorPage topbar */}
            <button
                id="preview-export-btn"
                style={{ display: 'none' }}
                onClick={downloadPDF}
                disabled={!isReadyToExport || isExporting}
            />

            {hasQuantityError && (
                <div style={{ marginBottom: 12, padding: '8px 12px', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: 8, color: '#e11d48', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LuCircleAlert size={14} />
                    <span>Quantity exceeds limit of 1000 units.</span>
                </div>
            )}

            <div className="preview-card" ref={wrapperRef}>
                <div className="preview-fold"></div>

                {/* The actual preview content scaled to fit */}
                <div style={{ height: (850 * 1.414) * scale, width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <div
                        className="preview-scale-wrapper"
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top center',
                            width: 850,
                            position: 'absolute',
                            left: '50%',
                            marginLeft: -425
                        }}
                    >
                        <Invoice data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
