import zlib from "zlib";
import { pipeline } from "stream";
import path from "path";
import fs from "fs";
export function compressFile(filePath, destination) {
  console.log(filePath.split("\\").slice(-1));
  const zippedFile = filePath.split("\\").slice(-1).toString().split(".")[0];
  const inputStream = fs.createReadStream(
    path.resolve(process.cwd(), filePath)
  );
  const zipStream = zlib.createBrotliCompress();
  const outputStream = fs.createWriteStream(
    path.resolve(process.cwd(), destination, zippedFile + ".zip")
  );
  pipeline(inputStream, zipStream, outputStream, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

export function decompressFile(fileName, decompressPath) {
  const inputStream = fs.createReadStream(
    path.resolve(process.cwd(), fileName)
  );
  const zipStream = zlib.createBrotliDecompress();
  const ooutputStream = fs.createWriteStream(
    path.resolve(process.cwd(), decompressPath)
  );
  pipeline(inputStream, zipStream, ooutputStream, (err) => {
    if (err) {
      console.log(err);
    }
  });
}
