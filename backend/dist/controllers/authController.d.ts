import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
export declare const createAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const adminLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const adminLogout: (req: Request, res: Response) => Promise<void>;
export declare const sendSignupOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifySignupOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resendSignupOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userSignup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userLogout: (req: Request, res: Response) => Promise<void>;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
export declare const forgotPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyResetOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resendResetOTP: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authController.d.ts.map