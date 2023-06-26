import fs from "fs";
import path from "path";
export function changeDirectoryUp() {
  process.chdir("..");
}
export function changeDirectory(inputData) {
  if (!inputData) {
    console.log("insufficient parametrs");
    return;
  }
  if (inputData === "..") {
    changeDirectoryUp();
    return;
  }
  try {
    process.chdir(path.resolve(process.cwd(), inputData));
  } catch (e) {
    console.error(e);
  }
}

export async function dir() {
  fs.readdir(process.cwd(), async (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    let filesList = [];
    let directories = [];
    files.forEach(async (file, index) => {
      try {
        const stats = await fs.promises.stat(file);
        stats.isDirectory() ? directories.push(file) : filesList.push(file);
      } catch (e) {
        console.log("anable to read stats");
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
