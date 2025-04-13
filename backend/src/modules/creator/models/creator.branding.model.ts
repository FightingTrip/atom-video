/**
 * 创作者品牌设置模型
 */
import { Schema, model, Document, Types } from 'mongoose';

export interface ICreatorBranding extends Document {
  creatorId: Types.ObjectId;
  watermark: {
    url: string;
    position: string;
    opacity: number;
    size: number;
  };
  intro: {
    url: string;
    autoAdd: boolean;
    transition: string;
  };
  outro: {
    url: string;
    autoAdd: boolean;
    transition: string;
    addSubscribeButton: boolean;
  };
  theme: {
    color: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const CreatorBrandingSchema = new Schema<ICreatorBranding>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    watermark: {
      url: { type: String },
      position: {
        type: String,
        enum: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
        default: 'bottomRight',
      },
      opacity: { type: Number, min: 0, max: 100, default: 70 },
      size: { type: Number, min: 5, max: 30, default: 15 },
    },
    intro: {
      url: { type: String },
      autoAdd: { type: Boolean, default: true },
      transition: {
        type: String,
        enum: ['fade', 'slide', 'zoom', 'none'],
        default: 'fade',
      },
    },
    outro: {
      url: { type: String },
      autoAdd: { type: Boolean, default: true },
      transition: {
        type: String,
        enum: ['fade', 'slide', 'zoom', 'none'],
        default: 'fade',
      },
      addSubscribeButton: { type: Boolean, default: true },
    },
    theme: {
      color: { type: String, default: '58a6ff' },
    },
  },
  {
    timestamps: true,
  }
);

export const CreatorBranding = model<ICreatorBranding>('CreatorBranding', CreatorBrandingSchema);
