const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");

const watcher = chokidar.watch(["./src/**.html", "./data/**.json"]);

watcher.on("change", (filepath) => {
  console.log(`Change detected on ${filepath}`);
  const { name } = path.parse(filepath);
  const command = `hbs --data ${path.join(
    __dirname,
    "/data/",
    `${name}.json`
  )} -o ./site -- ${path.join(__dirname, "/src/", `${name}.html`)}
  `;
  console.log(command);
  exec(command);
});
