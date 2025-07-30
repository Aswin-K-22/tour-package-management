
import { ERRORMESSAGES } from '@/domain/constants/errorMessages.constant';
import { IAdminRepository } from '@/domain/repositories/admin-repository';
import { ITokenService } from '@/domain/services/ITokenService';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    admin?: { email: string; id: string };
  }
}


export class AuthMiddleware {
 constructor(
    private adminRepository: IAdminRepository,
    private tokenService: ITokenService,
  ) {}



 async adminAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        res.status(401).json({ message: ERRORMESSAGES.ADMIN_NO_ACCESS_TOKEN_PROVIDED  });
        return;
      }

      const decoded = await this.tokenService.verifyAccessToken(accessToken);
      const user = await this.adminRepository.findById(decoded.id);
      if (!user) {
        res.status(401).json({ message: ERRORMESSAGES.ADMIN_NOT_FOUND });
        return;
      }

      if (user.role !== 'admin') {
        res.status(401).json({ message: ERRORMESSAGES.ADMIN_INVALID_ROLE  });
        return;
      }

      req.admin = { id: user.id, email: user.email };
      next();
    } catch (error) {
        res.status(401).json({ message: ERRORMESSAGES.ADMIN_NO_ACCESS_TOKEN_PROVIDED  });

    }
  }
}