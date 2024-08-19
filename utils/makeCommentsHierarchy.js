export function makeCommentsHierarchy(comments) {
  const commentMap = {};
  for (const comment of comments) {
    commentMap[comment.comment.path] = { ...comment, comments: [] };
  }

  const roots = [];

  for (const comment of comments) {
    const hierarchicalComment = commentMap[comment.comment.path];
    const parentPath = comment.comment.path.substring(
      0,
      comment.comment.path.lastIndexOf(".")
    );

    const parentComment = commentMap[parentPath];
    if (parentComment) {
      parentComment.comments.push(hierarchicalComment);
    } else {
      roots.push(hierarchicalComment);
    }
  }

  return roots;
}
