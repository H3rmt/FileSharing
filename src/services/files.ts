import type { RecordSubscription } from "pocketbase";
import type { File as F } from "../types/file";
import { pb } from "./pocketpase";

export async function getSize() {
  return (await pb.send("/api/size", {}))?.size ?? -1;
}

export async function getName() {
  return (await pb.send("/api/name", {}))?.name ?? "?File Sharing?";
}

export async function getFiles(): Promise<F[]> {
  return await pb.collection("files").getFullList<F>();
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
  crop: boolean = false,
): string {
  return pb.files.getUrl(file, name, crop ? { thumb: "200x180" } : {});
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
  callback: (file: RecordSubscription<F>) => void,
): Promise<() => Promise<void>> {
  return await pb.collection("files").subscribe<F>("*", (ev) => {
    console.log("Files updated");
    callback(ev);
  });
}
