
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },

    // Personal profile details
    age: {
      type: Number,
      min: 13,
      max: 100,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },

    // Body measurements
    height: {
      type: Number,
      min: 50,
      max: 250,
    },

    weight: {
      type: Number,
      min: 20,
      max: 500,
    },

    // Daily activity level
    activityLevel: {
      type: String,
      enum: [
        'sedentary',
        'light',
        'moderate',
        'active',
        'very_active',
      ],
      default: 'moderate',
    },

    // Fitness goal
    fitnessGoal: {
      type: String,
      enum: [
        'weight_loss',
        'maintenance',
        'weight_gain',
      ],
      default: 'maintenance',
    },

    // Custom nutrition targets (optional overrides)
    customCalorieGoal: {
      type: Number,
      min: 500,
      max: 10000,
      default: null,
    },

    customProteinGoal: {
      type: Number,
      min: 0,
      max: 500,
      default: null,
    },

    customCarbsGoal: {
      type: Number,
      min: 0,
      max: 1000,
      default: null,
    },

    customFatGoal: {
      type: Number,
      min: 0,
      max: 500,
      default: null,
    },

    customWaterGoal: {
      type: Number,
      min: 1,
      max: 30,
      default: 8,
    },

    dietaryPreference: {
      type: String,
      enum: ['standard', 'vegetarian', 'vegan', 'keto', 'high_protein'],
      default: 'standard',
    },

    // Medical Condition & Life Stage
    medicalCondition: {
      type: String,
      enum: [
        'none',
        'pregnancy',
        'lactation',
        'diabetes',
        'hypertension',
        'pcos',
        'cholesterol',
        'thyroid',
      ],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
