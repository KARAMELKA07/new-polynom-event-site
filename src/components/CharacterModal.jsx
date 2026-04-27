import { useEffect } from 'react';

function CharacterModal({ character, onClose }) {
  useEffect(() => {
    if (!character) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [character, onClose]);

  if (!character) {
    return null;
  }

  const initials = character.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const modalPhoto = character.modalPhoto ?? character.photo;
  const cardStyle = modalPhoto
    ? { '--modal-photo': `url(${modalPhoto})` }
    : undefined;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal-card${modalPhoto ? ' has-modal-photo' : ''}`}
        style={cardStyle}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${character.id}`}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Закрыть карточку"
        >
          ×
        </button>

        {!modalPhoto ? <div className="modal-initials">{initials}</div> : null}

        <div className="modal-content">
          <p className={`modal-label${character.modalLabelMultiline ? ' is-multiline' : ''}`}>
            {character.label}
          </p>
          <h2 id={`modal-title-${character.id}`} className="modal-title">
            {character.name}
          </h2>
          <p className="modal-description">{character.modalText}</p>
        </div>

        <div className="modal-facts">
          {character.facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CharacterModal;
