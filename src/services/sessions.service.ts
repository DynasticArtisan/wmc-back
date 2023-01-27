import jwt from "jsonwebtoken";
import config from "config";
import Sessions from "../models/sessions.model";
import ApiError from "../exceptions";
import usersServices from "./users.services";
import { Auth } from "../models/users.model";

class SessionsService {
  async createSession(login: string, password: string) {
    const user = await usersServices.authorize(login, password);
    const auth = user.AuthDTO();
    const accessToken = this.generateAccessToken(auth);
    const refreshToken = this.generateRefreshToken(auth);
    const session = await Sessions.findOneAndUpdate(
      { userId: user._id },
      { refreshToken }
    );
    if (!session) {
      await Sessions.create({
        userId: user._id,
        refreshToken,
      });
    }
    return { ...auth, accessToken, refreshToken };
  }

  async updateSession(refreshToken: string) {
    const tokenUser = await this.validateRefreshToken(refreshToken);
    if (!tokenUser) {
      throw ApiError.Forbiden("Невалидный токен");
    }
    const session = await Sessions.findOne({
      userId: tokenUser.userId,
      refreshToken,
    });
    if (!session) {
      throw ApiError.Forbiden("Сессия не найдена");
    }
    const user = await usersServices.getUser(String(session.userId));
    const auth = user.AuthDTO();
    const accessToken = this.generateAccessToken(auth);
    const newRefreshToken = this.generateRefreshToken(auth);

    session.refreshToken = newRefreshToken;
    await session.save();
    return { ...auth, accessToken, newRefreshToken };
  }

  async deleteSession(refreshToken: string) {
    const session = await Sessions.findOneAndDelete({ refreshToken });
    if (!session) {
      throw ApiError.NotFound("Сессия не найдена");
    }
    return true;
  }

  async createRecoverSession(identity: string) {
    const user = await usersServices.identify(identity);
    const auth = user.AuthDTO();
    const resetToken = this.generateResetToken(auth);
    const session = await Sessions.findOneAndUpdate(
      { userId: user._id },
      { resetToken }
    );
    if (!session) {
      await Sessions.create({
        userId: user._id,
        resetToken,
      });
    }
    // send mail with token
    console.log(resetToken);
    return true;
  }

  async useRecoverSession(resetToken: string, password: string) {
    const tokenUser = await this.validateResetToken(resetToken);
    if (!tokenUser) {
      throw ApiError.Forbiden("Невалидный токен");
    }
    const session = await Sessions.findOne({
      userId: tokenUser.userId,
      resetToken,
    });
    if (!session) {
      throw ApiError.Forbiden("Сессия не найдена");
    }
    await usersServices.updateUserPassword(tokenUser.userId, password);
    await session.delete();
    return true;
  }

  generateAccessToken(auth: Auth) {
    return jwt.sign(auth, config.get<string>("accessTokenSecret"), {
      expiresIn: "30s",
    });
  }
  async validateAccessToken(accessToken: string): Promise<Auth | null> {
    try {
      return jwt.verify(
        accessToken,
        config.get<string>("accessTokenSecret")
      ) as Auth;
    } catch (e) {
      return null;
    }
  }

  generateRefreshToken(auth: Auth) {
    return jwt.sign(auth, config.get<string>("refreshTokenSecret"), {
      expiresIn: "30d",
    });
  }
  async validateRefreshToken(refreshToken: string): Promise<Auth | null> {
    try {
      return jwt.verify(
        refreshToken,
        config.get<string>("refreshTokenSecret")
      ) as Auth;
    } catch (e) {
      return null;
    }
  }

  generateResetToken(auth: Auth) {
    return jwt.sign(auth, config.get<string>("accessTokenSecret"), {
      expiresIn: "30s",
    });
  }
  async validateResetToken(resetToken: string): Promise<Auth | null> {
    try {
      return jwt.verify(
        resetToken,
        config.get<string>("accessTokenSecret")
      ) as Auth;
    } catch (e) {
      return null;
    }
  }
}
export default new SessionsService();
