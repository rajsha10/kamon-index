import express from "express";
import cors from "cors";
import trustRoutes from "./routes/trust.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/trust", trustRoutes);

export default app;
