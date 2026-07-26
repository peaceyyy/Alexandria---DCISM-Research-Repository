import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  THESIS_PDF_MIME_TYPE,
  type TeaserThumbnailMimeType,
} from "./file-validation";

const THESIS_FILES_BUCKET = "thesis_files_bucket";
export const TEASER_STAGING_BUCKET = "thesis_teaser_staging";
export const TEASER_PUBLIC_BUCKET = "thesis_teasers_public";

export type StoredThesisFile = {
  filePath: string;
};
export type StoredTeaserThumbnail = {
  filePath: string;
  mimeType: TeaserThumbnailMimeType;
  byteSize: number;
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

  return {
    filePath: data.path,
  };
}

export async function removeThesisFileFromStorage(
  filePath: string,
): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.storage
      .from(THESIS_FILES_BUCKET)
      .remove([filePath]);

    return error?.message ?? null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "Storage cleanup could not be completed.";
  }
}

export async function uploadTeaserThumbnailToStaging(
  file: File,
  userId: string,
): Promise<StoredTeaserThumbnail> {
  const supabase = await createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "image";
  const filePath = `uploads/${userId}/${crypto.randomUUID()}/teaser.${extension}`;
  const { data, error } = await supabase.storage.from(TEASER_STAGING_BUCKET).upload(
    filePath,
    file,
    {
      upsert: false,
      contentType: file.type,
      cacheControl: "31536000, immutable",
    },
  );

  if (error) throw new Error(`Teaser upload failed: ${error.message}`);
  return {
    filePath: data.path,
    mimeType: file.type as TeaserThumbnailMimeType,
    byteSize: file.size,
  };
}

/** Server-only admin path for direct corrections; no browser receives privileged storage access. */
export async function uploadAdminTeaserThumbnailToStaging(
  file: File,
  adminUserId: string,
): Promise<StoredTeaserThumbnail> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "image";
  const filePath = `admin/${adminUserId}/${crypto.randomUUID()}/teaser.${extension}`;
  const { data, error } = await createAdminClient().storage.from(TEASER_STAGING_BUCKET).upload(
    filePath,
    file,
    {
      upsert: false,
      contentType: file.type,
      cacheControl: "31536000, immutable",
    },
  );
  if (error) throw new Error(`Teaser upload failed: ${error.message}`);
  return {
    filePath: data.path,
    mimeType: file.type as TeaserThumbnailMimeType,
    byteSize: file.size,
  };
}

export async function removeTeaserThumbnailFromStaging(filePath: string): Promise<string | null> {
  try {
    const { error } = await createAdminClient().storage
      .from(TEASER_STAGING_BUCKET)
      .remove([filePath]);
    return error?.message ?? null;
  } catch (error) {
    return error instanceof Error ? error.message : "Teaser cleanup could not be completed.";
  }
}

export async function removePublicTeaserThumbnail(filePath: string): Promise<string | null> {
  try {
    const { error } = await createAdminClient().storage
      .from(TEASER_PUBLIC_BUCKET)
      .remove([filePath]);
    return error?.message ?? null;
  } catch (error) {
    return error instanceof Error ? error.message : "Public teaser cleanup could not be completed.";
  }
}

export async function promoteTeaserThumbnailToPublic(stagingPath: string): Promise<{
  publicPath: string | null;
  error: string | null;
}> {
  try {
    const publicPath = `accepted/${crypto.randomUUID()}/${stagingPath.split("/").at(-1) ?? "teaser"}`;
    const { error } = await createAdminClient().storage
      .from(TEASER_STAGING_BUCKET)
      .copy(stagingPath, publicPath, { destinationBucket: TEASER_PUBLIC_BUCKET });
    return { publicPath: error ? null : publicPath, error: error?.message ?? null };
  } catch (error) {
    return {
      publicPath: null,
      error: error instanceof Error ? error.message : "Teaser promotion could not be completed.",
    };
  }
}
