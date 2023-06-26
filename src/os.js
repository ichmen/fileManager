import os from "os";
export function osCommands(command) {
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
