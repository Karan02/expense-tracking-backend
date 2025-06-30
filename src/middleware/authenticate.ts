import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  
  const user = req.headers['x-user'] as string;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  req.body.user = JSON.parse(user); // simulate auth
  next();
};