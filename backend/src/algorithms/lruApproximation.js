import { HIGH_BIT } from '../config/constants.js';
import { addStep, finalize } from './utils.js';

/**
 * Aging-based LRU approximation using shifting reference counters.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const lruApproximation = (pages, frameSize) => {
  const frames = [];
  const counters = [];
  const steps = [];
  let hits = 0;

  pages.forEach((page, index) => {
    for (let i = 0; i < counters.length; i += 1) {
      counters[i] = counters[i] >> 1;
    }

    const frameIndex = frames.indexOf(page);
    if (frameIndex !== -1) {
      hits += 1;
      counters[frameIndex] = counters[frameIndex] | HIGH_BIT;
      steps.push(addStep(index, page, frames, true));
      return;
    }

    let replaced;
    if (frames.length < frameSize) {
      frames.push(page);
      counters.push(HIGH_BIT);
    } else {
      let victimIdx = 0;
      let minCounter = counters[0];
      for (let i = 1; i < counters.length; i += 1) {
        if (counters[i] < minCounter) {
          minCounter = counters[i];
          victimIdx = i;
        }
      }
      replaced = frames[victimIdx];
      frames[victimIdx] = page;
      counters[victimIdx] = HIGH_BIT;
    }
    steps.push(addStep(index, page, frames, false, replaced));
  });

  return finalize(steps, hits, pages.length);
};
