import { suspectPollConfig } from '../data/familyTree';

function SuspectPoll() {
  return (
    <section className="poll-section" id="suspect-poll">
      <div className="poll-card">
        <div className="poll-card__header">
          <div className="poll-card__copy">
            <h2>{suspectPollConfig.title}</h2>
            <p>{suspectPollConfig.description}</p>
          </div>

          <a
            className="poll-toggle"
            href={suspectPollConfig.formUrl}
            target="_blank"
            rel="noreferrer"
          >
            Открыть опрос
          </a>


        </div>
      </div>
    </section>
  );
}

export default SuspectPoll;
