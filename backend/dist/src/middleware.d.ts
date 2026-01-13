import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { IUser } from '../db/models';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export declare function generateToken(userId: string): string;
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function validate(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateQuery(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
export declare function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void;
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=middleware.d.ts.map