import express from "express";
import {
  CheckAuth,
  Login,
  LogOut,
  RegisterUser,
} from "../controllers/admin.controller.js";

const AdminRouter = express.Router();

AdminRouter.post("/register", RegisterUser);
AdminRouter.post("/login", Login);
AdminRouter.get("/logout", LogOut);
AdminRouter.get("/check-auth", CheckAuth);

export default AdminRouter;
