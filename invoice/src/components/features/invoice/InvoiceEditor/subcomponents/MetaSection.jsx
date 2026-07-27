import React from 'react';
import { LuCalendar } from 'react-icons/lu';
import { Section, Field } from './EditorLayout';

const MetaSection = ({ data, open, onToggle, handleChange }) => {
  return (
    <Section icon={<LuCalendar size={16} />} title="Invoice details" sub="Number, dates, payment terms" open={open} onToggle={onToggle}>
      <div className="field-row">
        <Field label="Invoice no.">
          <input
            value={data.meta.invoiceNumber}
            placeholder="INV-001"
            onChange={e => handleChange('meta', 'invoiceNumber', e.target.value)}
          />
        </Field>
        <Field label="Terms">
          <input 
            value={data.meta.dueDate} 
            placeholder="On Receipt"
            readOnly={data.isExisting}
            onChange={e => handleChange('meta', 'dueDate', e.target.value)} 
          />
        </Field>
        <Field label="Invoice date">
          <input 
            value={data.meta.date}
            placeholder="e.g. Oct 24, 2023"
            readOnly={data.isExisting}
            onChange={e => handleChange('meta', 'date', e.target.value)} 
          />
        </Field>
      </div>
    </Section>
  );
};

export default MetaSection;
