import FamilyTreeCanvas from './components/FamilyTreeCanvas';
import { introContent } from './data/familyTree';

function App() {
  return (
    <div className="page-shell">
      <main className="page">
        <section className="intro-card">
          <p className="eyebrow">{introContent.eyebrow}</p>
          <h1>{introContent.title}</h1>
          <p className="intro-card__lead">{introContent.lead}</p>

          <div className="intro-card__actions">
            <a className="button button--primary" href="#map">
              Открыть карту героев
            </a>
          </div>
        </section>

        <FamilyTreeCanvas />
      </main>
    </div>
  );
}

export default App;
