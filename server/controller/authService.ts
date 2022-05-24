import { Repository } from "typeorm";
import { UserEntity } from "../entity/UserEntity";
import HttpException from "../util/httpException";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import IAuthService from "./IAuthService";

export default class AuthService implements IAuthService {
  constructor(private userRepo: Repository<UserEntity>) {}

  public async authenticateUser(
    userName: string | undefined,
    email: string | undefined,
    password: string
  ): Promise<string> {
    if (!userName && !email) {
      throw new HttpException("Username or email must be provided!", 400);
    }
    if (!password) throw new HttpException("Password must be provided!", 400);

    try {
      const userFromDb = await this.userRepo.findOne({
        where: [{ userName }, { email }],
      });

      if (!userFromDb)
        throw new HttpException("Details provided did not match any user", 400);

      const user = userFromDb as UserEntity;
      const hash = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS!)
      );

      if (hash !== user.password)
        throw new HttpException("Details provided did not match any user", 400);

      return AuthService.generateToken(user);
    } catch (e) {
      throw new HttpException("Database connection lost", 500);
    }
  }

  private static generateToken(user: UserEntity) {
    return jwt.sign({ userId: user.uuid }, process.env.JWT_KEY as string, {
      expiresIn: "1h",
    });
  }
}