import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { createExitSignal, staticServer } from "./shared/server.ts";

import { getAfinn } from "./afinn.js";

import { getExample } from "./example.js";

import { gpt } from "./shared/openai.ts";

const kv = await Deno.openKv();

const app = new Application();
const router = new Router();

const example = getExample();

await kv.set(["art_info", example.artist], example);

const artists = await kv.list({ prefix: ["art_info"] });
console.log(artists);

for await (const artist of artists) {
  console.log(artist.key);
  console.log(artist.value);
}

router.get("/api/artists", async (ctx) => {
  const artists = await kv.list({ prefix: ["art_info"] });
  const artistList = [];
  for await (const artist of artists) {
    artistList.push(artist.value);
  }
  artistList.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  ctx.response.body = artistList;
});

router.get("/api/artist/:name", async (ctx) => {
  const artist = await kv.get(["art_info", ctx.params.name]);
  ctx.response.body = artist.value;
});

router.post("/api/image", async (ctx) => {
  console.log("ctx.request.url.pathname:", ctx.request.url.pathname);

  console.log("ctx.request.method:", ctx.request.method);

  const JSONdata = await ctx.request.body({ limit: "20mb" }).value;
  const data = JSON.parse(JSONdata);
  const imageURL = data.image;
  console.log(imageURL.slice(0, 50));
  console.log(data.artist);
  const artInfo = await analyzeImage(imageURL, data.artist);
  const result = await kv.set(["art_info", data.artist], artInfo);
  console.log(result);

  ctx.response.body = artInfo;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(staticServer);

console.log("\nListening on http://localhost:8585");
await app.listen({ port: 8585, signal: createExitSignal() });

function getAfinnScores(mood) {
  const afinn = getAfinn();
  const scores = [];
  let sum = 0;
  let absSum = 0;
  for (const m of mood) {
    if (afinn[m] === undefined) {
      afinn[m] = 0;
    }
    scores.push({ mood: m, score: Number(afinn[m]) });
    sum += Number(afinn[m]);
    absSum += Math.abs(Number(afinn[m]));
  }
  return { sum, absSum, scores };
}

async function analyzeImage(imageURL, artistName) {
  const response = await gpt({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `This is an artwork by artist ${artistName}.Analyze the image and provide structured data to about the artwork to generate a sketch based on it.`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageURL,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
    temperature: 0.8,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "image_analysis",
        schema: {
          type: "object",
          properties: {
            mood: {
              type: "array",
              description:
                "Five keywords to describe the feelings caused by this artwork. The keywords have to be in the AFINN sentiment analysis list of words. Don't say 'surprise', add variety.",
              items: { type: "string" },
            },
            color: {
              type: "array",
              description: "The five most prominent colors in the artwork, in HEX.",
              items: { type: "string" },
            },
            shape: {
              type: "array",
              description: "Two keywords describing the shapes prominent in the artwork.",
              items: {
                type: "string",
                enum: ["circular", "organic", "sharp", "text", "linear", "rectangular", "geometric"],
              },
            },
            style: {
              type: "array",
              description: "Two keywords describing the style of the artwork.",

              items: {
                type: "string",
                enum: [
                  "avant-garde",
                  "radical",
                  "minimalist",
                  "constrained",
                  "classic",
                  "expressionist",
                  "chaotic",
                  "maximalist",
                ],
              },
            },
            contrast: {
              type: "string",
              description: "The contrast of the artwork.",
              enum: ["high", "low"],
            },
          },
          required: ["mood", "color", "shape", "style", "contrast"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });
  const artObj = response.parsed;
  artObj.artist = artistName;
  artObj.afinn = getAfinnScores(artObj.mood);
  const timestamp = new Date().toISOString();
  artObj.timestamp = timestamp;
  // await Deno.writeTextFile("art_info.json", JSON.stringify(artObj, null, 2));
  return response.parsed;
}
