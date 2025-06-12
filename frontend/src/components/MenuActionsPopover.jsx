import { useRef, useState, useEffect } from "react";

export default function MenuActionsPopover({ onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef();

  // Ferme le popover si on clique en dehors
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
    <div className="menu-actions-popover" ref={popoverRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        className="btn btn-secondary"
        style={{ fontSize: "1.5em", padding: "0 0.5em", lineHeight: "1" }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Actions"
        type="button"
      >
        &#8942;
      </button>
      {open && (
        <div
          className="popover-menu"
          style={{
            position: "absolute",
            right: 0,
            top: "2.2em",
            background: "#fff",
            border: "1px solid #ececec",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(100,108,255,0.07)",
            zIndex: 100,
            minWidth: "120px",
            padding: "0.5em 0"
          }}
        >
          <button
            className="btn btn-danger"
            style={{ width: "100%", marginBottom: "0.5em" }}
            onClick={onDelete}
            type="button"
          >
            Supprimer
          </button>
          <button
            className="btn btn-warn"
            style={{ width: "100%" }}
            onClick={onEdit}
            type="button"
          >
            Modifier
          </button>
        </div>
      )}
    </div>
  );
}