import { compressFile, decompressFile } from "./zip.js";
import { hashFile } from "./hash.js";
import { osCommands } from "./os.js";
import {
  copyFile,
  moveFile,
  printFile,
  removeFile,
  renameFile,
  addFile,
} from "./files.js";
import { dir, changeDirectory, changeDirectoryUp, prompt } from "./dir.js";
import { exit } from "./exit.js";

Object.entries(process.env).forEach(([name, value]) => {
  if (name === "HOMEPATH") {
    process.chdir(value);
  }
});

const args = process.argv.slice(2).toString().split("=")[1];
console.log(`Welcome to the File Manager, ${args}!`);
console.log(`You are currently in ${process.cwd()}`);
prompt();
process.stdin.on("data", (data) => {
  const inputData = data.toString().slice(0, -2).split(" ");

  switch (inputData[0]) {
    case "up":
      changeDirectoryUp();
      prompt();
      break;
    case ".exit":
      exit(args);
      break;
    case "cd":
      changeDirectory(inputData[1]);
      prompt();
      break;
    case "ls":
      dir();
      break;
    case "cat":
      printFile(inputData[1]);
      break;
    case "add":
      addFile(inputData[1]);
      prompt();
      break;
    case "rn":
      renameFile(inputData[1], inputData[2]);
      prompt();
      break;
    case "cp":
      copyFile(inputData[1], inputData[2]);
      prompt();
      break;
    case "mv":
      moveFile(inputData[1], inputData[2]);
      prompt();
      break;
    case "rm":
      removeFile(inputData[1]);
      prompt();
      break;
    case "os":
      osCommands(inputData[1]);
      prompt();
      break;
    case "hash":
      hashFile(inputData[1]);
      break;
    case "compress":
      compressFile(inputData[1], inputData[2]);
      prompt();
      break;
    case "decompress":
      decompressFile(inputData[1], inputData[2]);
      prompt();
      break;
    default:
      console.log("unknown command");
      prompt();
      break;
  }
});
process.on("SIGINT", () => {
  console.log("");
  exit(args);
});
