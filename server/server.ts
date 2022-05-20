import express from "express";
import * as path from "path";
import GroupRouter from "./controller/groupRouter";
import { AddressInfo } from "net";
import MockGroupRepo from "./__mocks__/mockGroupRepo";
import MockGroupService from "./__mocks__/mockGroupService";
import cookieParser from "cookie-parser";
import websockets from "./websockets/webSocketServer";
import { verifyToken } from "./util/authUtils";
import AuthRouter from "./controller/authRouter";

const app = express();
const dummyRepo = new MockGroupRepo();
const groupService = new MockGroupService(dummyRepo);
const groupRoutes = new GroupRouter(groupService, express.Router());
const authRouter = new AuthRouter(groupService, express.Router());

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

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(
    `Server started at http://localhost:${
      (server.address() as AddressInfo).port
    }`
  );
});
websockets(server);
