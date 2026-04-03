import { addStep, finalize } from './utils.js';

/**
 * Least Recently Used replacement policy.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const lru = (pages, frameSize) => {
  const frames = [];
  const lastUsed = new Map();
  const steps = [];
  let hits = 0;

  pages.forEach((page, index) => {
    const hit = frames.includes(page);
    if (hit) {
      hits += 1;
      lastUsed.set(page, index);
      steps.push(addStep(index, page, frames, true));
      return;
    }

    let replaced;
    if (frames.length < frameSize) {
      frames.push(page);
    } else {
      let lruPage = frames[0];
      let lruTime = lastUsed.get(lruPage) ?? -1;
      frames.forEach((p) => {
        const time = lastUsed.get(p) ?? -1;
        if (time < lruTime) {
          lruPage = p;
          lruTime = time;
        }
      });
      replaced = lruPage;
      const idx = frames.indexOf(lruPage);
      frames[idx] = page;
    }
    lastUsed.set(page, index);
    steps.push(addStep(index, page, frames, false, replaced));
  });

  return finalize(steps, hits, pages.length);
};
