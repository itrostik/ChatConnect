import express, { Request, Response } from "express";
import usersRoute from "../../src/routes/user.route";
import dialogsRoute from "../../src/routes/dialog.route";
import messagesRoute from "../../src/routes/message.route";
import serverless from "serverless-http";
import cors from "cors";
import { upload, uploadFile } from "../../src/utils/upload.images";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

app.post("/api/image", upload.single("file"), async (req, res) => {
  // @ts-ignore
  if (await uploadFile(req.file, req.file?.originalname)) {
    res.json({
      url: `https://ejjdyiohraasggghnykr.supabase.co/storage/v1/object/public/images/avatars/${req.file?.originalname}`,
    });
  } else {
    res.json({
      message: `Что-то пошло не так`,
    });
  }
});

app.use("/api/images/", express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use("/api/", usersRoute);
app.use("/api/", dialogsRoute);
app.use("/api/", messagesRoute);

export const handler = serverless(app);
