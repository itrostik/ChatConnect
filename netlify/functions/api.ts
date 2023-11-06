import express, { Request, Response } from "express";
import usersRoute from "../../src/routes/user.route";
import dialogsRoute from "../../src/routes/dialog.route";
import messagesRoute from "../../src/routes/message.route";
import serverless from "serverless-http";
import cors from "cors";
import { upload } from "../../src/utils/upload.images";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

app.post("/api/image/", upload.single("image"), (req, res) => {
  res.json({
    url: `/api/images/${req.file?.originalname}`,
  });
});

app.use("/api/images/", express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use("/api/", usersRoute);
app.use("/api/", dialogsRoute);
app.use("/api/", messagesRoute);

export const handler = serverless(app);
