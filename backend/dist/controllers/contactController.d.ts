import { Request, Response } from 'express';
export declare const getAll: (req: Request, res: Response) => Promise<void>;
export declare const getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=contactController.d.ts.map