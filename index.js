// index.js
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import qr from "qr-image";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.post("/generate", (req, res) => {
  const url = req.body.url?.trim();

  if (!url) return res.status(400).send("❌ URL cannot be empty.");

  fs.writeFile("public/URL.txt", url, (err) => {
    if (err) throw err;
    const qr_svg = qr.image(url);
    const qrStream = fs.createWriteStream("public/qr_img.png");
    qr_svg.pipe(qrStream);
    qrStream.on("finish", () => {
      res.redirect("/#qrcode");
    });
  });
});
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});