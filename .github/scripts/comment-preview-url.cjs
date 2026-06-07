module.exports = async ({ github, context, core }) => {
  const url = process.env.PREVIEW_URL;
  if (!url) {
    core.setFailed("PREVIEW_URL is not set");
    return;
  }

  const marker = "<!-- cf-preview -->";
  const body = [
    marker,
    "### ⚡ Cloudflare preview deployed",
    "",
    `Preview URL: ${url}`,
    "",
    `_Updated for commit ${context.sha.slice(0, 7)}._`,
  ].join("\n");

  const { owner, repo } = context.repo;
  const issue_number = context.issue.number;

  const { data: comments } = await github.rest.issues.listComments({
    owner,
    repo,
    issue_number,
  });

  const existing = comments.find((comment) => comment.body.includes(marker));
  if (existing) {
    await github.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body,
    });
    return;
  }

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};
