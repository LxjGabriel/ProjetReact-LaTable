import { useRef, useState, useEffect } from "react";

export default function MenuActionsPopover({ onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={popoverRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Actions"
        style={{
          width: "28px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          color: "var(--color-text-muted)",
          fontSize: "1rem",
          lineHeight: "1",
          transition: "background 0.15s, border-color 0.15s",
          padding: 0,
        }}
        onMouseOver={e => { e.currentTarget.style.background = "var(--color-bg)"; e.currentTarget.style.borderColor = "var(--color-border-hover)"; }}
        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
      >
        &#8942;
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 200,
            minWidth: "130px",
            padding: "0.375rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <button
            type="button"
            onClick={() => { onEdit(); setOpen(false); }}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              textAlign: "left",
              background: "transparent",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "var(--color-text)",
              cursor: "pointer",
              transition: "background 0.1s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "var(--color-bg)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={() => { onDelete(); setOpen(false); }}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              textAlign: "left",
              background: "transparent",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "var(--color-danger)",
              cursor: "pointer",
              transition: "background 0.1s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "var(--color-danger-bg)"}
            onMouseOut={e => e.currentTarget.style.background = "transparent"}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
