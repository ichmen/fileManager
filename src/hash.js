import crypto from "crypto";
import path from "path";
import fs from "fs";
import { prompt } from "./dir.js";
export function hashFile(filePath) {
  if (!filePath) {
    console.log("insufficient parametrs");
    prompt();
    return;
  }
  const fileName = path.resolve(process.cwd(), filePath);
  fs.readFile(fileName, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    console.log(hash);
    prompt();
  });
}
