export const MAX_THESIS_PDF_BYTES = 10 * 1024 * 1024;
export const THESIS_PDF_MIME_TYPE = "application/pdf";

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
