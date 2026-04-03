import { addStep, finalize } from './utils.js';

/**
 * Optimal page replacement using future knowledge.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const optimal = (pages, frameSize) => {
  const frames = [];
  const steps = [];
  let hits = 0;

  pages.forEach((page, index) => {
    const hit = frames.includes(page);
    if (hit) {
      hits += 1;
      steps.push(addStep(index, page, frames, true));
      return;
    }

    let replaced;
    if (frames.length < frameSize) {
      frames.push(page);
    } else {
      let farthest = -1;
      let victimIndex = -1;
      frames.forEach((framePage, frameIdx) => {
        const nextUse = pages.slice(index + 1).indexOf(framePage);
        const distance = nextUse === -1 ? Infinity : nextUse;
        if (distance > farthest) {
          farthest = distance;
          victimIndex = frameIdx;
        }
      });
      replaced = frames[victimIndex];
      frames[victimIndex] = page;
    }
    steps.push(addStep(index, page, frames, false, replaced));
  });

  return finalize(steps, hits, pages.length);
};
