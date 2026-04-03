import { basicRandom } from './basic.js';
import { countingBased } from './countingBased.js';
import { fifo } from './fifo.js';
import { lru } from './lru.js';
import { lruApproximation } from './lruApproximation.js';
import { optimal } from './optimal.js';
import { secondChance } from './secondChance.js';

export const algorithms = {
  basic: { label: 'Basic (Random)', fn: basicRandom },
  fifo: { label: 'FIFO', fn: fifo },
  optimal: { label: 'Optimal', fn: optimal },
  lru: { label: 'LRU', fn: lru },
  lruApprox: { label: 'LRU Approximation', fn: lruApproximation },
  secondChance: { label: 'Second Chance', fn: secondChance },
  counting: { label: 'Counting-Based (LFU)', fn: countingBased },
};

export const availableAlgorithmKeys = Object.keys(algorithms);
