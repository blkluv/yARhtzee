import * as React from "react";
import {
  Category,
  FinishedScoreSheet,
  ScoreSheet as IScoreSheet,
} from "../../../gameRules/types";

export const LeaderboardSubmission = ({
  scoreSheet,
  screenshots,
}: {
  scoreSheet: FinishedScoreSheet;
  screenshots: any;
}) => {
  const [status, setStatus] = React.useState<
    | { type: "inactive" }
    | { type: "form"; userName: string; isGithubUser: boolean }
    | { type: "submitting"; userName: string; isGithubUser: boolean }
    | {
        type: "done";
        isTopScore: boolean;
        leaderboardUrl: string;
      }
    | { type: "error" }
  >({ type: "inactive" });

  if (status.type === "inactive")
    return (
      <button
        style={{ padding: "4px 10px" }}
        onClick={() =>
          setStatus({ type: "form", userName: "", isGithubUser: false })
        }
      >
        submit to leaderboard
      </button>
    );

  if (status.type === "error") return <div>error while submitting</div>;

  if (status.type === "done")
    return (
      <div>
        Submitted!{" "}
        {!status.isTopScore &&
          "Unfortunetally you did not reach the high scores"}{" "}
        <a href={status.leaderboardUrl} target="_blank">
          leaderboard
        </a>
      </div>
    );

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "6px",
        alignItems: "center",
        minHeight: "30px",
        flexWrap: "wrap",
      }}
      onSubmit={(e) => {
        e.preventDefault();

        const name = (e.currentTarget.elements as any)["username"].value;
        const isGithubUser = (e.currentTarget.elements as any)["isGithubUser"]
          .checked;

        const user = {
          name,
          uri: isGithubUser ? `https://github.com/${name}` : undefined,
        };
        setStatus({ type: "submitting", isGithubUser, userName: name });

        submitScore(scoreSheet, screenshots, user)
          .then((res) => setStatus({ type: "done", ...res }))
          .catch(() => setStatus({ type: "error" }));
      }}
    >
      <label htmlFor="submit-form-username">name:</label>
      <input
        placeholder="Yann"
        type="text"
        id="submit-form-username"
        autoComplete="username"
        name="username"
        disabled={status.type !== "form"}
        style={{ padding: "4px 10px" }}
        onInput={(e) => {
          const userName = e.currentTarget.value;
          setStatus((s) => ({ ...s, userName }));
        }}
      />

      <label htmlFor="submit-form-github" style={{ marginLeft: "10px" }}>
        from github
      </label>
      <input
        id="submit-form-github"
        type="checkbox"
        name="isGithubUser"
        onChange={(e) => {
          const isGithubUser = !!e.currentTarget.checked;
          setStatus((s) => ({ ...s, isGithubUser }));
        }}
        checked={status.isGithubUser}
      />
      {status.userName && status.isGithubUser && (
        <img
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            flexShrink: 0,
          }}
          src={`https://github.com/${status.userName}.png`}
        />
      )}

      <button
        type="submit"
        disabled={status.type !== "form"}
        style={{ padding: "4px 10px", marginLeft: "auto", minWidth: "64px" }}
      >
        {status.type === "submitting" ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

const submitScore = async (
  scoreSheet: IScoreSheet,
  screenshots: Record<Category, Blob>,
  user: { name?: string; uri?: string }
) => {
  const body = new FormData();
  body.append("game", JSON.stringify({ scoreSheet, user }));
  for (const [category, blob] of Object.entries(screenshots))
    body.append(category, blob);

  const res = await fetch(import.meta.env.VITE_LEADERBOARD_ENDPOINT as string, {
    method: "POST",
    body,
  });

  if (!res.ok)
    throw new Error(
      await res.text().catch(() => res.statusText || res.status.toString())
    );

  return (await res.json()) as Promise<{
    isTopScore: boolean;
    leaderboardUrl: string;
  }>;
};
