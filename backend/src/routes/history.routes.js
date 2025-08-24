import {Router} from "express"
import { addToHistory, getHistory, removeFromHistory, clearHistory} from "../controllers/history.controller.js"
import { jwtVerification } from "../middlewares/auth.middleware.js";

const router=Router()
router.route("/add").post(jwtVerification, addToHistory);
router.route("/").get(jwtVerification, getHistory);
router.route("/:videoId").delete(jwtVerification, removeFromHistory);
router.route("/").delete(jwtVerification, clearHistory);

export default router
