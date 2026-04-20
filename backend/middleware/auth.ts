import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string; role: string };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未授权，请先登录' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; name: string; role: string };
    req.user = { id: decoded.userId, email: decoded.email, name: decoded.name, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ success: false, message: '令牌无效或已过期' });
  }
};
