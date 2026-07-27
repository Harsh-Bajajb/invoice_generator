import React from 'react';
import { LuListChecks } from 'react-icons/lu';
import { Section, Field, CustomSelect, FetchLoading, FetchError } from './EditorLayout';

const ItemsSection = ({
  data,
  open,
  onToggle,
  servicesLoading,
  servicesError,
  services,
  handleServiceSelect,
  handleItemChange,
  addItem,
  removeItem,
  showToast,
  onChange
}) => {
  
  const subtotal = data.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const tax = subtotal * ((data.taxRate || 0) / 100);
  const discount = data.discount || 0;
  const total = Math.max(subtotal + tax - discount, 0);

  const fmt = n => '₹' + n.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2});

  return (
    <Section icon={<LuListChecks size={16} />} title="Line items" sub="What you're billing for" open={open} onToggle={onToggle} className="items-card">
      {servicesLoading && <FetchLoading label="services" />}
      {servicesError && <FetchError message="Cannot connect to backend." />}

      <table className="items">
        <thead>
          <tr>
            <th style={{ width: '44%' }}>Description</th>
            <th className="num" style={{ width: '12%' }}>Qty</th>
            <th className="num" style={{ width: '20%' }}>Rate</th>
            <th className="num" style={{ width: '20%' }}>Amount</th>
            <th style={{ width: 24 }}></th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={item.id}>
              <td style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <CustomSelect
                  id={`service-${item.id}`}
                  value={item.serviceId ?? ''}
                  onChange={e => handleServiceSelect(item.id, e.target.value)}
                  disabled={servicesLoading || data.isExisting}
                  placeholder={servicesLoading ? 'Loading…' : services.length === 0 ? '— No services —' : '— Choose a service —'}
                  options={services.map(sv => ({ 
                    value: sv.id, 
                    label: `${sv.name} — ₹${Number(sv.defaultPrice).toLocaleString('en-IN')} (${sv.gstRate}% GST)` 
                  }))}
                />
                
                <input 
                  className="desc" 
                  placeholder="Additional notes" 
                  value={item.longDescription}
                  onChange={e => handleItemChange(item.id, 'longDescription', e.target.value)}
                  readOnly={data.isExisting}
                  style={{ borderBottom: '1px dashed var(--line)', paddingBottom: 2, fontSize: 12, color: 'var(--text-secondary)' }}
                />
                <input 
                  className="desc" 
                  placeholder="HSN/SAC" 
                  value={item.hsnSac || ''}
                  onChange={e => handleItemChange(item.id, 'hsnSac', e.target.value)}
                  readOnly={data.isExisting}
                  style={{ fontSize: 12, color: 'var(--text-secondary)' }}
                />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <input 
                  className="num qty" 
                  type="number" 
                  value={item.quantity}
                  min="1"
                  max="1000"
                  readOnly={data.isExisting}
                  onChange={e => {
                    let val = parseFloat(e.target.value) || 0;
                    if (val > 1000) {
                      showToast("Value entered is too large");
                      val = 1000;
                    }
                    if (val < 0) val = 0;
                    handleItemChange(item.id, 'quantity', val);
                  }}
                />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <input 
                  className="num rate" 
                  type="number" 
                  value={item.rate}
                  readOnly
                />
              </td>
              <td className="amt-cell" style={{ verticalAlign: 'top', paddingTop: 14 }}>
                <span className="amt">{fmt(item.rate * item.quantity)}</span>
              </td>
              <td style={{ verticalAlign: 'top', paddingTop: 9 }}>
                {!data.isExisting && (
                  <button className="row-del" onClick={() => removeItem(item.id)}>×</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {!data.isExisting && (
        <button className="add-row-btn" onClick={addItem}>+ Add line item</button>
      )}

      <div className="summary-row">
        <Field label="GST (%)">
          <input 
            type="number" 
            value={data.taxRate} 
            readOnly={data.isExisting}
            onChange={e => {
              const val = parseFloat(e.target.value) || 0;
              if (val > 100) {
                showToast("Value entered is too large");
                onChange(prev => ({ ...prev, taxRate: 18 }));
              } else {
                onChange(prev => ({ ...prev, taxRate: val }));
              }
            }}
          />
        </Field>
        <Field label="Discount (₹)">
          <input 
            type="number" 
            value={data.discount} 
            readOnly={data.isExisting}
            onChange={e => {
              let val = parseFloat(e.target.value) || 0;
              const currentSubtotal = data.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);

              if (val > 10000000) {
                showToast("Value entered is too large");
                val = 0;
              }
              if (val > currentSubtotal) {
                showToast("Discount cannnot exceed subtotal value");
                val = currentSubtotal;
              }
              if (val < 0) val = 0;

              onChange(prev => ({ ...prev, discount: val }));
            }}
          />
        </Field>
      </div>

      <div className="summary-totals">
        <div className="sum-line"><span>Subtotal</span><span className="v">{fmt(subtotal)}</span></div>
        <div className="sum-line"><span>Tax</span><span className="v">{fmt(tax)}</span></div>
        <div className="sum-line total"><span>Total</span><span className="v">{fmt(total)}</span></div>
        <div className="balance-due">
          <span className="label">Balance due</span>
          <span className="amt">{fmt(total)}</span>
        </div>
      </div>
    </Section>
  );
};

export default ItemsSection;
