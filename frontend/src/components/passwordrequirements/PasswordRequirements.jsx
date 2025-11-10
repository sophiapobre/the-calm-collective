import React from 'react';
import './PasswordRequirements.css';

export function getPasswordRequirements(password) {
  return {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

export default function PasswordRequirements({ requirements }) {
  return (
    <div className="password-requirements mb-3">
      <h6 className="mb-2">
        Your password must contain:
      </h6>
      <Requirement label="At least 12 characters" isMet={requirements.length} />
      <Requirement label="An uppercase letter" isMet={requirements.uppercase} />
      <Requirement label="A number" isMet={requirements.number} />
      <Requirement label="A symbol" isMet={requirements.symbol} />
    </div>
  );
}

function Requirement({ label, isMet }) {
  return (
    <div className={`requirement-item d-flex align-items-center mb-2 ${isMet ? 'requirement-met' : 'requirement-unmet'}`}>
      {isMet ? (
        <i className="bi bi-check-circle-fill me-2"></i>
      ) : (
        <i className="bi bi-x-circle me-2"></i>
      )}
      <span>{label}</span>
    </div>
  );
}