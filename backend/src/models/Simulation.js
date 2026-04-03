import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema(
  {
    index: Number,
    page: Number,
    frames: [Number],
    hit: Boolean,
    fault: Boolean,
    replaced: Number,
  },
  { _id: false },
);

const summarySchema = new mongoose.Schema(
  {
    faults: Number,
    hits: Number,
    hitRatio: Number,
  },
  { _id: false },
);

const runSchema = new mongoose.Schema(
  {
    algorithm: String,
    steps: [stepSchema],
    summary: summarySchema,
  },
  { _id: false },
);

const simulationSchema = new mongoose.Schema(
  {
    frameSize: { type: Number, required: true },
    pages: { type: [Number], required: true },
    algorithms: [String],
    runs: [runSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'simulations' },
);

export default mongoose.model('Simulation', simulationSchema);
