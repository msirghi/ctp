import { sign } from 'jsonwebtoken';
import { Response } from 'express';
import { UserDocument } from 'src/modules/users/schema/users.schema';

const generateToken = (userId: number) => {
  try {
    const emailToken = sign(
      {
        user: userId
      },
      process.env.EMAIL_TOKEN_SECRET!,
      {
        expiresIn: '1d'
      }
    );
    return emailToken;
  } catch (e) {
    throw Error(e);
  }
};

const createAccessToken = (user: UserDocument) => {
  return sign({ userId: user._id, role: user.role, usname: user.username }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '7d'
  });
};

const createRefreshToken = (user: UserDocument) => {
  return sign({ userId: user._id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d'
  });
};

const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, { httpOnly: true });
};

export default {
  generateToken,
  createAccessToken,
  createRefreshToken,
  sendRefreshToken
};
