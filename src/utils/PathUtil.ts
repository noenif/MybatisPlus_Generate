import { ipcRenderer } from "electron";

const sendNode = (
  sendChannel: string,
  listenerChannel: string,
  config: any = {}
) => {
  ipcRenderer.send(sendChannel, config);
  return new Promise((resolve, reject) => {
    ipcRenderer.on(listenerChannel, (event, arg) => {
      resolve(arg);
    });
  });
};

export { sendNode };
