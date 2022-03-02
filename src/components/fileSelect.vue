<template>
  <div class="clearfix">
    <a-row>
      {{ selectFile }}
      <a-button @click="getPath(fileConfig)">
        <FileAddOutlined />
        选择 要输出的SQL 文件
      </a-button>
    </a-row>
    <a-row>
      {{ outputDir }}
      <a-button @click="getPath(outputConfig)">
        <FolderOpenOutlined />
        选择要输出的文件夹
      </a-button>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { FolderOpenOutlined, FileAddOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { ref } from "vue";
import { ipcMain, ipcRenderer } from "electron";

interface FileItem {
  uid?: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file?: string | Blob;
}

let fileConfig = ["openFile"];
let outputConfig = ["openDirectory"];

const selectFile = ref<string>("");
const outputDir = ref<string>("");
const uploading = ref<boolean>(false);
let currentType = ref<number>(0);

ipcRenderer.on("PathListener", (event, arg) => {
  if (currentType.value) {
    outputDir.value = arg.filePaths[0];
  } else {
    selectFile.value = arg.filePaths[0];
  }
});

let getPath = (config) => {
  if (config.includes("openDirectory")) {
    currentType.value = 1;
  } else {
    currentType.value = 0;
  }
  ipcRenderer.send("getPath", {
    config,
  });
};
</script>
