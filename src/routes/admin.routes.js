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
AdminRouter.post("/logout", LogOut); // ✅ Changed to POST (better practice)
AdminRouter.get("/check-auth", CheckAuth);

export default AdminRouter;