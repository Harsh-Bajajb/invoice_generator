import React from 'react';
import { LuChevronDown, LuCircleAlert } from 'react-icons/lu';

export const CustomSelect = ({ id, value, onChange, disabled, options, placeholder, className, style }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options?.find(o => o.value === value);
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', ...style }} className={className}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ 
          width: '100%', padding: '6px 10px', borderRadius: 6, 
          border: '1px solid var(--line)', background: 'var(--surface)',
          cursor: disabled ? 'default' : 'pointer', fontSize: 13,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <LuChevronDown size={14} color="#94a3b8" />
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: 'var(--paper)', border: '1px solid var(--line)',
          borderRadius: 6, marginTop: 4, maxHeight: 200, overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          {placeholder && (
            <div 
              onClick={() => { onChange({ target: { value: '' } }); setIsOpen(false); }}
              style={{ padding: '8px 10px', fontSize: 12.5, cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              {placeholder}
            </div>
          )}
          {options?.map(opt => (
            <div 
              key={opt.value}
              onClick={() => { onChange({ target: { value: opt.value } }); setIsOpen(false); }}
              style={{ 
                padding: '8px 10px', fontSize: 12.5, cursor: 'pointer', 
                background: opt.value === value ? 'var(--accent-soft)' : 'transparent',
                color: opt.value === value ? 'var(--accent-text)' : 'var(--text-primary)',
                borderBottom: '1px solid var(--line)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = opt.value === value ? 'var(--accent-soft)' : 'transparent'}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FetchLoading = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', color: '#94a3b8', fontSize: 12 }}>
    <div className="ie-spinner" /> Loading {label}…
  </div>
);

export const FetchError = ({ message }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', color: '#ef4444', fontSize: 12 }}>
    <LuCircleAlert size={14} /> {message}
  </div>
);

export const Section = ({ icon, title, sub, children, open, onToggle, className = "" }) => {
  return (
    <div className={`editor-card ${open ? 'open' : ''} ${className}`}>
      <div className="accordion-head" onClick={onToggle}>
        <div className="accordion-icon">{icon}</div>
        <div className="accordion-title">
          {title}
          {sub && <span className="accordion-sub">{sub}</span>}
        </div>
        <span className="chevron" style={{ display: 'flex' }}>
          <LuChevronDown size={18} />
        </span>
      </div>
      <div className="accordion-body">
        {children}
      </div>
    </div>
  );
};

export const Label = ({ children, required }) => (
  <label>
    {children}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
  </label>
);

export const Field = ({ label, required, children, fullWidth }) => (
  <div className={`editor-field ${fullWidth ? 'full' : ''}`}>
    {label && <Label required={required}>{label}</Label>}
    {children}
  </div>
);
