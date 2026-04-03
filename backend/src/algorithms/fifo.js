import { addStep, finalize } from './utils.js';

/**
 * First-In First-Out page replacement.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const fifo = (pages, frameSize) => {
  const frames = [];
  const steps = [];
  let pointer = 0;
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
      replaced = frames[pointer];
      frames[pointer] = page;
      pointer = (pointer + 1) % frameSize;
    }
    steps.push(addStep(index, page, frames, false, replaced));
  });

  return finalize(steps, hits, pages.length);
};
