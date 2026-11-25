import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    // Stored as YYYY-MM-DD
    date: {
      type: String,
      required: [true, 'Date string (YYYY-MM-DD) is required'],
      index: true,
    },
    glasses: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 50,
    },
    targetGlasses: {
      type: Number,
      default: 8,
      min: 1,
      max: 50,
    },
    amountMl: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One water log per user per calendar date
waterLogSchema.index({ user: 1, date: 1 }, { unique: true });

// Auto-sync amountMl before saving (250ml per standard glass)
waterLogSchema.pre('save', function (next) {
  this.amountMl = (this.glasses || 0) * 250;
  next();
});

const WaterLog = mongoose.model('WaterLog', waterLogSchema);

export default WaterLog;
