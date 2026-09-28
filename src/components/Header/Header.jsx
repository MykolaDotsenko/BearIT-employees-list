import "./Header.css";

export default function Header({ onAddPerson }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="#main" aria-label="PeopleLens home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>
            <strong>PeopleLens</strong>
            <small>PeopleOps signal board</small>
          </span>
        </a>

        <div className="header-actions">
          <span className="demo-badge">Local workspace</span>
          <button className="header-add-button" type="button" onClick={onAddPerson}>
            <span aria-hidden="true">+</span>
            Add person
          </button>
        </div>
      </div>
    </header>
  );
}
