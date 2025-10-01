// src/types/express/index.d.ts

// Impor tipe User Anda jika ada, atau definisikan di sini
import { UserDTO, UserCreate, UserUpdate } from '../../user/type/user';
import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        user_id: string;
        email: string;
      };
    }
  }
}