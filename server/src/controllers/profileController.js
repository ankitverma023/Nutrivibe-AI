
import User from '../models/User.js';

// Get the logged-in user's profile
export const getProfile = async (req, res, next) => {
  try {
    const selectFields =
      'name email age gender height weight activityLevel fitnessGoal customCalorieGoal customProteinGoal customCarbsGoal customFatGoal customWaterGoal dietaryPreference medicalCondition createdAt';

    const user = await User.findById(req.user.id).select(selectFields);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update the logged-in user's profile
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'age',
      'gender',
      'height',
      'weight',
      'activityLevel',
      'fitnessGoal',
      'customCalorieGoal',
      'customProteinGoal',
      'customCarbsGoal',
      'customFatGoal',
      'customWaterGoal',
      'dietaryPreference',
      'medicalCondition',
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one profile field to update.',
      });
    }

    const selectFields =
      'name email age gender height weight activityLevel fitnessGoal customCalorieGoal customProteinGoal customCarbsGoal customFatGoal customWaterGoal dietaryPreference medicalCondition createdAt';

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select(selectFields);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
