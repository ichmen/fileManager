import crypto from "crypto";
export function hashFile(filePath) {
  const fileName = path.resolve(process.cwd(), filePath);
  fs.readFile(fileName, (err, data) => {
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    console.log(hash);
    prompt();
  });
}
