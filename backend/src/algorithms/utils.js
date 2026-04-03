/**
 * Records a single simulation step.
 * @param {number} index - Position in the reference string.
 * @param {number} page - Referenced page number.
 * @param {number[]} frames - Current frame contents.
 * @param {boolean} hit - Whether the page hit an existing frame.
 * @param {number|undefined} [replaced] - Page that was evicted, if any.
 * @returns {{index:number,page:number,frames:number[],hit:boolean,fault:boolean,replaced:number|undefined}}
 */
export const addStep = (index, page, frames, hit, replaced) => ({
  index,
  page,
  frames: [...frames],
  hit,
  fault: !hit,
  replaced,
});

/**
 * Finalizes a simulation by summarizing hit/fault metrics.
 * @param {object[]} steps - Ordered simulation steps.
 * @param {number} hits - Total page hits.
 * @param {number} total - Total page references processed.
 * @returns {{steps: object[], summary: {faults:number, hits:number, hitRatio:number}}}
 */
export const finalize = (steps, hits, total) => ({
  steps,
  summary: {
    faults: total - hits,
    hits,
    hitRatio: total ? Number((hits / total).toFixed(3)) : 0,
  },
});
