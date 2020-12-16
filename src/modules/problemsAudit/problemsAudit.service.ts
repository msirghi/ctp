import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PROBLEM_AUDIT_ACTION } from 'src/common/enums';
import { ProblemAudit, ProblemAuditDocument } from './schema/problemsAudit.schema';

@Injectable()
export class ProblemsAuditService {
  constructor(@InjectModel(ProblemAudit.name) private problemAuditModel: Model<ProblemAuditDocument>) {}

  async trackAction(problemId: string, userId: string, action: PROBLEM_AUDIT_ACTION) {
    this.problemAuditModel.findOneAndRemove({ $and: [{ $and: [{ userId }] }, { $and: [{ problemId }] }] }).exec(() => {
      const newAction = new this.problemAuditModel();
      newAction.problemId = problemId;
      newAction.userId = userId;
      newAction.action = action;
      return newAction.save();
    });
  }

  async getLastUserActionByProblemId(problemId: string, userId: string) {
    return this.problemAuditModel.findOne({ $and: [{ $and: [{ userId }] }, { $and: [{ problemId }] }] });
  }

  async getActionsByUser(userId: string) {
    return this.problemAuditModel.find({ userId });
  }

  async removeLastUserActionByProblem(problemId: string, userId: string) {
    return this.problemAuditModel.findOneAndRemove({ $and: [{ $and: [{ userId }] }, { $and: [{ problemId }] }] });
  }
}
