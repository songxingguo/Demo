import * as http from "http"; //ES 6
import path from "path";
import fse from "fs-extra";
import multiparty from "multiparty";

const server = http.createServer();
const extractExt = (filename) =>
  filename.slice(filename.lastIndexOf("."), filename.length); // 提取后缀名
const UPLOAD_DIR = path.resolve("/Users/sxg/Downloads/", "target"); // 大文件存储目录

const resolvePost = (req) =>
  new Promise((resolve) => {
    let chunk = "";
    req.on("data", (data) => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });

// 合并切片
const mergeFileChunk = async (filePath, fileHash) => {
  const chunkDir = `${UPLOAD_DIR}/${fileHash}`;
  const chunkPaths = await fse.readdir(chunkDir);
  // 根据切片下标进行排序，否则直接读取目录的获得的顺序可能会错乱
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  await fse.writeFile(filePath, "");
  chunkPaths.forEach((chunkPath) => {
    fse.appendFileSync(filePath, fse.readFileSync(`${chunkDir}/${chunkPath}`));
    fse.unlinkSync(`${chunkDir}/${chunkPath}`);
  });
  fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
};

// 返回已经上传切片名列表
const createUploadedList = async (fileHash) =>
  fse.existsSync(`${UPLOAD_DIR}/${fileHash}`)
    ? await fse.readdir(`${UPLOAD_DIR}/${fileHash}`)
    : [];

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }

  if (req.url === "/") {
    const multipart = new multiparty.Form();

    multipart.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status = 500;
        res.end(
          JSON.stringify({
            messaage: "process file chunk failed",
          })
        );
        return;
      }

      const [chunk] = files.file;
      const [hash] = fields.hash;
      const [filename] = fields.name;
      const [fileHash] = fields.fileHash;
      const chunkDir = `${UPLOAD_DIR}/${fileHash}`;

      const filePath = path.resolve(
        UPLOAD_DIR,
        `${fileHash}${extractExt(filename)}`
      );
      // 文件存在直接返回
      if (fse.existsSync(filePath)) {
        res.end(
          JSON.stringify({
            messaage: "file exist",
          })
        );
        return;
      }

      // 切片目录不存在，创建切片目录
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir);
      }

      // fs-extra 专用方法，类似 fs.rename 并且跨平台
      // fs-extra 的 rename 方法 windows 平台会有权限问题
      // https://github.com/meteor/meteor/issues/7852#issuecomment-255767835
      await fse.move(chunk.path, `${chunkDir}/${hash}`);
      res.status = 200;
      res.end(
        JSON.stringify({
          messaage: "received file chunk",
        })
      );
    });
  }

  if (req.url === "/merge") {
    const data = await resolvePost(req);
    const { filename, fileHash } = data;
    const ext = extractExt(filename);
    const filePath = `${UPLOAD_DIR}/${fileHash}${ext}`;
    await mergeFileChunk(filePath, fileHash);
    res.status = 200;
    res.end(JSON.stringify("file merged success"));
  }

  if (req.url === "/verify") {
    const data = await resolvePost(req);
    const { fileHash, filename } = data;
    const ext = extractExt(filename);
    const filePath = `${UPLOAD_DIR}/${fileHash}${ext}`;
    if (fse.existsSync(filePath)) {
      res.end(
        JSON.stringify({
          shouldUpload: false,
        })
      );
    } else {
      res.end(
        JSON.stringify({
          shouldUpload: true,
          uploadedList: await createUploadedList(fileHash),
        })
      );
    }
  }
});

server.listen(3000, () => console.log("正在监听 3000 端口"));
