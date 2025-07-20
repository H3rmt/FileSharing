import type { RecordSubscription } from "pocketbase";
import type { File as F } from "../types/file";
import { pb } from "./pocketpase";
import { toast } from "./toast";

export async function getSize() {
  try {
    return (await pb.send("/api/size", {}))?.size ?? -1;
  } catch (error) {
    toast("Error fetching size");
    console.error("Error fetching size:", error);
    return -1;
  }
}

export async function getName() {
  try {
    return (await pb.send("/api/name", {}))?.name ?? "?File Sharing?";
  } catch (error) {
    toast("Error fetching name");
    console.error("Error fetching name:", error);
    return "?File Sharing?";
  }
}

export async function getFiles(): Promise<F[]> {
  try {
    return await pb.collection("files").getFullList<F>();
  } catch (error) {
    toast("Error fetching files");
    console.error("Error fetching files:", error);
    return [];
  }
}

export async function isDuplicateFile(name: string): Promise<F[]> {
  const files = await pb.collection("files").getFullList<F>({ name });

  return files.filter((file) => file.name === name);
}

export async function getFileUrls(file: F): Promise<string[]> {
  return file.file.map((filename) => {
    return getFileUrl(file, filename, false);
  });
}

export function getFileUrl(
  file: F,
  name: string,
  crop: boolean = false
): string {

  return pb.files.getURL(file, name, crop ? { thumb: "200x180" } : {});
}

export async function uploadFile(data: FormData): Promise<void> {
  await pb.collection("files").create(data);
}

export async function unmarkFile(file: F): Promise<void> {
  await pb.collection("files").update(file.id, { new: false });
}

export async function removeFile(file: F): Promise<void> {
  await pb.collection("files").delete(file.id);
}

export async function subscribeFiles(
  callback: (file: RecordSubscription<F>) => void
): Promise<() => Promise<void>> {
  try {
    return await pb.collection("files").subscribe<F>("*", (ev) => {
      console.log("Files updated");
      callback(ev);
    });
  } catch (error) {
    toast("Error subscribing to files");
    console.error("Error subscribing to files:", error);
    return async () => {
    };
  }
}
