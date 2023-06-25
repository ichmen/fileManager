import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";
import zlib from "zlib";
import { pipeline } from "stream";
Object.entries(process.env).forEach(([name, value]) => {
  if (name === "HOMEPATH") {
    console.log(value);
    process.chdir(value);
  }
});
console.log(process.argv.slice(2));

const args = process.argv.slice(2)[1].split("=")[1];
console.log(`Welcome to the File Manager, ${args}!`);
console.log(`You are currently in ${process.cwd()}`);
prompt();
process.stdin.on("data", (data) => {
  const inputData = data.toString().slice(0, -2).split(" ");

  switch (inputData[0]) {
    case "up":
      changeDirectoryUp();
      break;
    case ".exit":
      exit();
      break;
    case "cd":
      changeDirectory(inputData[1]);
      break;
    case "ls":
      dir();
      break;
    case "cat":
      printFile(inputData[1]);
      break;
    case "add":
      addFile(inputData[1]);
      break;
    case "rn":
      renameFile(inputData[1], inputData[2]);
      break;
    case "cp":
      copyFile(inputData[1], inputData[2]);
      break;
    case "mv":
      moveFile(inputData[1], inputData[2]);
      break;
    case "rm":
      removeFile(inputData[1]);
      break;
    case "os":
      osCommands(inputData[1]);
      break;
    case "hash":
      hashFile(inputData[1]);
      break;
    case "compress":
      compressFile(inputData[1], inputData[2]);
      break;
    case "decompress":
      decompressFile(inputData[1], inputData[2]);
      break;
    default:
      break;
  }
  prompt();
});
process.on("SIGINT", () => {
  exit();
});

function changeDirectoryUp() {
  process.chdir("..");
}
function changeDirectory(inputData) {
  if (inputData === "..") {
    changeDirectoryUp();
    return;
  }
  try {
    if (inputData.startsWith("\\")) {
      process.chdir(path.resolve(process.cwd(), inputData));
    } else {
      process.chdir(path.join(process.cwd(), inputData));
    }
  } catch (e) {
    console.error(e);
  }
}

function exit() {
  console.log(`\nThank you for using File Manager, ${args}, goodbye!`);
  process.exit();
}

async function dir() {
  let filesList = [];
  let directories = [];
  let list = [];
  fs.readdir(process.cwd(), (err, files) => {
    files.forEach((file) => {
      fs.statSync(file).isDirectory()
        ? directories.push(file)
        : filesList.push(file);
    });
    printLs(directories.sort(), filesList.sort());
  });
}

function printLs(directories, files) {
  let index = 0;
  let maxLength = 0;
  [...directories, ...files].forEach((el) => {
    if (el.length > maxLength) {
      maxLength = el.length;
    }
  });
  console.log(`\n${"-".repeat(maxLength + 20)}`);
  console.log(`|(index)|Name${" ".repeat(maxLength - 4)}|Type`);

  directories.forEach((directory) => {
    console.log(
      `|${index}${" ".repeat(
        5 - index.toString().length
      )}|'${directory}'${" ".repeat(maxLength - directory.length)}| 'directory'`
    );
    index += 1;
  });
  files.forEach((file) => {
    console.log(
      `|${index}${" ".repeat(
        5 - index.toString().length
      )}|'${file}'${" ".repeat(maxLength - file.length)}| 'file'`
    );
    index += 1;
  });
  prompt();
}

function printFile(filename) {
  const reader = fs.createReadStream(filename);
  reader
    .on("data", (chunk) => {
      process.stdout.write(chunk + "\n");
    })
    .on("end", () => prompt());
}

function prompt() {
  process.stdout.write(`${process.cwd()}>`);
}

function addFile(filename) {
  fs.open(filename, "w", (err, file) => {
    if (err) {
      console.log(err);
    }
  });
}
function renameFile(oldName, newName) {
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

function copyFile(oldName, newPath) {
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

function moveFile(oldName, newPath) {
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

function removeFile(filePath) {
  fs.unlink(path.resolve(process.cwd(), filePath), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function osCommands(command) {
  switch (command.slice(2)) {
    case "EOL":
      console.log(JSON.stringify(os.EOL));
      break;
    case "cpus":
      getCpuInfo();
      break;
    case "homedir":
      console.log(os.homedir());
      break;
    case "username":
      console.log(os.userInfo().username);
      break;
    case "architecture":
      console.log(os.arch());
      break;
    default:
      break;
  }
}

function getCpuInfo() {
  const cpuInfo = os.cpus();
  console.log(`CPUs amount ${cpuInfo.length}`);
  cpuInfo.forEach(({ model, speed }, index) => {
    console.log(`CPU No${index} Model:${model} Speed:${speed / 1000} GHz`);
  });
}

function hashFile(filePath) {
  const fileName = path.resolve(process.cwd(), filePath);
  fs.readFile(fileName, (err, data) => {
    const hash = crypto.createHash("sha256").update(data).digest("hex");
    console.log(hash);
    prompt();
  });
}
function compressFile(filePath, destination) {
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

function decompressFile(fileName, decompressPath) {
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
