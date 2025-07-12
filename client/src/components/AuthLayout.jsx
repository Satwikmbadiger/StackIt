import React from "react";
import "../pages/Login.css"; // Ensures shared styles are loaded

/**
 * Reusable two-column auth layout for Login/Register.
 * Props:
 *   - title: string (main heading)
 *   - subtitle: string (subheading)
 *   - children: form elements
 *   - illustrationAlt: alt text for illustration
 *   - illustrationSrc: image url for right panel
 *   - belowForm: node (optional, below the form)
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  illustrationAlt,
  illustrationSrc,
  belowForm
}) {
  return (
    <div className="auth-split">
      <div className="auth-left">
        <div className="auth-logo">StackIt</div>
        <h1 className="auth-title">{title}</h1>
        <div className="auth-subtitle">{subtitle}</div>
        <div className="auth-form">{children}</div>
        {belowForm && <div className="auth-link-row">{belowForm}</div>}
      </div>
      <div className="auth-right">
        <img src={illustrationSrc} alt={illustrationAlt} className="auth-illustration" />
      </div>
    </div>
  );
}
