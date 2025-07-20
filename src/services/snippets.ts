import type { RecordSubscription } from "pocketbase";
import type { Snippet as S } from "../types/file";
import { pb } from "./pocketpase";
import { toast } from "./toast";

export async function getSnippets(): Promise<S[]> {
  try {
    return await pb.collection("snippets").getFullList<S>();
  } catch (error) {
    toast("Error fetching snippets");
    console.error("Error fetching snippets:", error);
    return [];
  }
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
  callback: (file: RecordSubscription<S>) => void
): Promise<() => Promise<void>> {

  try {
    return await pb.collection("snippets").subscribe<S>("*", (ev) => {
      console.log("Snippets updated");
      callback(ev);
    });
  } catch (error) {
    toast("Error subscribing to snippets");
    console.error("Error subscribing to snippets:", error);
    return async () => {
    };
  }
}
