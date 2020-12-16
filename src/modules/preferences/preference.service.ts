import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INTERFACE_TYPE } from 'src/common/enums';
import ErrorConstants from 'src/constants/error.constants';
import { InterfaceTypeDTO } from './dto/interfaceType.dto';
import { LanguageDTO } from './dto/language.dto';
import { PreferenceDTO } from './dto/preference.dto';
import { Preference, PreferenceDocument } from './schema/preference.schema';

@Injectable()
export class PreferenceService {
  constructor(@InjectModel(Preference.name) private readonly preferenceModel: Model<PreferenceDocument>) {}

  async initializePreferences(userId: string, dto: PreferenceDTO): Promise<PreferenceDocument> {
    const existingPrefs = await this.preferenceModel.findOne({ userId });

    if (existingPrefs) {
      throw new HttpException(ErrorConstants.PREFERENCES_ALREADY_INIT, HttpStatus.BAD_REQUEST);
    }

    const prefs = new this.preferenceModel(dto);
    prefs.userId = userId;
    prefs.interfaceType = dto.interfaceType === INTERFACE_TYPE.DARK ? INTERFACE_TYPE.DARK : INTERFACE_TYPE.LIGHT;
    return prefs.save();
  }

  async getUserPreferences(userId: string): Promise<PreferenceDocument> {
    const existingPrefs = await this.preferenceModel.findOne({ userId });

    if (!existingPrefs) {
      throw new HttpException(ErrorConstants.PREFERENCES_NOT_INIT, HttpStatus.BAD_REQUEST);
    }
    return existingPrefs;
  }

  async updateLanguage(userId: string, { language }: LanguageDTO) {
    await this.preferenceModel.findOneAndUpdate({ userId }, { language }, (err, _) => {
      if (err) {
        throw new HttpException(ErrorConstants.PREFERENCES_NOT_INIT, HttpStatus.BAD_REQUEST);
      }
    });
  }

  async updateInterfaceMode(userId: string, { type }: InterfaceTypeDTO) {
    await this.preferenceModel.findOneAndUpdate(
      { userId },
      { interfaceType: type === INTERFACE_TYPE.DARK ? INTERFACE_TYPE.DARK : INTERFACE_TYPE.LIGHT },
      (err, _) => {
        if (err) {
          throw new HttpException(ErrorConstants.PREFERENCES_NOT_INIT, HttpStatus.BAD_REQUEST);
        }
      }
    );
  }
}
