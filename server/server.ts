import express from "express";
import { AddressInfo } from "net";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserDto } from "./dto/userDto";
import UserService from "./service/userService";
import { UserRepo } from "./repo/UserRepo";
import { SubjectEntity } from "./entity/SubjectEntity";
import { GroupEntity } from "./entity/GroupEntity";
import { ChatMessageEntity } from "./entity/ChatMessageEntity";
import { CriteriaEntity } from "./entity/CriteriaEntity";
import { GroupMemberEntity } from "./entity/GroupMemberEntity";
import { GroupRequestEntity } from "./entity/GroupRequestEntity";
import { SchoolEntity } from "./entity/SchoolEntity";
import { UserEntity } from "./entity/UserEntity";

dotenv.config();
const app = express();
export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST, // hentes fra process.env
  username: process.env.DB_USERNAME, // hentes fra process.env
  password: process.env.DB_PASSWORD, // hentes fra process.env
  database: process.env.DB_DATABASE, // hentes fra process.env,
  synchronize: true,
  entities: [
    GroupEntity,
    SubjectEntity,
    ChatMessageEntity,
    CriteriaEntity,
    GroupMemberEntity,
    GroupRequestEntity,
    SchoolEntity,
    UserEntity,
  ],
});

AppDataSource.initialize()
  .then(() => {
    const server = app.listen(process.env.PORT || 8345, async () => {
      const schoolEntity = new SchoolEntity("HK");
      const schoolRepo = AppDataSource.getRepository(SchoolEntity);
      await schoolRepo.save(schoolEntity);
      const user = new UserDto("christian", "chgr007@egms.no", "pirate");
      // const userService = new UserService(await UserRepo);
      // const res = await userService.addUser(user);
      const userRepo = AppDataSource.getRepository(UserEntity);
      const res = await userRepo.save(
        new UserEntity(user.username, user.email, user.password, schoolEntity)
      );
      console.info(res);
      console.info("Connected to db ");
      // const groupService = new GroupService(GroupRepo);
      // const groupRoutes = new GroupRouter(groupService, express.Router());
      // const authRouter = new AuthRouter(groupService, express.Router());

      //
      // app.use(express.json());
      // app.use(cookieParser(process.env.COOKIE_SECRET || "SuperSecret"));
      // app.use("/api/v1/groups", groupRoutes.fetchRoutes());
      //
      // app.use(authRouter.fetchRoutes());
      //
      // app.use(verifyToken);
      //
      // app.use(express.static("../client/dist"));
      //
      // app.use((req, res, next) => {
      //   if (req.method === "GET" && !req.path.startsWith("/api")) {
      //     res.sendFile(path.resolve("../client/dist/index.html"));
      //   } else {
      //     next();
      //   }
      // });
      //
      // websockets(server, new ChatService(ChatMessageRepo));
      console.log(
        `Server started at http://localhost:${
          (server.address() as AddressInfo).port
        }`
      );
    });
  })
  .catch((e) => console.log(e));
