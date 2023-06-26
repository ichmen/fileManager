import fs from "fs";
export function printFile(filename) {
  const reader = fs.createReadStream(filename);
  reader
    .on("data", (chunk) => {
      process.stdout.write(chunk + "\n");
    })
    .on("end", () => prompt());
}

export function addFile(filename) {
  fs.open(filename, "w", (err, file) => {
    if (err) {
      console.log(err);
    }
  });
}
export function renameFile(oldName, newName) {
  if (!oldName || !newName) {
    console.log("insufficient parametrs");
    return;
  }
  if (!fs.existsSync(oldName)) {
    throw Error("no such file");
  }
  fs.rename(oldName, newName, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

export function copyFile(oldName, newPath) {
  if (!oldName || !newPath) {
    console.log("insufficient parametrs");
    return;
  }
  const fileName = oldName.split("\\").slice(-1).toString();
  if (!fs.existsSync(oldName)) {
    throw Error("no such file");
  }
  fs.createReadStream(path.resolve(process.cwd(), oldName)).pipe(
    fs.createWriteStream(path.resolve(newPath, fileName))
  );
}

export function moveFile(oldName, newPath) {
  if (!oldName || !newPath) {
    console.log("insufficient parametrs");
    return;
  }
  const fileName = oldName.split("\\").slice(-1).toString();
  const newFilePath = path.resolve(newPath, fileName);
  const oldFilePath = path.resolve(process.cwd(), oldName);
  if (!fs.existsSync(oldName)) {
    throw Error("no such file");
  }
  const writableStream = fs.createWriteStream(newFilePath);
  fs.createReadStream(oldFilePath).pipe(writableStream);
  writableStream.on("finish", () => {
    fs.unlink(oldFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

export function removeFile(filePath) {
  fs.unlink(path.resolve(process.cwd(), filePath), (err) => {
    if (err) {
      console.log(err);
    }
  });
}
