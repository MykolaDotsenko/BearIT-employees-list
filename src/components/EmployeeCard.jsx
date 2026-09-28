import { useEffect, useRef, useState } from "react";

import { availabilityLabel, getInitials } from "../domain/people.js";

export default function EmployeeCard({
  person,
  pinned,
  onTogglePinned,
  onEdit,
  onRequestRemove,
}) {
  const status = availabilityLabel(person.availability);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuRef.current?.querySelector(".profile-menu-trigger")?.focus();
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

      const items = [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])];
      if (items.length === 0) return;

      event.preventDefault();
      const currentIndex = items.indexOf(document.activeElement);

      if (event.key === "Home") {
        items[0].focus();
      } else if (event.key === "End") {
        items.at(-1).focus();
      } else if (event.key === "ArrowDown") {
        items[(currentIndex + 1 + items.length) % items.length].focus();
      } else if (event.key === "ArrowUp") {
        items[(currentIndex - 1 + items.length) % items.length].focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function handlePointerMove(event) {
    if (event.pointerType !== "mouse") return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`);
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 6}deg`);
    card.style.setProperty("--glow-x", `${x * 100}%`);
    card.style.setProperty("--glow-y", `${y * 100}%`);
  }

  function handlePointerLeave(event) {
    const card = event.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "15%");
  }

  const shortlistLabel = pinned
    ? "Remove " + person.name + " from shortlist"
    : "Add " + person.name + " to shortlist";

  return (
    <article
      className="person-card"
      data-team={person.team.toLowerCase()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="person-card-top">
        <div className="avatar" aria-hidden="true">
          {getInitials(person.name)}
        </div>

        <div className="person-card-actions">
          <button
            className="pin-button"
            type="button"
            aria-pressed={pinned}
            aria-label={shortlistLabel}
            onClick={() => onTogglePinned(person.id)}
          >
            <span aria-hidden="true">{pinned ? "★" : "☆"}</span>
            <span>{pinned ? "Shortlisted" : "Shortlist"}</span>
          </button>

          <div className="profile-menu" ref={menuRef}>
            <button
              className="profile-menu-trigger"
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={"Actions for " + person.name}
              onClick={() => {
                setMenuOpen((open) => {
                  const next = !open;
                  if (next) {
                    window.setTimeout(
                      () => menuRef.current?.querySelector('[role="menuitem"]')?.focus(),
                      0,
                    );
                  }
                  return next;
                });
              }}
            >
              <span aria-hidden="true">⋯</span>
            </button>

            {menuOpen && (
              <div className="profile-menu-popover" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(person);
                  }}
                >
                  <span aria-hidden="true">✎</span>
                  Edit profile
                </button>
                <button
                  className="profile-menu-danger"
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onRequestRemove(person);
                  }}
                >
                  <span aria-hidden="true">−</span>
                  Remove from directory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="person-heading">
        <div>
          <h3>{person.name}</h3>
          <p>{person.role}</p>
        </div>
        <span className={"status status-" + person.availability}>
          <span className="status-dot" aria-hidden="true" />
          {status}
        </span>
      </div>

      <dl className="person-meta">
        <div>
          <dt>Team</dt>
          <dd>{person.team}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{person.location}</dd>
        </div>
        <div>
          <dt>Work mode</dt>
          <dd>{person.workMode}</dd>
        </div>
      </dl>

      <div className="capacity-row">
        <div>
          <span>Near-term capacity</span>
          <strong>{person.capacity}%</strong>
        </div>
        <meter
          min="0"
          max="100"
          value={person.capacity}
          aria-label={person.name + " capacity " + person.capacity + "%"}
        >
          {person.capacity}%
        </meter>
      </div>

      <ul className="skill-list" aria-label={person.name + " skills"}>
        {person.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </article>
  );
}
