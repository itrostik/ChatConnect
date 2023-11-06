import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const supabaseUrl = process.env.DB_URL;
const supabaseKey = process.env.DB_KEY;
// @ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(file: any): Promise<boolean> {
  const fileType = file.mimetype;
  const rawData = fs.readFileSync(file.path);
  const { data, error } = await supabase.storage
    .from("images/avatars")
    .upload(file.originalname, rawData, {
      contentType: fileType,
    });
  if (error) {
    console.error("Ошибка загрузки файла:", error);
    return false;
  } else {
    console.log("Файл успешно загружен:", data);
    return true;
  }
}

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "avatars");
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
