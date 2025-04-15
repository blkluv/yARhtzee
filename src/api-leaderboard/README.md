# api leaderboard

Expose an endpoint to upload a player score with screenshots for each category.

Write the result on a github issue as markdown sorted list.

```sh

# deploy
bunx wrangler deploy --branch=production

# change secret
bunx wrangler secret put GITHUB_ACCESS_TOKEN

```
