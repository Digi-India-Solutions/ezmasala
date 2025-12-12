import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const create: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAll: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const exportOrders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateInvoice: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=orderController.d.ts.map