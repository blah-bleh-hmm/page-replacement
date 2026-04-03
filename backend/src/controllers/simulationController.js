import Simulation from '../models/Simulation.js';
import { algorithms, availableAlgorithmKeys } from '../algorithms/registry.js';
import config from '../config/index.js';
import { isDbConnected } from '../config/db.js';

const memoryHistory = [];
const MAX_SAFE_FRAME_SIZE = 5000;
const MAX_DUPLICATE_RATIO = 0.9;

/**
 * Lists available algorithms with labels.
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export const listAlgorithms = (_req, res) => {
  const list = availableAlgorithmKeys.map((key) => ({
    key,
    label: algorithms[key].label,
  }));
  res.json({ algorithms: list });
};

/**
 * Runs selected algorithms for a given reference string.
 * Expects validated input from validation middleware.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const runSimulation = async (req, res, next) => {
  try {
    const { frameSize, pages, targets, save, duplicateRatio } =
      req.simulationInput;

    if (frameSize > MAX_SAFE_FRAME_SIZE) {
      return res.status(400).json({
        message: `Frame size exceeds supported maximum (${MAX_SAFE_FRAME_SIZE}). Reduce frame size to continue.`,
      });
    }

    const computedDuplicateRatio = (() => {
      if (typeof duplicateRatio === 'number') return duplicateRatio;
      const unique = new Set(pages);
      return pages.length === 0
        ? 0
        : (pages.length - unique.size) / pages.length;
    })();

    if (computedDuplicateRatio >= MAX_DUPLICATE_RATIO) {
      const duplicatePercent = Math.round(computedDuplicateRatio * 100);
      return res.status(400).json({
        message: `Reference string contains too many duplicate pages (${duplicatePercent}% duplicates). Reduce repetition to continue.`,
      });
    }

    const runs = targets.map((key) => {
      const { fn, label } = algorithms[key];
      const result = fn(pages, frameSize);
      return {
        key,
        algorithm: label,
        steps: result.steps,
        summary: result.summary,
      };
    });

    const record = {
      frameSize,
      pages,
      algorithms: targets,
      runs,
      createdAt: new Date(),
    };

    let saved = false;
    if (save && config.ALLOW_SAVE_HISTORY) {
      if (isDbConnected()) {
        await Simulation.create(record);
        saved = true;
      } else {
        memoryHistory.unshift(record);
        if (memoryHistory.length > config.MAX_HISTORY) {
          memoryHistory.pop();
        }
        saved = true;
      }
    }

    return res.json({ runs, saved });
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieves the simulation history from MongoDB or in-memory fallback.
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getHistory = async (_req, res, next) => {
  try {
    if (isDbConnected()) {
      const items = await Simulation.find()
        .sort({ createdAt: -1 })
        .limit(config.MAX_HISTORY)
        .lean();
      return res.json({ items });
    }
    return res.json({ items: memoryHistory });
  } catch (error) {
    return next(error);
  }
};
