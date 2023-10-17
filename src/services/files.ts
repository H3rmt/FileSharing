import type { RecordSubscription } from "pocketbase";
import type { File as F } from "../types/file";
import { pb } from "./pocketpase";

export async function getSize() {
  return await pb.send("/size", {});
}

export async function getFiles(): Promise<F[]> {
  return await pb.collection("files").getFullList<F>();
}

export async function isDuplicateFile(name: string): Promise<boolean> {
  const files = await pb.collection("files").getFullList<F>({ name });

  return files.some((file) => file.name === name);
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
  return pb.files.getUrl(file, name, crop ? { thumb: "300x300" } : {});
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
