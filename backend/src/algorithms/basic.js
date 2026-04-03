/**
 * Basic random replacement algorithm.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
import { addStep, finalize } from './utils.js';


/**
 * Basic random replacement algorithm.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const basicRandom = (pages, frameSize) => {
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
      const slot = Math.floor(Math.random() * frameSize);
      replaced = frames[slot];
      frames[slot] = page;
    }
    steps.push(addStep(index, page, frames, false, replaced));
  });

  return finalize(steps, hits, pages.length);
};
