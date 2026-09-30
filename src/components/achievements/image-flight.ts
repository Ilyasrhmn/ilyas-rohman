export type ImageFlight = {
  finished: Promise<void>;
  cancel: () => void;
};

type ImageFlightInput = {
  src: string;
  from: DOMRect;
  to: DOMRect;
  durationMs: number;
};

function canAnimateRect(rect: DOMRect) {
  return rect.width > 0 && rect.height > 0;
}

export function flyCertificateImage({ src, from, to, durationMs }: ImageFlightInput): ImageFlight {
  if (!canAnimateRect(from) || !canAnimateRect(to) || typeof document === "undefined") {
    return { finished: Promise.resolve(), cancel: () => undefined };
  }

  const clone = document.createElement("div");
  clone.dataset.certificateFlight = "";
  clone.setAttribute("aria-hidden", "true");
  clone.style.cssText = [
    "position:fixed",
    "z-index:80",
    "pointer-events:none",
    `left:${to.left}px`,
    `top:${to.top}px`,
    `width:${to.width}px`,
    `height:${to.height}px`,
    "overflow:hidden",
    "background:var(--world-b-surface)",
    "will-change:transform,opacity",
    "transform-origin:top left",
  ].join(";");

  const image = document.createElement("img");
  image.src = src;
  image.alt = "";
  image.style.cssText = "width:100%;height:100%;object-fit:contain;display:block";
  clone.append(image);
  document.body.append(clone);

  const scaleX = from.width / to.width;
  const scaleY = from.height / to.height;
  const translateX = from.left - to.left;
  const translateY = from.top - to.top;
  const animation = clone.animate(
    [
      { transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`, opacity: 1 },
      { transform: "translate(0, 0) scale(1, 1)", opacity: 1 },
    ],
    { duration: durationMs, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" }
  );

  let removed = false;
  const remove = () => {
    if (removed) return;
    removed = true;
    clone.remove();
  };

  return {
    finished: animation.finished.catch(() => undefined).then(remove),
    cancel: () => {
      animation.cancel();
      remove();
    },
  };
}
