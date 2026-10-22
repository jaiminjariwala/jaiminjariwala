// Exact critically damped spring integration: no frame-count-based easing,
// no bounce at the parked stop, and continuous velocity when released.
export const PAPER_MOTION = {
  followFrequency: 32,
  landingFrequency: 10.5,
  positionEpsilon: .08,
  velocityEpsilon: .5,
};

export function stepPaperSpring(position, velocity, target, seconds, dragging = false) {
  const dt = Math.max(0, Math.min(seconds, 1 / 24));
  const omega = dragging ? PAPER_MOTION.followFrequency : PAPER_MOTION.landingFrequency;
  const offset = position - target;
  const momentum = velocity + omega * offset;
  const decay = Math.exp(-omega * dt);
  return {
    position: target + (offset + momentum * dt) * decay,
    velocity: (velocity - omega * momentum * dt) * decay,
  };
}

export function isPaperSettled(position, velocity, target) {
  return Math.abs(position - target) < PAPER_MOTION.positionEpsilon &&
    Math.abs(velocity) < PAPER_MOTION.velocityEpsilon;
}

// Commit after a quarter of the full travel in either direction. Before
// release, the pointer still owns the target all the way to either stop.
export function paperReleaseOpens(wasOpen, intent, closed, opened) {
  const progress = Math.max(0, Math.min(1, (closed - intent) / (closed - opened)));
  return wasOpen ? progress > .75 : progress >= .25;
}
