import React from 'react';
import { LuUpload, LuImage, LuBuilding2 } from 'react-icons/lu';
import { Section, Field } from './EditorLayout';

const BusinessSection = ({
  data,
  open,
  onToggle,
  isEditingBusiness,
  setIsEditingBusiness,
  isSavingBusiness,
  updateBusinessProfile,
  handleLogoUpload,
  handleSignatureUpload,
  handleChange,
  handleNestedChange,
  defaultLogo
}) => {
  const isExisting = data.isExisting;

  return (
    <Section icon={<LuBuilding2 size={16} />} title="Business information" sub="Name, address, tax IDs" open={open} onToggle={onToggle}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        {!isEditingBusiness ? (
          !isExisting && (
            <button className="editor-btn" onClick={() => setIsEditingBusiness(true)}>
              Edit Business Profile
            </button>
          )
        ) : (
          <>
            <button
              className="editor-btn editor-btn-primary"
              onClick={updateBusinessProfile}
              disabled={isSavingBusiness}
            >
              {isSavingBusiness ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="editor-btn" onClick={() => setIsEditingBusiness(false)} disabled={isSavingBusiness}>
              Cancel
            </button>
          </>
        )}
      </div>

      <div className="field-row">
        <Field label="Business name" fullWidth>
          <input
            value={data.business.name}
            placeholder="Acme Corp"
            readOnly={!isEditingBusiness}
            onChange={e => handleChange('business', 'name', e.target.value)}
          />
        </Field>
        <Field label="City">
          <input
            value={data.business.address2?.split(',')[0] || ''}
            placeholder="City"
            readOnly={!isEditingBusiness}
            onChange={e => {
              const state = data.business.address2?.split(',')[1] || '';
              handleChange('business', 'address2', `${e.target.value}, ${state}`.replace(/^, | , $/g, ''));
            }}
          />
        </Field>
        <Field label="State">
          <input
            value={data.business.address2?.split(',')[1]?.trim() || ''}
            placeholder="State"
            readOnly={!isEditingBusiness}
            onChange={e => {
              const city = data.business.address2?.split(',')[0] || '';
              handleChange('business', 'address2', `${city}, ${e.target.value}`.replace(/^, | , $/g, ''));
            }}
          />
        </Field>
        <Field label="MSME / UDYAM no.">
          <input
            value={data.business.number}
            placeholder="UDYAM-..."
            readOnly={!isEditingBusiness}
            onChange={e => handleChange('business', 'number', e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            value={data.business.phone}
            placeholder="Phone number"
            readOnly={!isEditingBusiness}
            onChange={e => handleChange('business', 'phone', e.target.value)}
          />
        </Field>
        <Field label="Email" fullWidth>
          <input
            type="email"
            value={data.business.email}
            placeholder="Email address"
            readOnly={!isEditingBusiness}
            onChange={e => handleChange('business', 'email', e.target.value)}
          />
        </Field>
        
        {/* Other fields from the original component */}
        <Field label="Street address" fullWidth>
          <input
            value={data.business.address1}
            placeholder="Street address"
            readOnly={!isEditingBusiness}
            onChange={e => handleChange('business', 'address1', e.target.value)}
          />
        </Field>
        <Field label="Website" fullWidth>
          <input
            value={data.business.website}
            placeholder="www.yoursite.com"
            readOnly={!isEditingBusiness}
            onChange={e => handleChange('business', 'website', e.target.value)}
          />
        </Field>
      </div>

      <div style={{ marginTop: 24, marginBottom: 12, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Bank Details</div>
      <div className="field-row">
        <Field label="Account Holder Name" fullWidth>
          <input
            value={data.business.bankDetails?.accountName || ''}
            readOnly={!isEditingBusiness}
            onChange={e => handleNestedChange('business', 'bankDetails', 'accountName', e.target.value)}
          />
        </Field>
        <Field label="Bank Name">
          <input
            value={data.business.bankDetails?.bankName || ''}
            readOnly={!isEditingBusiness}
            onChange={e => handleNestedChange('business', 'bankDetails', 'bankName', e.target.value)}
          />
        </Field>
        <Field label="Account Number">
          <input
            value={data.business.bankDetails?.accountNumber || ''}
            readOnly={!isEditingBusiness}
            onChange={e => handleNestedChange('business', 'bankDetails', 'accountNumber', e.target.value)}
          />
        </Field>
        <Field label="IFSC Code">
          <input
            value={data.business.bankDetails?.ifscCode || ''}
            readOnly={!isEditingBusiness}
            onChange={e => handleNestedChange('business', 'bankDetails', 'ifscCode', e.target.value)}
          />
        </Field>
        <Field label="Bank Location">
          <input
            value={data.business.bankDetails?.location || ''}
            readOnly={!isEditingBusiness}
            onChange={e => handleNestedChange('business', 'bankDetails', 'location', e.target.value)}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
        <div>
          <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Logo</div>
          <div
            className="ie-logo-upload"
            onClick={() => isEditingBusiness && document.getElementById('logo-input').click()}
            style={{
              cursor: isEditingBusiness ? 'pointer' : 'default',
              opacity: isEditingBusiness ? 1 : 0.8,
              border: '1px dashed var(--line)',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {data.business.logo || defaultLogo ? (
              <img src={data.business.logo || defaultLogo} alt="Logo" style={{ maxHeight: 60, width: 'auto' }} />
            ) : (
              <div style={{ color: 'var(--text-muted)' }}><LuImage size={20} /></div>
            )}
            <input id="logo-input" type="file" accept="image/*" onChange={handleLogoUpload} hidden disabled={!isEditingBusiness} />
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Authorized Signature</div>
          <div
            className="ie-logo-upload"
            onClick={() => isEditingBusiness && document.getElementById('signature-upload').click()}
            style={{
              cursor: isEditingBusiness ? 'pointer' : 'default',
              opacity: isEditingBusiness ? 1 : 0.8,
              border: '1px dashed var(--line)',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {data.business.signature?.image ? (
              <img src={data.business.signature.image} alt="Signature" style={{ maxHeight: 60, width: 'auto' }} />
            ) : (
              <div style={{ color: 'var(--text-muted)' }}><LuImage size={20} /></div>
            )}
            <input id="signature-upload" type="file" accept="image/*" onChange={handleSignatureUpload} hidden disabled={!isEditingBusiness} />
          </div>
          <div style={{ marginTop: 10 }}>
            <input
              style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 6, padding: '8px 10px', fontSize: 13.5 }}
              value={data.business.signature?.name || ''}
              placeholder="Signee Name"
              readOnly={!isEditingBusiness}
              onChange={e => handleNestedChange('business', 'signature', 'name', e.target.value)}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default BusinessSection;
