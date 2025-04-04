import mongoose, { Schema, Document } from 'mongoose';

export interface IInteraction extends Document {
  user: mongoose.Types.ObjectId;
  video: mongoose.Types.ObjectId;
  isLiked: boolean;
  isFavorited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const interactionSchema = new Schema<IInteraction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isFavorited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 添加复合唯一索引
interactionSchema.index({ user: 1, video: 1 }, { unique: true });

// 添加索引
interactionSchema.index({ video: 1, isLiked: 1 });
interactionSchema.index({ video: 1, isFavorited: 1 });
interactionSchema.index({ user: 1, isFavorited: 1 });

export const Interaction = mongoose.model<IInteraction>('Interaction', interactionSchema);
