import express, { Request, Response } from "express";
import usersRoute from "./routes/user.route";
import dialogsRoute from "./routes/dialog.route";
import messagesRoute from "./routes/message.route";
import { upload } from "./utils/upload.images";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file?.originalname}`,
  });
});

app.use("/uploads", express.static("uploads"));

app.use("/api", usersRoute);
app.use("/api", dialogsRoute);
app.use("/api", messagesRoute);

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api");
});

app.listen(4444, () => {
  console.log("SERVER OK");
});
