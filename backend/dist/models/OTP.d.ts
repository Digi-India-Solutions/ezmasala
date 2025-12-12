import mongoose, { Document } from 'mongoose';
export interface IOTP extends Document {
    email: string;
    otp: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt: Date;
    expiresAt: Date;
}
declare const _default: mongoose.Model<IOTP, {}, {}, {}, mongoose.Document<unknown, {}, IOTP, {}, {}> & IOTP & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=OTP.d.ts.map