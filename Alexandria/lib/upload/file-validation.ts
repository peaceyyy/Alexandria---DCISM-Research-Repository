export const MAX_THESIS_PDF_BYTES = 10 * 1024 * 1024;
export const THESIS_PDF_MIME_TYPE = "application/pdf";
export const MAX_TEASER_THUMBNAIL_BYTES = 5 * 1024 * 1024;
export const TEASER_THUMBNAIL_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export type TeaserThumbnailMimeType = (typeof TEASER_THUMBNAIL_MIME_TYPES)[number];

const PDF_SIGNATURE = "%PDF-";

export async function validateThesisPdf(file: File): Promise<string | null> {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "Only PDF files are allowed.";
  }

  if (file.type && file.type !== THESIS_PDF_MIME_TYPE) {
    return "Only PDF files are allowed.";
  }

  if (file.size === 0) {
    return "The selected PDF is empty.";
  }

  if (file.size > MAX_THESIS_PDF_BYTES) {
    return "The PDF must not exceed 10 MiB.";
  }

  const signatureBytes = await file
    .slice(0, PDF_SIGNATURE.length)
    .arrayBuffer();
  const signature = new TextDecoder("ascii").decode(signatureBytes);

  if (signature !== PDF_SIGNATURE) {
    return "The selected file does not have a valid PDF signature.";
  }

  return null;
}

export async function validateTeaserThumbnail(file: File): Promise<string | null> {
  if (!TEASER_THUMBNAIL_MIME_TYPES.includes(file.type as TeaserThumbnailMimeType)) {
    return "Use a JPEG, PNG, or WebP image for the teaser thumbnail.";
  }

  if (file.size === 0) return "The selected teaser thumbnail is empty.";
  if (file.size > MAX_TEASER_THUMBNAIL_BYTES) {
    return "The teaser thumbnail must not exceed 5 MiB.";
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  const isWebp =
    header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46
    && header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50;

  return isJpeg || isPng || isWebp
    ? null
    : "The selected teaser thumbnail does not have a valid image signature.";
}
