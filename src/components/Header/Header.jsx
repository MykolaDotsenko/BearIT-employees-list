import "./Header.css";

export default function Header({ onAddPerson }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-cluster">
          <button
            className="brand-add"
            type="button"
            onClick={onAddPerson}
            aria-label="Add person"
            title="Add person"
          >
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
          </button>

          <a className="brand brand-copy" href="#main" aria-label="PeopleLens home">
            <span>
              <strong>PeopleLens</strong>
              <small>PeopleOps signal board</small>
            </span>
          </a>
        </div>

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
