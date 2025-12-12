interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<boolean>;
export declare const generateOTP: () => string;
export declare const getPasswordResetOTPTemplate: (otp: string, name: string) => string;
export declare const getOTPEmailTemplate: (otp: string, name: string) => string;
export declare const getContactFormEmailTemplate: (contact: {
    name: string;
    email: string;
    mobile?: string;
    city?: string;
    queryType?: string;
    message: string;
}) => string;
export declare const getOrderNotificationTemplate: (order: any, customerName: string) => string;
export declare const getOrderConfirmationTemplate: (order: any, customerName: string) => string;
export {};
//# sourceMappingURL=email.d.ts.map