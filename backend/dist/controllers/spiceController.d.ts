import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const create: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSpice: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addReview: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateReviewFeatured: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=spiceController.d.ts.map