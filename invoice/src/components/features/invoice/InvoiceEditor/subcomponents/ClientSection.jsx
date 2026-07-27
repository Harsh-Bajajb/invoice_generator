import React from 'react';
import { LuUser } from 'react-icons/lu';
import { Section, Field, CustomSelect, FetchLoading, FetchError } from './EditorLayout';

const ClientSection = ({
  data,
  open,
  onToggle,
  customersLoading,
  customersError,
  customers,
  handleCustomerSelect,
  handleChange
}) => {
  return (
    <Section icon={<LuUser size={16} />} title="Client information" sub="Who this invoice is billed to" open={open} onToggle={onToggle}>
      <div className="field-row" style={{ marginBottom: 16 }}>
        <Field label="Select Customer (from database)" fullWidth>
          {customersLoading && <FetchLoading label="customers" />}
          {customersError && <FetchError message="Cannot connect to backend." />}
          {!customersLoading && !customersError && (
            <CustomSelect
              id="customer-select"
              value={data.client?.id ?? ''}
              onChange={handleCustomerSelect}
              disabled={customersLoading || data.isExisting}
              placeholder={customers.length === 0 ? '— No customers in database —' : '— Choose a customer —'}
              options={customers.map(c => ({ value: c.id, label: c.name }))}
            />
          )}
        </Field>
      </div>

      <div className="field-row">
        <Field label="Client name" fullWidth>
          <input 
            placeholder="Client or company name" 
            value={data.client?.name || ''} 
            onChange={e => handleChange('client', 'name', e.target.value)}
            readOnly={data.isExisting}
          />
        </Field>
        
        <Field label="Billing address" fullWidth>
          <textarea 
            placeholder="Street, city, postcode" 
            value={[data.client?.street, data.client?.city, data.client?.state, data.client?.pincode, data.client?.country].filter(Boolean).join(', ')}
            onChange={e => {
              // Just a basic generic update for the raw address string if they type manually
              handleChange('client', 'street', e.target.value);
            }}
            readOnly={data.isExisting}
            style={{ resize: 'vertical', minHeight: '60px' }}
          />
        </Field>
        
        <Field label="Email">
          <input 
            placeholder="billing@client.com" 
            value={data.client?.email || ''} 
            onChange={e => handleChange('client', 'email', e.target.value)}
            readOnly={data.isExisting}
          />
        </Field>
        
        <Field label="GSTIN">
          <input 
            placeholder="Optional" 
            value={data.client?.gstNumber || ''} 
            onChange={e => handleChange('client', 'gstNumber', e.target.value)}
            readOnly={data.isExisting}
          />
        </Field>

        <Field label="Phone">
          <input 
            placeholder="Phone number" 
            value={data.client?.phoneNumber ? `${data.client.phoneCountryCode || ''} ${data.client.phoneNumber}`.trim() : ''} 
            onChange={e => handleChange('client', 'phoneNumber', e.target.value)}
            readOnly={data.isExisting}
          />
        </Field>
      </div>
    </Section>
  );
};

export default ClientSection;
