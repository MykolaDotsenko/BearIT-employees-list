import { availabilityLabel, getInitials } from "../domain/people.js";

export default function EmployeeCard({ person, pinned, onTogglePinned, onEdit }) {
  const status = availabilityLabel(person.availability);

  function handlePointerMove(event) {
    if (event.pointerType !== "mouse") return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.setProperty("--tilt-y", `${(x - 0.5) * 10}deg`);
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 8}deg`);
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
          {onEdit && (
            <button
              className="manage-button"
              type="button"
              aria-label={"Edit " + person.name}
              onClick={() => onEdit(person)}
            >
              <span aria-hidden="true">✎</span>
              <span>Edit</span>
            </button>
          )}

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
