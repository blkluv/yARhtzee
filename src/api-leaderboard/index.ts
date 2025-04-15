import * as crypto from "crypto";
import { parse as multiPartParse } from "parse-multipart-data";
import type { R2Bucket } from "@cloudflare/workers-types";
import {
  categories,
  DiceValue,
  getScoreSheetScore,
  isScoreSheet,
  isScoreSheetFinished,
} from "../gameRules/types";
import { getScore } from "../gameRules/getScore";
import { nDice } from "../gameRules/game";

const handler = async (req: Request, env: Env) => {
  const contentType = req.headers.get("content-type");
  if (!contentType?.startsWith("multipart/form-data;"))
    return new Response("Expect multipart", { status: 400 });

  const boundary = contentType.split("boundary=")[1].trim();

  const params = multiPartParse(Buffer.from(await req.arrayBuffer()), boundary);

  const screenshots = new Map<string, string>();
  for (const category of categories) {
    const param = params.find((p) => p.name === category);

    if (!param)
      return new Response(`missing screenshot for category "${category}"`, {
        status: 400,
      });

    const extension =
      (param.type === "image/jpeg" && ".jpeg") ||
      (param.type === "image/png" && ".png") ||
      (param.type === "image/webp" && ".webp");

    if (param.data.byteLength > 18_000 || !extension)
      return new Response("unexpected image format", { status: 400 });

    const hash = crypto
      .createHash("md5")
      .update(new Uint8Array(param.data))
      .digest("base64")
      .replaceAll(/[\/\+]/g, "")
      .padEnd(16, "=")
      .slice(0, 16)
      .toLowerCase();

    const key = hash + extension;
    await env.images_bucket.put(key, param.data, {
      customMetadata: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    });

    screenshots.set(category, key);
  }

  const gameParam = params.find((p) => p.name === "game");
  if (!gameParam) return new Response(`missing entry  "game"`, { status: 400 });
  const game = JSON.parse(gameParam.data.toString());

  const scoreSheet = game.scoreSheet;
  if (!isScoreSheet(scoreSheet, nDice) || !isScoreSheetFinished(scoreSheet))
    return new Response(`missing finished scoresheet"`, { status: 400 });

  const isUser = (x: any): x is { name: string; uri?: string } =>
    (x && typeof x.name === "string" && !x.uri) ||
    (typeof x.uri === "string" &&
      ["https://github.com", "https://bsky.app"].some(
        (origin) => origin === new URL(x.uri).origin
      ));
  const user = game.user;
  if (!isUser(user))
    return new Response(`missing valid user"`, { status: 400 });

  const dicesToUnicode = (dices: DiceValue[]) =>
    dices
      .map(
        (d) =>
          (d === 1 && "⚀") ||
          (d === 2 && "⚁") ||
          (d === 3 && "⚂") ||
          (d === 4 && "⚃") ||
          (d === 5 && "⚄") ||
          (d === 6 && "⚅") ||
          "\xa0"
      )
      .join("");

  const markdownUser = (() => {
    let m;
    if ((m = user.uri?.match(/^https:\/\/github\.com\/([^\/]+)\/?$/)))
      return `@${m[1]}`;
    if (user.uri) return `[${user.name}](${user.uri})`;
    return user.name;
  })();

  const markdownBlock =
    "<details>\n" +
    `<summary>${getScoreSheetScore(
      scoreSheet
    )} by ${markdownUser}</summary>\n` +
    "\n" +
    "|Combination|Score|Screenshot|\n" +
    "|--|--|--|\n" +
    categories
      .map(
        (category) =>
          "| " +
          category.padEnd(
            Math.max(...categories.map((c) => c.length)),
            "\xa0"
          ) +
          " | " +
          getScore(category, scoreSheet[category])
            .toString()
            .padStart(2, "\xa0") +
          " " +
          dicesToUnicode(scoreSheet[category]) +
          " | " +
          `<img width="50px" height="30px" src="${
            env.IMAGES_BUCKET_PUBLIC_URL + screenshots.get(category)
          }"/>` +
          " |"
      )
      .join("\n") +
    "\n" +
    "</details>";

  const { entries, id } = await getLeaderboard(env);

  if (entries.some((e) => e.block === markdownBlock))
    return new Response(`already submitted"`, { status: 400 });

  entries.push({ score: getScoreSheetScore(scoreSheet), block: markdownBlock });
  entries.sort((a, b) => b.score - a.score);

  while (entries.length > 20) entries.pop();

  await setLeaderboard(env, id, entries);

  const isTopScore = entries.some((b) => b.block === markdownBlock);
  const leaderboardUrl = `https://github.com/${env.LEADER_BOARD_REPOSITORY}/issues/${env.LEADER_BOARD_ISSUE_NUMBER}`;

  return new Response(JSON.stringify({ isTopScore, leaderboardUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const getLeaderboard = async (env: Env) => {
  const query = /* GraphQL */ `
    query (
      $repository_owner: String!
      $repository_name: String!
      $issue_number: Int!
    ) {
      repository(name: $repository_name, owner: $repository_owner) {
        issue(number: $issue_number) {
          body
          id
        }
      }
    }
  `;
  const [repository_owner, repository_name] =
    env.LEADER_BOARD_REPOSITORY.split("/");
  const variables = {
    repository_owner,
    repository_name,
    issue_number: +env.LEADER_BOARD_ISSUE_NUMBER,
  };

  const data = await githubGraphQLRequest<any>(env, query, variables);

  const body = data.repository.issue.body as string;
  const id = data.repository.issue.id as string;
  const entries = [
    ...body.matchAll(
      /<details>\s*<summary>(\d+).*<\/summary>\n\n(\|.*\|\n){3,}<\/details>/g
    ),
  ].map(([block, score]) => ({ block, score: +score }));

  return { entries, id };
};

const setLeaderboard = async (
  env: Env,
  id: string,
  entries: { block: string }[]
) => {
  const query = /* GraphQL */ `
    mutation ($body: String!, $id: ID!) {
      updateIssue(input: { id: $id, body: $body }) {
        issue {
          body
        }
      }
    }
  `;

  const variables = {
    id,
    body:
      entries.map((e) => e.block).join("\n") +
      "\n\n_This list is generated from players submission_",
  };

  await githubGraphQLRequest(env, query, variables);
};

const githubGraphQLRequest = async <T extends unknown>(
  { GITHUB_ACCESS_TOKEN }: { GITHUB_ACCESS_TOKEN: string },
  query: string,
  variables: any
) => {
  const res = await fetch("https://api.github.com/graphql", {
    headers: {
      Authorization: `bearer ${GITHUB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "me@platane.me",
    },
    method: "POST",
    body: JSON.stringify({ variables, query }),
  });

  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));

  const { data, errors } = (await res.json()) as {
    data: any;
    errors?: { message: string }[];
  };

  if (errors?.[0]) throw errors[0];

  return data as T;
};

type Env = {
  GITHUB_ACCESS_TOKEN: string;
  LEADER_BOARD_REPOSITORY: string;
  LEADER_BOARD_ISSUE_NUMBER: string;
  IMAGES_BUCKET_PUBLIC_URL: string;
  images_bucket: R2Bucket;
};

const cors =
  <
    Headers extends {
      get: (v: string) => string | null;
      set: (name: string, value: string) => unknown;
    },
    Req extends { headers: Headers },
    Res extends { headers: Headers },
    A extends Array<any>
  >(
    f: (req: Req, ...args: A) => Res | Promise<Res>
  ) =>
  async (req: Req, ...args: A) => {
    const res = await f(req, ...args);

    const origin = req.headers.get("origin");

    if (origin) {
      const { host, hostname } = new URL(origin);

      if (hostname === "localhost" || host === "platane.github.io")
        res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
  };

export default {
  fetch: cors((req: Request, env: Env) => {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return new Response();

    if (req.method === "POST") return handler(req, env);

    return new Response("", { status: 404 });
  }),
};
