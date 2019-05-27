import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";
import { WallPost, WallPostArray } from "./interfaces";

const app: Application = express();

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(80, () => {
  console.log("Server listening for HTTP-requests @ port 80...");

  if (process.env.NODE_ENV === "production") {
    const options = {
      key: fs.readFileSync("./certificate/privkey.pem", "utf8"),
      cert: fs.readFileSync("./certificate/cert.pem", "utf8")
    };

    https.createServer(options, app).listen(443);

    console.log("Server listening for HTTPS-requests @ port 443...");
  }
});

app.get("/getWallPosts", (req: Request, res: Response) => {
  console.log("/getWallPosts");

  let wallPostsJson = JSON.parse(
    fs.readFileSync("./data/wallPosts.json", "utf8")
  );

  if (wallPostsJson && wallPostsJson.posts) {
    let wallPosts: WallPostArray = <WallPostArray>wallPostsJson.posts;

    res.json(wallPosts);
  }
});

app.post("/saveWallPost", (req: Request, res: Response) => {
  console.log("/saveWallPost");

  let wallPostsJson = JSON.parse(
    fs.readFileSync("./data/wallPosts.json", "utf8")
  );

  if (wallPostsJson && req && req.body && Object.keys(req.body).length) {
    let saveWallPostRequest: WallPost = <WallPost>req.body;

    if (
      saveWallPostRequest &&
      saveWallPostRequest.name &&
      saveWallPostRequest.text
    ) {
      let wallPosts: WallPostArray = <WallPostArray>wallPostsJson;

      if (wallPosts && wallPosts.posts) {
        wallPosts.posts.push(saveWallPostRequest);

        fs.writeFileSync(
          "./data/wallPosts.json",
          JSON.stringify({ posts: wallPosts.posts }, null, 2)
        );
      }
    }
  }

  res.send();
});
