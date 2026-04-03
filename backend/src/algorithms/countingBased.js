import { addStep, finalize } from './utils.js';

/**
 * Counting-based (LFU-like) replacement that breaks ties by recency.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const countingBased = (pages, frameSize) => {
  const frames = [];
  const counts = new Map();
  const recent = new Map();
  const steps = [];
  let hits = 0;

  pages.forEach((page, index) => {
    const hit = frames.includes(page);
    if (hit) {
      hits += 1;
      counts.set(page, (counts.get(page) || 0) + 1);
      recent.set(page, index);
      steps.push(addStep(index, page, frames, true));
      return;
    }

    let replaced;
    if (frames.length < frameSize) {
      frames.push(page);
    } else {
      let victim = frames[0];
      frames.forEach((p) => {
        const freq = counts.get(p) || 0;
        const bestFreq = counts.get(victim) || 0;
        if (freq < bestFreq) {
          victim = p;
        } else if (freq === bestFreq) {
          const lastUse = recent.get(p) ?? -1;
          const victimUse = recent.get(victim) ?? -1;
          if (lastUse < victimUse) {
            victim = p;
          }
        }
      });
      replaced = victim;
      const idx = frames.indexOf(victim);
      frames[idx] = page;
    }
    counts.set(page, (counts.get(page) || 0) + 1);
    recent.set(page, index);
    steps.push(addStep(index, page, frames, false, replaced));
  });

  return finalize(steps, hits, pages.length);
};
