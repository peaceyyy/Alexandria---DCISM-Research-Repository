import { createClient } from "@/lib/supabase/server";
import { THESIS_PDF_MIME_TYPE } from "./file-validation";

const THESIS_FILES_BUCKET = "thesis_files_bucket";

export type StoredThesisFile = {
  filePath: string;
  fileUrl: string;
};

export async function uploadThesisFileToStorage(
  file: File,
  userId: string,
): Promise<StoredThesisFile> {
  const supabase = await createClient();
  const folderId = crypto.randomUUID();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `uploads/${userId}/${folderId}/${safeFileName}`;

  const { data, error } = await supabase.storage
    .from(THESIS_FILES_BUCKET)
    .upload(filePath, file, {
      upsert: false,
      contentType: THESIS_PDF_MIME_TYPE,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(THESIS_FILES_BUCKET)
    .getPublicUrl(data.path);

  return {
    filePath: data.path,
    fileUrl: urlData.publicUrl,
  };
}

export async function removeThesisFileFromStorage(
  filePath: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(THESIS_FILES_BUCKET)
    .remove([filePath]);

  return error?.message ?? null;
}
