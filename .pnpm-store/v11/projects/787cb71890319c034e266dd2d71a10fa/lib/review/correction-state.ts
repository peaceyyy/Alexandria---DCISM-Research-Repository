export type CommentCorrectionState = "needs_attention" | "revised";

export type CorrectionSummary = {
  totalComments: number;
  revisedCommentCount: number;
  pendingRevisionCommentCount: number;
};

type CorrectionComment = {
  memberRevisedAt: string | null;
};

export function getCommentCorrectionState(
  comment: CorrectionComment,
): CommentCorrectionState {
  if (comment.memberRevisedAt) {
    return "revised";
  }

  return "needs_attention";
}

export function getCorrectionSummary(
  comments: CorrectionComment[],
): CorrectionSummary {
  const revisedCommentCount = comments.filter(
    (comment) => comment.memberRevisedAt,
  ).length;
  const pendingRevisionCommentCount = comments.length - revisedCommentCount;

  return {
    totalComments: comments.length,
    revisedCommentCount,
    pendingRevisionCommentCount,
  };
}
