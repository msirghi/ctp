import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PROBLEM_AUDIT_ACTION } from 'src/common/enums';

export type ProblemAuditDocument = ProblemAudit & Document;

@Schema()
export class ProblemAudit {
  @Prop({ required: true, minlength: 3 })
  problemId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: PROBLEM_AUDIT_ACTION })
  action: PROBLEM_AUDIT_ACTION;

  @Prop({ required: true, default: new Date() })
  createatAt: Date;
}

export const ProblemAuditSchema = SchemaFactory.createForClass(ProblemAudit);
