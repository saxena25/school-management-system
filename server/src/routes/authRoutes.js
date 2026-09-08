import { Router } from 'express';
import { User } from '../models/User.js';
import { protect, signToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { fail, ok } from '../utils/helpers.js';

const router = Router();

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+password'
    );

    if (!user || !(await user.comparePassword(password))) {
      return fail(res, 'Invalid email or password', 401);
    }

    if (user.status !== 'Active') {
      return fail(res, 'Account is inactive', 403);
    }

    const token = signToken(user);
    return ok(res, { token, user: user.toSafeJSON() });
  })
);

router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    return ok(res, { user: req.user.toSafeJSON() });
  })
);

router.patch(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const allowed = ['name', 'phone', 'address', 'bio', 'department', 'avatar'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) req.user[key] = req.body[key];
    }
    await req.user.save();
    return ok(res, { user: req.user.toSafeJSON() });
  })
);

export default router;
