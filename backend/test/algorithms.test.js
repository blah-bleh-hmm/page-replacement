import { fifo } from '../src/algorithms/fifo.js';
import { lru } from '../src/algorithms/lru.js';
import { lruApproximation } from '../src/algorithms/lruApproximation.js';
import { optimal } from '../src/algorithms/optimal.js';
import { secondChance } from '../src/algorithms/secondChance.js';
import { countingBased } from '../src/algorithms/countingBased.js';
import { basicRandom } from '../src/algorithms/basic.js';

const pages = [1, 2, 1, 3, 1];
const frameSize = 2;

const expectedSummaries = {
  fifo: { faults: 4, hits: 1, hitRatio: 0.2 },
  lru: { faults: 3, hits: 2, hitRatio: 0.4 },
  lruApproximation: { faults: 3, hits: 2, hitRatio: 0.4 },
  optimal: { faults: 3, hits: 2, hitRatio: 0.4 },
  secondChance: { faults: 4, hits: 1, hitRatio: 0.2 },
  countingBased: { faults: 3, hits: 2, hitRatio: 0.4 },
  basicRandom: { faults: 4, hits: 1, hitRatio: 0.2 },
};

describe('Page replacement algorithms', () => {
  let originalRandom;

  beforeAll(() => {
    originalRandom = Math.random;
    Math.random = () => 0; // deterministic basicRandom output
  });

  afterAll(() => {
    Math.random = originalRandom;
  });

  test.each([
    ['fifo', fifo],
    ['lru', lru],
    ['lruApproximation', lruApproximation],
    ['optimal', optimal],
    ['secondChance', secondChance],
    ['countingBased', countingBased],
    ['basicRandom', basicRandom],
  ])('%s produces expected summary and steps', (key, fn) => {
    const result = fn(pages, frameSize);

    expect(result.summary).toEqual(expectedSummaries[key]);
    expect(result.steps).toHaveLength(pages.length);
    result.steps.forEach((step, index) => {
      expect(step.index).toBe(index);
      expect(step.frames.length).toBeLessThanOrEqual(frameSize);
      expect(step.page).toBe(pages[index]);
    });
  });
});
