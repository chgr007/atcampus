import express from "express";
import { AddressInfo } from "net";
import dotenv from "dotenv";
import { UserDto } from "./dto/userDto";
import UserService from "./service/userService";
import { SchoolEntity } from "./entity/SchoolEntity";
import { repositories } from "./repo/repositories";
import GroupService from "./service/groupService";
import GroupRouter from "./controller/groupRouter";
import AuthRouter from "./controller/authRouter";
import cookieParser from "cookie-parser";
import { verifyToken } from "./util/authUtils";
import path from "path";
import ChatService from "./service/chatService";
import WebSocketServer from "./websockets/webSocketServer";
import AuthService from "./service/authService";

dotenv.config();
const app = express();

const repo = repositories;

repo
  .then((repos) => {
    const server = app.listen(process.env.PORT || 8345, async () => {
      console.info("Connected to db ");
      const schoolEntity = new SchoolEntity("HK");
      const schoolRepo = repos.schoolRepo;
      await schoolRepo.save(schoolEntity);
      const user = new UserDto(
        "christian",
        "chgr007@egms.no",
        "pirate",
        "a88493c3-263d-4aa6-808f-ace53f8e1eb7"
      );
      const userService = new UserService(
        repos.userRepo,
        schoolRepo,
        repos.groupRepo
      );
      const res = await userService.addUser(user);
      console.info(res);
      const groupService = new GroupService(
        repos.groupRepo,
        repos.groupMemberRepo,
        repos.schoolRepo,
        repos.subjectRepo,
        repos.userRepo
      );
      const groupRoutes = new GroupRouter(groupService, express.Router());
      const authRouter = new AuthRouter(
        new AuthService(repos.userRepo),
        express.Router()
      );

      app.use(express.json());
      app.use(cookieParser(process.env.COOKIE_SECRET || "SuperSecret"));
      app.use("/api/v1/groups", groupRoutes.fetchRoutes());

      app.use(authRouter.fetchRoutes());

      app.use(verifyToken);

      app.use(express.static("../client/dist"));

      app.use((req, res, next) => {
        if (req.method === "GET" && !req.path.startsWith("/api")) {
          res.sendFile(path.resolve("../client/dist/index.html"));
        } else {
          next();
        }
      });

      WebSocketServer(server, new ChatService(repos.chatMessageRepo));
      console.log(
        `Server started at http://localhost:${
          (server.address() as AddressInfo).port
        }`
      );
    });
  })
  .catch((e) => console.log(e));
