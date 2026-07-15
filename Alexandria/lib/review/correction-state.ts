export type CommentCorrectionState = "needs_attention" | "revised" | "addressed";

export type CorrectionSummary = {
  totalComments: number;
  revisedCommentCount: number;
  acknowledgedCommentCount: number;
  unacknowledgedCommentCount: number;
};

type CorrectionComment = {
  memberRevisedAt: string | null;
  addressedAt: string | null;
};

export function getCommentCorrectionState(
  comment: CorrectionComment,
): CommentCorrectionState {
  if (comment.addressedAt) {
    return "addressed";
  }

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
  const acknowledgedCommentCount = comments.filter(
    (comment) => comment.addressedAt,
  ).length;

  return {
    totalComments: comments.length,
    revisedCommentCount,
    acknowledgedCommentCount,
    unacknowledgedCommentCount: comments.length - acknowledgedCommentCount,
  };
}
