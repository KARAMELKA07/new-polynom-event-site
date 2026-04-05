import { useEffect, useMemo, useRef, useState } from 'react';
import CharacterModal from './CharacterModal';
import {
  familyNodes,
  mapFramePaths,
  mapStory,
  STAGE_SIZE,
} from '../data/familyTree';

const MIN_SCALE = 0.24;
const MAX_SCALE = 2;
const LABEL_HEIGHT = 48;
const LABEL_GAP = 10;
// Tune the initial map view here.
const INITIAL_VIEW = {
  scaleMultiplier: 2.1,
  offsetX: 0,
  offsetY: 18,
};
// Tune the moving wallpaper texture here.
const TEXTURE_LAYER = {
  tileWidth: 360,
  offsetX: 0,
  offsetY: 0,
  moveRatioX: 1,
  moveRatioY: 1,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderLines(text, keyPrefix) {
  return text.split('\n').map((line, index) => (
    <span key={`${keyPrefix}-${index}`}>{line}</span>
  ));
}

function getInitialTransform(viewportWidth, viewportHeight) {
  const fittedScale = clamp(
    Math.min(
      (viewportWidth - 24) / STAGE_SIZE.width,
      (viewportHeight - 24) / STAGE_SIZE.height,
    ),
    MIN_SCALE,
    1,
  );
  const initialScale = clamp(
    fittedScale * INITIAL_VIEW.scaleMultiplier,
    MIN_SCALE,
    MAX_SCALE,
  );

  return {
    scale: initialScale,
    x:
      (viewportWidth - STAGE_SIZE.width * initialScale) / 2 +
      INITIAL_VIEW.offsetX,
    y:
      (viewportHeight - STAGE_SIZE.height * initialScale) / 2 +
      INITIAL_VIEW.offsetY,
  };
}

function FamilyTreeCanvas() {
  const viewportRef = useRef(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [textureOffset, setTextureOffset] = useState({
    x: TEXTURE_LAYER.offsetX,
    y: TEXTURE_LAYER.offsetY,
  });
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startTransform: { x: 0, y: 0 },
    startTextureOffset: { x: TEXTURE_LAYER.offsetX, y: TEXTURE_LAYER.offsetY },
  });
  const touchRef = useRef({
    mode: null,
    startDistance: 0,
    startScale: 1,
    contentPoint: { x: 0, y: 0 },
    startTransform: { x: 0, y: 0 },
    startTouch: { x: 0, y: 0 },
    startTextureOffset: { x: TEXTURE_LAYER.offsetX, y: TEXTURE_LAYER.offsetY },
  });
  const ignoreClickRef = useRef(false);

  const selectedNode = useMemo(
    () => familyNodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId],
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    const setInitialTransform = () => {
      const viewportWidth = viewport.clientWidth;
      const viewportHeight = viewport.clientHeight;
      setTransform(getInitialTransform(viewportWidth, viewportHeight));
      setTextureOffset({
        x: TEXTURE_LAYER.offsetX,
        y: TEXTURE_LAYER.offsetY,
      });
    };

    setInitialTransform();

    const resizeObserver = new ResizeObserver(() => {
      setInitialTransform();
    });

    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const setScaleAroundPoint = (nextScale, pointX, pointY) => {
    setTransform((current) => {
      const limitedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      const contentX = (pointX - current.x) / current.scale;
      const contentY = (pointY - current.y) / current.scale;

      return {
        scale: limitedScale,
        x: pointX - contentX * limitedScale,
        y: pointY - contentY * limitedScale,
      };
    });
  };

  const handleReset = () => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    setTransform(getInitialTransform(viewport.clientWidth, viewport.clientHeight));
    setTextureOffset({
      x: TEXTURE_LAYER.offsetX,
      y: TEXTURE_LAYER.offsetY,
    });
  };

  const handleZoom = (direction) => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    setScaleAroundPoint(
      transform.scale * (direction > 0 ? 1.16 : 0.86),
      viewport.clientWidth / 2,
      viewport.clientHeight / 2,
    );
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch') {
      return;
    }

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTransform: { x: transform.x, y: transform.y },
      startTextureOffset: { x: textureOffset.x, y: textureOffset.y },
    };

    ignoreClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const dragState = dragRef.current;

    if (!dragState.active || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      ignoreClickRef.current = true;
    }

    setTransform((current) => ({
      ...current,
      x: dragState.startTransform.x + deltaX,
      y: dragState.startTransform.y + deltaY,
    }));
    setTextureOffset({
      x:
        dragState.startTextureOffset.x + deltaX * TEXTURE_LAYER.moveRatioX,
      y:
        dragState.startTextureOffset.y + deltaY * TEXTURE_LAYER.moveRatioY,
    });
  };

  const handlePointerUp = (event) => {
    const dragState = dragRef.current;

    if (dragState.pointerId === event.pointerId) {
      dragRef.current.active = false;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();

    const rect = viewportRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setScaleAroundPoint(
      transform.scale * (event.deltaY < 0 ? 1.1 : 0.92),
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  };

  const getDistance = (touchA, touchB) =>
    Math.hypot(touchA.clientX - touchB.clientX, touchA.clientY - touchB.clientY);

  const getMidpoint = (touchA, touchB, rect) => ({
    x: (touchA.clientX + touchB.clientX) / 2 - rect.left,
    y: (touchA.clientY + touchB.clientY) / 2 - rect.top,
  });

  const handleTouchStart = (event) => {
    const rect = viewportRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    if (event.touches.length === 2) {
      const [firstTouch, secondTouch] = event.touches;
      const midpoint = getMidpoint(firstTouch, secondTouch, rect);

      touchRef.current = {
        mode: 'pinch',
        startDistance: getDistance(firstTouch, secondTouch),
        startScale: transform.scale,
        contentPoint: {
          x: (midpoint.x - transform.x) / transform.scale,
          y: (midpoint.y - transform.y) / transform.scale,
        },
      };

      ignoreClickRef.current = true;
      return;
    }

    if (event.touches.length === 1) {
      const [touch] = event.touches;

      touchRef.current = {
        mode: 'drag',
        startTouch: { x: touch.clientX, y: touch.clientY },
        startTransform: { x: transform.x, y: transform.y },
        startTextureOffset: { x: textureOffset.x, y: textureOffset.y },
      };

      ignoreClickRef.current = false;
    }
  };

  const handleTouchMove = (event) => {
    const rect = viewportRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    if (touchRef.current.mode === 'pinch' && event.touches.length === 2) {
      event.preventDefault();

      const [firstTouch, secondTouch] = event.touches;
      const nextDistance = getDistance(firstTouch, secondTouch);
      const nextMidpoint = getMidpoint(firstTouch, secondTouch, rect);
      const nextScale = clamp(
        touchRef.current.startScale *
          (nextDistance / touchRef.current.startDistance),
        MIN_SCALE,
        MAX_SCALE,
      );

      setTransform({
        scale: nextScale,
        x: nextMidpoint.x - touchRef.current.contentPoint.x * nextScale,
        y: nextMidpoint.y - touchRef.current.contentPoint.y * nextScale,
      });

      return;
    }

    if (touchRef.current.mode === 'drag' && event.touches.length === 1) {
      const [touch] = event.touches;
      const deltaX = touch.clientX - touchRef.current.startTouch.x;
      const deltaY = touch.clientY - touchRef.current.startTouch.y;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        ignoreClickRef.current = true;
      }

      setTransform((current) => ({
        ...current,
        x: touchRef.current.startTransform.x + deltaX,
        y: touchRef.current.startTransform.y + deltaY,
      }));
      setTextureOffset({
        x:
          touchRef.current.startTextureOffset.x +
          deltaX * TEXTURE_LAYER.moveRatioX,
        y:
          touchRef.current.startTextureOffset.y +
          deltaY * TEXTURE_LAYER.moveRatioY,
      });
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length === 0) {
      touchRef.current.mode = null;
      return;
    }

    if (event.touches.length === 1) {
      const [touch] = event.touches;

      touchRef.current = {
        mode: 'drag',
        startTouch: { x: touch.clientX, y: touch.clientY },
        startTransform: { x: transform.x, y: transform.y },
        startTextureOffset: { x: textureOffset.x, y: textureOffset.y },
      };
    }
  };

  return (
    <>
      <section className="map-section" id="map">
        <div className="map-card">
          <div className="map-toolbar">
            <div className="map-tip">
              Все герои теперь собраны по одному шаблону: роль, круг под фото,
              имя и короткое описание. Круги остались кликабельными, а тексты и
              имена можно менять прямо в данных карты.
            </div>

            <div className="map-controls">
              <button type="button" onClick={() => handleZoom(1)} aria-label="Приблизить">
                +
              </button>
              <button type="button" onClick={() => handleZoom(-1)} aria-label="Отдалить">
                -
              </button>
              <button type="button" onClick={handleReset}>
                Сброс
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            className="map-viewport"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="map-texture"
              aria-hidden="true"
              style={{
                backgroundPosition: `0 0, ${textureOffset.x}px ${textureOffset.y}px`,
                backgroundSize: `auto, ${TEXTURE_LAYER.tileWidth}px auto`,
              }}
            />

            <div
              className="map-stage"
              style={{
                width: `${STAGE_SIZE.width}px`,
                height: `${STAGE_SIZE.height}px`,
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              }}
            >
              <svg
                className="map-frame"
                viewBox={`0 0 ${STAGE_SIZE.width} ${STAGE_SIZE.height}`}
                aria-hidden="true"
              >
                {mapFramePaths.map((path) => (
                  <path key={path.id} d={path.d} />
                ))}
              </svg>

              <div className="map-story">
                <h2>{renderLines(mapStory.title, 'story-title')}</h2>
                <p>{mapStory.description}</p>
              </div>

              {familyNodes.map((node) => {
                const circleStyle = node.photo
                  ? { backgroundImage: `url(${node.photo})` }
                  : undefined;

                return (
                  <article
                    key={node.id}
                    className="map-character"
                    style={{
                      left: `${node.left + node.size / 2}px`,
                      top: `${node.top - LABEL_HEIGHT - LABEL_GAP}px`,
                      width: `${node.cardWidth}px`,
                    }}
                  >
                    <p className="map-character__label">
                      {renderLines(node.label, `${node.id}-label`)}
                    </p>

                    <button
                      type="button"
                      className={`map-node accent-${node.accent}${node.photo ? ' has-photo' : ''}`}
                      style={{
                        width: `${node.size}px`,
                        height: `${node.size}px`,
                        ...circleStyle,
                      }}
                      onClick={() => {
                        if (ignoreClickRef.current) {
                          return;
                        }

                        setSelectedNodeId(node.id);
                      }}
                      aria-label={`Открыть карточку героя ${node.name.replace(/\n/g, ' ')}`}
                    />

                    <h3 className="map-character__name">
                      {renderLines(node.name, `${node.id}-name`)}
                    </h3>

                    <p className="map-character__summary">
                      {renderLines(node.summary, `${node.id}-summary`)}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CharacterModal
        character={selectedNode}
        onClose={() => setSelectedNodeId(null)}
      />
    </>
  );
}

export default FamilyTreeCanvas;
