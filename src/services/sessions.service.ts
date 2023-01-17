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
    const tokens = this.generateTokens(auth);
    const session = await Sessions.findOneAndUpdate(
      { userId: user._id },
      { refreshToken: tokens.refreshToken }
    );
    if (!session) {
      await Sessions.create({
        userId: user._id,
        refreshToken: tokens.refreshToken,
      });
    }
    return { ...tokens, ...auth };
  }

  async updateSession(refreshToken: string) {
    const tokenUser = await this.validateRefreshToken(refreshToken);
    if (!tokenUser) {
      throw ApiError.Forbiden("Невалидный токен");
    }
    const session = await Sessions.findOne({ refreshToken });
    if (!session) {
      throw ApiError.NotFound("Сессия не найдена");
    }
    const user = await usersServices.getUser(String(session.userId));
    const auth = user.AuthDTO();
    const tokens = this.generateTokens(auth);
    session.refreshToken = tokens.refreshToken;
    await session.save();
    return { ...tokens, ...auth };
  }

  async deleteSession(refreshToken: string) {
    const session = await Sessions.findOneAndDelete({ refreshToken });
    if (!session) {
      throw ApiError.NotFound("Сессия не найдена");
    }
    return true;
  }

  generateTokens(auth: Auth) {
    const accessToken = jwt.sign(
      auth,
      config.get<string>("accessTokenSecret"),
      {
        expiresIn: "30s",
      }
    );
    const refreshToken = jwt.sign(
      auth,
      config.get<string>("refreshTokenSecret"),
      {
        expiresIn: "30d",
      }
    );
    return {
      accessToken,
      refreshToken,
    };
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
}
export default new SessionsService();
