import { useEffect, useId, useRef, useState } from "react";
import "./PersonDialog.css";

const emptyPerson = {
  name: "",
  role: "",
  team: "Engineering",
  location: "",
  workMode: "Hybrid",
  availability: "available",
  capacity: 50,
  skills: "",
};

function toFormValue(person) {
  if (!person) return emptyPerson;

  return {
    name: person.name,
    role: person.role,
    team: person.team,
    location: person.location,
    workMode: person.workMode,
    availability: person.availability,
    capacity: person.capacity,
    skills: person.skills.join(", "),
  };
}

export default function PersonDialog({ person, onClose, onSave }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);
  const [form, setForm] = useState(() => toFormValue(person));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => firstInputRef.current?.focus(), 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const isEditing = Boolean(person);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.role.trim()) next.role = "Role is required.";
    if (!form.team.trim()) next.team = "Team is required.";
    if (!form.location.trim()) next.location = "Location is required.";

    const skills = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) next.skills = "Add at least one skill.";
    if (skills.length > 12) next.skills = "Use at most 12 skills.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      ...(person ?? {}),
      name: form.name.trim(),
      role: form.role.trim(),
      team: form.team.trim(),
      location: form.location.trim(),
      workMode: form.workMode,
      availability: form.availability,
      capacity: Number(form.capacity),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        ref={dialogRef}
        className="person-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="dialog-glow" aria-hidden="true" />

        <header className="dialog-header">
          <div>
            <p className="eyebrow">{isEditing ? "Manage profile" : "PeopleOps workflow"}</p>
            <h2 id={titleId}>{isEditing ? "Edit person" : "Add person"}</h2>
            <p id={descriptionId}>
              {isEditing
                ? "Update this locally managed profile."
                : "Create a profile that immediately joins the directory, filters and capacity signals."}
            </p>
          </div>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>

        <form className="person-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="dialog-field">
              <span>Name</span>
              <input
                ref={firstInputRef}
                name="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>

            <label className="dialog-field">
              <span>Role</span>
              <input
                name="role"
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                autoComplete="off"
                aria-invalid={Boolean(errors.role)}
              />
              {errors.role && <small className="field-error">{errors.role}</small>}
            </label>

            <label className="dialog-field">
              <span>Team</span>
              <input
                name="team"
                value={form.team}
                onChange={(event) => updateField("team", event.target.value)}
                list="people-lens-teams"
                autoComplete="off"
                aria-invalid={Boolean(errors.team)}
              />
              <datalist id="people-lens-teams">
                <option value="Engineering" />
                <option value="Design" />
                <option value="Data" />
                <option value="Product" />
                <option value="Operations" />
              </datalist>
              {errors.team && <small className="field-error">{errors.team}</small>}
            </label>

            <label className="dialog-field">
              <span>Location</span>
              <input
                name="location"
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                autoComplete="off"
                aria-invalid={Boolean(errors.location)}
              />
              {errors.location && <small className="field-error">{errors.location}</small>}
            </label>

            <label className="dialog-field">
              <span>Work mode</span>
              <select
                name="workMode"
                value={form.workMode}
                onChange={(event) => updateField("workMode", event.target.value)}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </label>

            <label className="dialog-field">
              <span>Status</span>
              <select
                name="availability"
                value={form.availability}
                onChange={(event) => updateField("availability", event.target.value)}
              >
                <option value="available">Available</option>
                <option value="focused">Focused</option>
                <option value="away">Away</option>
              </select>
            </label>

            <label className="dialog-field dialog-field-wide">
              <span className="capacity-label">
                <span>Near-term capacity</span>
                <strong>{form.capacity}%</strong>
              </span>
              <input
                className="capacity-slider"
                name="capacity"
                type="range"
                min="0"
                max="100"
                step="1"
                value={form.capacity}
                onChange={(event) => updateField("capacity", event.target.value)}
              />
            </label>

            <label className="dialog-field dialog-field-wide">
              <span>Skills</span>
              <input
                name="skills"
                value={form.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                placeholder="React, TypeScript, Accessibility"
                autoComplete="off"
                aria-invalid={Boolean(errors.skills)}
              />
              <small className={errors.skills ? "field-error" : "field-hint"}>
                {errors.skills ?? "Separate skills with commas."}
              </small>
            </label>
          </div>

          <footer className="dialog-actions">
            <div className="dialog-actions-primary">
              <button className="secondary-button" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="primary-button" type="submit">
                <span aria-hidden="true">{isEditing ? "✓" : "+"}</span>
                {isEditing ? "Save changes" : "Add to directory"}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
