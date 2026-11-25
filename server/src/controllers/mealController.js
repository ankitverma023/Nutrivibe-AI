
import mongoose from 'mongoose';
import Meal from '../models/Meal.js';

export async function createMeal(req, res, next) {
  try {
    const { name, category, calories, protein, carbs, fat, consumedAt } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meal name is required',
      });
    }

    if (
      calories === undefined ||
      calories === null ||
      calories === '' ||
      !Number.isFinite(Number(calories)) ||
      Number(calories) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Calories must be a non-negative number',
      });
    }

    // Safely normalize category
    let cleanCategory = 'Other';
    if (category) {
      const c = String(category).trim().toLowerCase();
      if (c.includes('break')) cleanCategory = 'Breakfast';
      else if (c.includes('lunch')) cleanCategory = 'Lunch';
      else if (c.includes('din')) cleanCategory = 'Dinner';
      else if (c.includes('snack')) cleanCategory = 'Snack';
      else cleanCategory = 'Other';
    }

    const meal = await Meal.create({
      user: req.user.id,
      name: name.trim(),
      category: cleanCategory,
      calories: Math.max(0, Math.round(Number(calories))),
      protein: Math.max(0, Math.round(Number(protein) || 0)),
      carbs: Math.max(0, Math.round(Number(carbs) || 0)),
      fat: Math.max(0, Math.round(Number(fat) || 0)),
      consumedAt: consumedAt ? new Date(consumedAt) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMeals(req, res, next) {
  try {
    const { date } = req.query;

    const filter = {
      user: req.user.id,
    };

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);

      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date. Use YYYY-MM-DD.',
        });
      }

      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      filter.consumedAt = {
        $gte: start,
        $lt: end,
      };
    }

    const meals = await Meal.find(filter).sort({
      consumedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMealById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID',
      });
    }

    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMeal(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID',
      });
    }

    const allowedFields = [
      'name',
      'category',
      'calories',
      'protein',
      'carbs',
      'fat',
      'consumedAt',
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name !== undefined && !updates.name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meal name cannot be empty',
      });
    }

    for (const field of ['calories', 'protein', 'carbs', 'fat']) {
      if (updates[field] !== undefined) {
        const value = Number(updates[field]);

        if (
          updates[field] === '' ||
          !Number.isFinite(value) ||
          value < 0
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-negative number`,
          });
        }

        updates[field] = value;
      }
    }

    const meal = await Meal.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMeal(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID',
      });
    }

    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
