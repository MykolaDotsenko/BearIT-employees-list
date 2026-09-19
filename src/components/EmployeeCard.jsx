import { availabilityLabel, getInitials } from "../domain/people.js";

export default function EmployeeCard({ person, pinned, onTogglePinned }) {
  const status = availabilityLabel(person.availability);
  const shortlistLabel = pinned
    ? "Remove " + person.name + " from shortlist"
    : "Add " + person.name + " to shortlist";

  return (
    <article className="person-card">
      <div className="person-card-top">
        <div className="avatar" aria-hidden="true">
          {getInitials(person.name)}
        </div>

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
