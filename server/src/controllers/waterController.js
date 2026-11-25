import WaterLog from '../models/WaterLog.js';
import User from '../models/User.js';

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get water log for a specific date
export async function getWater(req, res, next) {
  try {
    const date = req.query.date || getTodayString();

    let waterLog = await WaterLog.findOne({
      user: req.user.id,
      date,
    });

    if (!waterLog) {
      // Find user custom target or default to 8
      const user = await User.findById(req.user.id).select('customWaterGoal');
      const targetGlasses = user?.customWaterGoal || 8;

      return res.status(200).json({
        success: true,
        data: {
          date,
          glasses: 0,
          targetGlasses,
          amountMl: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: waterLog,
    });
  } catch (error) {
    next(error);
  }
}

// Update or set exact water glasses
export async function updateWater(req, res, next) {
  try {
    const { date = getTodayString(), glasses, targetGlasses } = req.body;

    if (glasses === undefined || glasses === null || Number(glasses) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Glasses must be a non-negative number',
      });
    }

    const numGlasses = Math.min(50, Math.max(0, Number(glasses)));
    const amountMl = numGlasses * 250;

    const updateData = {
      glasses: numGlasses,
      amountMl,
    };

    if (targetGlasses && Number(targetGlasses) > 0) {
      updateData.targetGlasses = Number(targetGlasses);
    }

    const waterLog = await WaterLog.findOneAndUpdate(
      { user: req.user.id, date },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Water intake updated successfully',
      data: waterLog,
    });
  } catch (error) {
    next(error);
  }
}

// Increment water by 1 glass
export async function addGlass(req, res, next) {
  try {
    const { date = getTodayString() } = req.body;

    let waterLog = await WaterLog.findOne({ user: req.user.id, date });
    const currentGlasses = waterLog ? waterLog.glasses : 0;
    const nextGlasses = Math.min(50, currentGlasses + 1);

    const updated = await WaterLog.findOneAndUpdate(
      { user: req.user.id, date },
      {
        $set: {
          glasses: nextGlasses,
          amountMl: nextGlasses * 250,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Added 1 glass of water',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

// Reset water count for date
export async function resetWater(req, res, next) {
  try {
    const { date = getTodayString() } = req.body;

    const updated = await WaterLog.findOneAndUpdate(
      { user: req.user.id, date },
      {
        $set: {
          glasses: 0,
          amountMl: 0,
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Water tracker reset for the day',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
