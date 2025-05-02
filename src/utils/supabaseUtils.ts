import { createClient } from "@supabase/supabase-js";
import { SUPABASE_JWT, SUPABASE_URL } from "api/config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_JWT);

export const uploadImage = async (file: File, filePath: string) => {
  return await supabase.storage.from("content").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });
};

export const getImage = (filePath: string) =>
  supabase.storage.from("content").getPublicUrl(filePath);
