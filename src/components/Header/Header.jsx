import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="#main" aria-label="PeopleLens home">
          <span className="brand-mark" aria-hidden="true">
            PL
          </span>
          <span>
            <strong>PeopleLens</strong>
            <small>PeopleOps signal board</small>
          </span>
        </a>
        <span className="demo-badge">Fictional demo data</span>
      </div>
    </header>
  );
}
