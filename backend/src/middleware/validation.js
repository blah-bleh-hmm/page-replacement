import { availableAlgorithmKeys } from '../algorithms/registry.js';

const MAX_FRAME_SIZE = 5000;
const MAX_REFERENCE_LENGTH = 10000;
const DUPLICATE_RATIO_ALERT = 0.9;

/**
 * Validates simulation input and normalizes payload for downstream handlers.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateSimulationInput = (req, res, next) => {
  const {
    frameSize,
    pages,
    algorithms: selectedAlgorithms,
    save,
  } = req.body || {};

  if (!Number.isInteger(frameSize) || frameSize <= 0) {
    return res
      .status(400)
      .json({ message: 'Frame size must be a positive integer' });
  }

  if (frameSize > MAX_FRAME_SIZE) {
    return res.status(400).json({
      message: `Frame size is too large. Maximum supported frame size is ${MAX_FRAME_SIZE}.`,
    });
  }

  if (!Array.isArray(pages) || pages.length === 0) {
    return res
      .status(400)
      .json({ message: 'Provide at least one page reference' });
  }

  const parsedPages = pages.map((p) => Number(p));
  if (parsedPages.some((p) => !Number.isFinite(p))) {
    return res
      .status(400)
      .json({ message: 'Page reference string must contain only numbers' });
  }

  if (parsedPages.length > MAX_REFERENCE_LENGTH) {
    return res.status(400).json({
      message: `Reference string is too long (max ${MAX_REFERENCE_LENGTH} pages). Try paginating or trimming the input.`,
    });
  }

  const uniquePages = new Set(parsedPages);
  const duplicateRatio =
    parsedPages.length > 0
      ? (parsedPages.length - uniquePages.size) / parsedPages.length
      : 0;

  if (duplicateRatio >= DUPLICATE_RATIO_ALERT) {
    const duplicatePercent = Math.round(duplicateRatio * 100);
    return res.status(400).json({
      message: `Reference string contains too many duplicate pages (${duplicatePercent}% duplicates). Reduce repetition to continue.`,
    });
  }

  if (uniquePages.size > 0 && frameSize > uniquePages.size) {
    return res.status(400).json({
      message:
        'Frame size cannot exceed the number of unique pages in the reference string.',
    });
  }

  const targets =
    Array.isArray(selectedAlgorithms) && selectedAlgorithms.length > 0
      ? selectedAlgorithms
      : availableAlgorithmKeys;

  const invalid = targets.filter(
    (key) => !availableAlgorithmKeys.includes(key),
  );
  if (invalid.length) {
    return res
      .status(400)
      .json({ message: `Unsupported algorithms: ${invalid.join(', ')}` });
  }

  req.simulationInput = {
    frameSize,
    pages: parsedPages,
    targets,
    save: save !== false,
    duplicateRatio,
  };

  return next();
};
