import { Request, Response } from 'express';
export declare const getAll: (req: Request, res: Response) => Promise<void>;
export declare const getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const create: (req: Request, res: Response) => Promise<void>;
export declare const update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteVideo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=videoController.d.ts.map