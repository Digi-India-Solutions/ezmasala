"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ContactInfoSchema = new mongoose_1.Schema({
    companyName: {
        type: String,
        required: true,
        default: 'Shine Exports (India)'
    },
    tagline: {
        type: String,
        default: 'Makers of EZ Masala J & EZ Masala M'
    },
    email: {
        type: String,
        required: true,
        default: 'info@ezmasalaa.com'
    },
    phone: {
        type: String,
        required: true,
        default: '+91-XXXXXXXXXX'
    },
    whatsapp: {
        type: String,
        default: '+91-XXXXXXXXXX'
    },
    address: {
        type: String,
        required: true,
        default: 'B1-236, Naraina Industrial Area, Phase-I'
    },
    city: {
        type: String,
        required: true,
        default: 'New Delhi'
    },
    state: {
        type: String,
        required: true,
        default: 'Delhi'
    },
    pincode: {
        type: String,
        required: true,
        default: '110028'
    },
    country: {
        type: String,
        default: 'India'
    },
    businessHours: {
        type: String,
        required: true,
        default: 'Mon – Sat, 10:00 AM to 6:00 PM (IST)'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
ContactInfoSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.default = mongoose_1.default.model('ContactInfo', ContactInfoSchema);
//# sourceMappingURL=ContactInfo.js.map