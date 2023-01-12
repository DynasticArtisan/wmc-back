import jwt from "jsonwebtoken";
import config from "config";
import Sessions from "../models/sessions.model";
import ApiError from "../exceptions";
import usersServices from "./users.services";
import { TokenDTO } from "../models/users.model";

class SessionsService {
  async createSession(login: string, password: string) {
    const user = await usersServices.authorize(login, password);
    const tokenDTO = user.tokenDTO();
    const tokens = this.generateTokens(tokenDTO);
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
    return { ...tokens, ...tokenDTO };
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
    const tokenDTO = user.tokenDTO();
    const tokens = this.generateTokens(tokenDTO);
    session.refreshToken = tokens.refreshToken;
    await session.save();
    return { ...tokens, ...tokenDTO };
  }

  async deleteSession(refreshToken: string) {
    const session = await Sessions.findOneAndDelete({ refreshToken });
    if (!session) {
      throw ApiError.NotFound("Сессия не найдена");
    }
    return true;
  }

  generateTokens(TokenDTO: TokenDTO) {
    const accessToken = jwt.sign(TokenDTO, config.get("accessTokenSecret"), {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(TokenDTO, config.get("refreshTokenSecret"), {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async validateAccessToken(accessToken: string): Promise<TokenDTO | null> {
    try {
      return jwt.verify(
        accessToken,
        config.get("accessTokenSecret")
      ) as TokenDTO;
    } catch (e) {
      return null;
    }
  }
  async validateRefreshToken(refreshToken: string): Promise<TokenDTO | null> {
    try {
      return jwt.verify(
        refreshToken,
        config.get("refreshTokenSecret")
      ) as TokenDTO;
    } catch (e) {
      return null;
    }
  }
}
export default new SessionsService();
