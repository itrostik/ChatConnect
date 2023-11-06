import express, { Request, Response } from "express";
import usersRoute from "./routes/user.route";
import dialogsRoute from "./routes/dialog.route";
import messagesRoute from "./routes/message.route";
import { upload, uploadFile } from "./utils/upload.images";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/image", upload.single("file"), async (req, res) => {
  // @ts-ignore
  if (await uploadFile(req.file)) {
    res.json({
      url: `/api/images/${req.file?.originalname}`,
    });
  } else {
    res.json({
      message: `Что-то пошло не так`,
    });
  }
});

app.use("/api/images", express.static("avatars"));

app.use("/api", usersRoute);
app.use("/api", dialogsRoute);
app.use("/api", messagesRoute);

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

app.listen(process.env.PORT || 4444, () => {
  console.log("SERVER OK");
});
