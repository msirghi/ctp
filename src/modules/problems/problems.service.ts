import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PROBLEM_AUDIT_ACTION } from 'src/common/enums';
import ErrorConstants from 'src/constants/error.constants';
import { CountryService } from '../countries/countries.service';
import { LocationService } from '../locations/locations.service';
import { ProblemsAuditService } from '../problemsAudit/problemsAudit.service';
import { ProblemDTO } from './dto/problem.dto';
import { Problem, ProblemDocument } from './schema/problems.schema';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectModel(Problem.name) private problemModel: Model<ProblemDocument>,
    private readonly countryService: CountryService,
    private readonly locationService: LocationService,
    private readonly problemAuditService: ProblemsAuditService
  ) {}

  async createProblem(
    countryId: string,
    locationId: string,
    problem: ProblemDTO,
    userId: string
  ): Promise<ProblemDocument> {
    const { name } = problem;
    try {
      if (name.length < 5) {
        throw new HttpException(ErrorConstants.INVALID_PROBLEM_NAME, HttpStatus.BAD_REQUEST);
      }
      await this.countryService.getById(countryId);
      const location = await this.locationService.getLocationById(locationId);
      const newProblem = new this.problemModel(problem);
      newProblem.locationId = location._id;
      newProblem.createatAt = new Date();
      newProblem.creator = userId;
      return newProblem.save();
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message || ErrorConstants.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
  }

  async getById(countryId: string, locationId: string, problemId: string): Promise<ProblemDocument> {
    await this.locationService.getLocationByCountryAndId(countryId, locationId);

    if (isValidObjectId(problemId)) {
      const problem = await this.problemModel.findOne({ _id: problemId });

      if (problem) {
        return problem;
      }
      throw new HttpException(ErrorConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    throw new HttpException(ErrorConstants.INVALID_DATA_SUPPLIED, HttpStatus.BAD_REQUEST);
  }

  async getProblemsByLocation(countryId: string, locationId: string) {
    await this.locationService.getLocationByCountryAndId(countryId, locationId);
    return this.problemModel.find({ locationId }).exec();
  }

  async updateProblem(
    countryId: string,
    locationId: string,
    problemId: string,
    updatedDTO: ProblemDTO,
    userId: string
  ) {
    const { name, description, address } = updatedDTO;
    await this.locationService.getLocationByCountryAndId(countryId, locationId);
    try {
      if (name.length < 5) {
        throw new HttpException(ErrorConstants.INVALID_PROBLEM_NAME, HttpStatus.BAD_REQUEST);
      }
      const problemInDb = await this.problemModel.findOne({ _id: problemId });

      if (!!!problemInDb) {
        throw new HttpException(ErrorConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      if (problemInDb.creator !== userId) {
        throw new HttpException(ErrorConstants.LACK_OF_PERMISSIONS, HttpStatus.BAD_REQUEST);
      }
      problemInDb.name = updatedDTO.name;
      if (description) {
        problemInDb.description = updatedDTO.description;
      }
      if (address) {
        problemInDb.address = address;
      }
      return problemInDb.save();
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message || ErrorConstants.BAD_REQUEST, e.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updateProblemLocation(
    countryId: string,
    locationId: string,
    problemId: string,
    problemDto: ProblemDTO,
    userId: string
  ) {
    await this.locationService.getLocationByCountryAndId(countryId, locationId);
    try {
      const existingProblem = await this.problemModel.findOne({ _id: problemId });
      if (!existingProblem) {
        throw new HttpException(ErrorConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      if (existingProblem.creator !== userId) {
        throw new HttpException(ErrorConstants.LACK_OF_PERMISSIONS, HttpStatus.BAD_REQUEST);
      }

      existingProblem.locationId = problemDto.locationId;
      return existingProblem.save();
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message || ErrorConstants.BAD_REQUEST, e.status);
    }
  }

  async removeProblem(countryId: string, locationId: string, problemId: string, userId: string) {
    await this.locationService.getLocationByCountryAndId(countryId, locationId);
    try {
      const problem = await this.problemModel.findOne({ _id: problemId });
      if (problem.creator !== userId) {
        throw new HttpException(ErrorConstants.LACK_OF_PERMISSIONS, HttpStatus.FORBIDDEN);
      }
      await this.problemModel.deleteOne({ _id: problemId });
      return;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message || ErrorConstants.BAD_REQUEST, e.status);
    }
  }

  async incrementViews(countryId: string, locationId: string, problemId: string) {
    await this.locationService.getLocationByCountryAndId(countryId, locationId);
    return this.problemModel.findOneAndUpdate({ _id: problemId }, { $inc: { views: 1 } }).exec((err, _) => {
      if (err) {
        throw new HttpException(ErrorConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    });
  }

  async thumbUp(userId: string, countryId: string, locationId: string, problemId: string) {
    await this.getById(countryId, locationId, problemId);
    const lastAction = await this.problemAuditService.getLastUserActionByProblemId(problemId, userId);

    if (lastAction && lastAction.action === PROBLEM_AUDIT_ACTION.THUMB_UP) {
      throw new HttpException(ErrorConstants.ALREADY_THUMBED_UP, HttpStatus.BAD_REQUEST);
    }

    if (lastAction && lastAction.action === PROBLEM_AUDIT_ACTION.THUMB_DOWN) {
      await this.problemModel.findOneAndUpdate({ _id: problemId }, { $inc: { thumbsDown: -1, thumbsUp: 1 } });
      await this.problemAuditService.trackAction(problemId, userId, PROBLEM_AUDIT_ACTION.THUMB_UP);
      return;
    }

    await this.problemModel.findOneAndUpdate({ _id: problemId }, { $inc: { thumbsUp: 1 } });
    await this.problemAuditService.trackAction(problemId, userId, PROBLEM_AUDIT_ACTION.THUMB_UP);
  }

  async thumbDown(userId: string, countryId: string, locationId: string, problemId: string) {
    await this.getById(countryId, locationId, problemId);
    const lastAction = await this.problemAuditService.getLastUserActionByProblemId(problemId, userId);

    if (lastAction && lastAction.action === PROBLEM_AUDIT_ACTION.THUMB_DOWN) {
      throw new HttpException(ErrorConstants.ALREADY_THUMBED_DOWN, HttpStatus.BAD_REQUEST);
    }

    if (lastAction && lastAction.action === PROBLEM_AUDIT_ACTION.THUMB_UP) {
      await this.problemModel.findOneAndUpdate({ _id: problemId }, { $inc: { thumbsUp: -1, thumbsDown: 1 } });
      await this.problemAuditService.trackAction(problemId, userId, PROBLEM_AUDIT_ACTION.THUMB_DOWN);
      return;
    }

    await this.problemModel.findOneAndUpdate({ _id: problemId }, { $inc: { thumbsDown: 1 } });
    await this.problemAuditService.trackAction(problemId, userId, PROBLEM_AUDIT_ACTION.THUMB_DOWN);
  }
}
