import path from "path";
import fs from "fs";
let homePath;
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
  console.log(`Thank you for using File Manager, ${args}, goodbye!`);
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
  console.log(`|(index)|Name${" ".repeat(maxLength - 4)}|`);

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
