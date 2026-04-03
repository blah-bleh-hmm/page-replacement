import { addStep, finalize } from './utils.js';

/**
 * Second Chance (Clock) replacement algorithm.
 * @param {number[]} pages - Sequence of page references.
 * @param {number} frameSize - Number of available frames.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const secondChance = (pages, frameSize) => {
  const queue = [];
  const steps = [];
  let hits = 0;

  pages.forEach((page, index) => {
    const existing = queue.find((entry) => entry.page === page);
    if (existing) {
      hits += 1;
      existing.ref = 1;
      steps.push(
        addStep(
          index,
          page,
          queue.map((q) => q.page),
          true,
        ),
      );
      return;
    }

    let replaced;
    if (queue.length < frameSize) {
      queue.push({ page, ref: 1 });
    } else {
      while (true) {
        const candidate = queue.shift();
        if (candidate.ref === 0) {
          replaced = candidate.page;
          queue.push({ page, ref: 1 });
          break;
        }
        candidate.ref = 0;
        queue.push(candidate);
      }
    }
    steps.push(
      addStep(
        index,
        page,
        queue.map((q) => q.page),
        false,
        replaced,
      ),
    );
  });

  return finalize(steps, hits, pages.length);
};
