import { useEffect, useId, useRef } from "react";
import "./RemovePersonDialog.css";

export default function RemovePersonDialog({ person, onClose, onConfirm }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="remove-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="remove-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <span className="remove-signal" aria-hidden="true">−</span>
        <div>
          <p className="eyebrow">Directory action</p>
          <h2 id={titleId}>Remove {person.name}?</h2>
          <p>
            This removes the profile from this browser workspace. You can add the
            person again later if needed.
          </p>
        </div>

        <div className="remove-actions">
          <button ref={cancelRef} className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="danger-button danger-confirm" type="button" onClick={() => onConfirm(person.id)}>
            Remove from directory
          </button>
        </div>
      </section>
    </div>
  );
}
