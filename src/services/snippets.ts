import type { RecordSubscription } from "pocketbase";
import type { Snippet as S } from "../types/file";
import { pb } from "./pocketpase";

export async function getSnippets(): Promise<S[]> {
  return await pb.collection("snippets").getFullList<S>();
}

export async function isDuplicateSnippet(name: string): Promise<boolean> {
  const snippets = await pb.collection("snippets").getFullList<S>({ name });
  console.log(snippets, "snippets");
  return snippets.some((snippet) => snippet.name === name);
}

export async function uploadSnippet(data: FormData): Promise<void> {
  await pb.collection("snippets").create(data);
}

export async function unmarkSnippet(snippet: S): Promise<void> {
  await pb.collection("snippets").update(snippet.id, { new: false });
}

export async function removeSnippet(snippet: S): Promise<void> {
  await pb.collection("snippets").delete(snippet.id);
}

export async function subscribeSnippets(
  callback: (file: RecordSubscription<S>) => void,
): Promise<() => Promise<void>> {
  return await pb.collection("snippets").subscribe<S>("*", (ev) => {
    console.log("Snippets updated");
    callback(ev);
  });
}
