import mongoose, { Document } from 'mongoose';
export interface IContact extends Document {
    name: string;
    email: string;
    mobile?: string;
    city?: string;
    queryType?: string;
    message: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IContact, {}, {}, {}, mongoose.Document<unknown, {}, IContact, {}, {}> & IContact & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Contact.d.ts.map