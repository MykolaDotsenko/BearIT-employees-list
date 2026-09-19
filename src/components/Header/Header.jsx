import styled from "styled-components";

const Shell = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(8, 17, 31, 0.82);
  backdrop-filter: blur(18px);
`;

const Inner = styled.div`
  width: min(1180px, calc(100% - 2rem));
  min-height: 72px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Mark = styled.span`
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: linear-gradient(135deg, #67e8f9, #818cf8);
  color: #07111f;
  font-weight: 900;
`;

export default function Header() {
  return (
    <Shell>
      <Inner>
        <a className="brand" href="#main" aria-label="PeopleLens home">
          <Mark>PL</Mark>
          <span>
            <strong>PeopleLens</strong>
            <small>PeopleOps signal board</small>
          </span>
        </a>
        <span className="demo-badge">Fictional demo data</span>
      </Inner>
    </Shell>
  );
}
