import { File } from "./File";
import type { File as F } from "../types/file";
import { For, Accessor } from "solid-js";

export function FileList(props: { files: F[]; old: Accessor<boolean> }) {
  return (
    <ul
      role="list"
      class="m-0 grid grid-cols-[repeat(auto-fit,minmax(17em,1fr))] gap-2 p-0"
    >
      <For each={props.files.filter((f) => props.old() || f.new)}>
        {(file) => <File file={file} viewOld={props.old} />}
      </For>
    </ul>
  );
}
