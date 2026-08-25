import { Router } from "express";
import {
  getCategories,
  getProductBySlug,
  listProducts,
} from "../controllers/productController";

const router: Router = Router();

router.get("/", getCategories);
router.get("/", getProductBySlug);
router.get("/", listProducts);

export default router;
