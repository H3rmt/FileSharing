import type { Snippet as S } from "../types/file";
import { For, Accessor } from "solid-js";
import Snippet from "./Snippet";

export function SnippetList(props: { snippets: S[]; old: Accessor<boolean> }) {
  return (
    <ul
      role="list"
      class="m-0 grid grid-cols-[repeat(auto-fit,minmax(17em,1fr))] gap-2 p-0"
    >
      <For each={props.snippets.filter((s) => props.old() || s.new)}>
        {(snippet) => <Snippet snippet={snippet} viewOld={props.old} />}
      </For>
    </ul>
  );
}
