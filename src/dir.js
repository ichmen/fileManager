import fs from "fs";
import { promisify } from "util";
export function changeDirectoryUp() {
  process.chdir("..");
}
export function changeDirectory(inputData) {
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

export async function dir() {
  fs.readdir(process.cwd(), async (err, files) => {
    let filesList = [];
    let directories = [];
    let isError = false;
    files.forEach(async (file, index) => {
      try {
        const stats = await fs.promises.stat(file);
        stats.isDirectory() ? directories.push(file) : filesList.push(file);
      } catch (e) {
        console.log("no admin rights");
        isError = true;
      }
      if (isError) {
        return;
      }
      if (index === files.length - 1) {
        printLs(directories, filesList);
      }
    });
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
  console.log(`|(index)  |Name${" ".repeat(maxLength - 4)}  |Type`);

  directories.forEach((directory) => {
    console.log(
      `|${index}${" ".repeat(
        9 - index.toString().length
      )}|'${directory}'${" ".repeat(maxLength - directory.length)}| 'directory'`
    );
    index += 1;
  });
  files.forEach((file) => {
    console.log(
      `|${index}${" ".repeat(
        9 - index.toString().length
      )}|'${file}'${" ".repeat(maxLength - file.length)}| 'file'`
    );
    index += 1;
  });
  prompt();
}
export function prompt() {
  process.stdout.write(`${process.cwd()}>`);
}
