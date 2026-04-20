import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { usersRepository } from '../repositories/users';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const signupSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少8位'),
  confirmPassword: z.string().min(8, '确认密码至少8位'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const validated = signupSchema.parse(req.body);
    const existing = await usersRepository.findByEmail(validated.email);
    if (existing) {
      return res.status(400).json({ success: false, message: '该邮箱已被注册' });
    }
    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const user = await usersRepository.create({
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: '注册失败，请稍后重试' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const user = await usersRepository.findByEmail(validated.email);
    if (!user) {
      return res.status(401).json({ success: false, message: '邮箱或密码错误' });
    }
    const isValid = await bcrypt.compare(validated.password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: '邮箱或密码错误' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: '登录失败，请稍后重试' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const user = await usersRepository.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    return res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar, role: user.role, createdAt: user.createdAt },
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ success: false, message: '获取用户信息失败' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(1).max(100).optional(),
      bio: z.string().max(500).optional(),
      avatar: z.string().url().optional().or(z.literal('')),
    });
    const validated = updateSchema.parse(req.body);
    const user = await usersRepository.update(req.user!.id, validated);
    return res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error('Profile update error:', error);
    return res.status(500).json({ success: false, message: '更新失败，请稍后重试' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1, '请输入当前密码'),
      newPassword: z.string().min(8, '新密码至少8位'),
      confirmNewPassword: z.string().min(8),
    }).refine((d) => d.newPassword === d.confirmNewPassword, {
      message: '两次新密码不一致',
      path: ['confirmNewPassword'],
    });
    const validated = schema.parse(req.body);
    const user = await usersRepository.findById(req.user!.id);
    if (!user) return res.status(404).json({ success: false, message: '用户不存在' });
    const isValid = await bcrypt.compare(validated.currentPassword, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: '当前密码错误' });
    const hashed = await bcrypt.hash(validated.newPassword, 12);
    await usersRepository.update(req.user!.id, { password: hashed });
    return res.json({ success: true, data: null, message: '密码修改成功' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    return res.status(500).json({ success: false, message: '修改密码失败' });
  }
});

export default router;
