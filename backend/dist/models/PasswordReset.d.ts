import mongoose, { Document } from 'mongoose';
export interface IPasswordReset extends Document {
    email: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
}
declare const _default: mongoose.Model<IPasswordReset, {}, {}, {}, mongoose.Document<unknown, {}, IPasswordReset, {}, {}> & IPasswordReset & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=PasswordReset.d.ts.map