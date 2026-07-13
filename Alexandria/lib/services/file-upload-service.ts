import { createClient } from "../supabase/client";
import { err, makeError, ok } from "./result";
import type { ServiceResult } from "./types";

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * For MVP, this handles the file upload to the school server simulation.
 * In production, this would upload to the actual school server.
 */
export async function uploadFileToStorage(
  thesisId: number,
  file: File
): Promise<ServiceResult<{ fileUrl: string; fileType: string }>> {
  try {
    // For MVP: Simulate file upload by creating a mock URL
    // In production, this would upload to actual storage
    const mockFileUrl = `https://dcism.usc.edu.ph/repository/thesis_${thesisId}_${Date.now()}.pdf`;

    return ok({
      fileUrl: mockFileUrl,
      fileType: file.type || "application/pdf",
    });
  } catch (error: any) {
    return err(makeError("UPLOAD_FAILED", error.message || "File upload failed"));
  }
}

/**
 * Alternative: Upload file directly to Supabase Storage bucket if configured.
 * This is a more realistic implementation for testing purposes.
 */
export async function uploadToSupabaseStorage(
  thesisId: number,
  file: File
): Promise<ServiceResult<{ fileUrl: string; fileType: string }>> {
  try {
    const supabase = createClient();

    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `thesis_${thesisId}_${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("theses")
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("theses")
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return ok({
      fileUrl: urlData.publicUrl,
      fileType: file.type || "application/pdf",
    });
  } catch (error: any) {
    return err(makeError("UPLOAD_FAILED", error.message || "File upload failed"));
  }
}
