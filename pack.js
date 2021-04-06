const fs = require("fs");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const prettify = require("pretty");

const fsPromise = fs.promises;

async function buildFile(fileName) {
  const file = await fsPromise.readFile("./src/super-template.html");

  const $ = cheerio.load(file);

  const map = {};
  $('link[rel="stylesheet"]').each((i, item) => {
    map[i] = {
      href: $(item).attr("href"),
    };
  });

  for (const i in map) {
    const href = map[i].href;
    map[i].value = await fetch(href).then((res) => res.text());
  }

  $('link[rel="stylesheet"]').each((i, item) => {
    $(item).replaceWith(`<style>${map[i].value}</style>`);
  });

  // tree shake
  return prettify($.html(), { ocd: true });
}

async function saveFile(filename, data) {
  if (!fs.existsSync("./dist")) {
    await fsPromise.mkdir("./dist");
  }
  await fsPromise.writeFile(`./dist/${filename}`, data);
}

const run = async () => {
  const res = await buildFile("./src/super-template.html");
  await saveFile("super-template.html", res);
};

run().catch(console.error);
