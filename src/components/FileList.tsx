import {File} from './File'
import type {File as F} from '../types/file'
import {For, Accessor} from "solid-js";

export function FileList(props: { files: F[], old: Accessor<boolean> }) {
  return <ul role="list" class="files">
    <For each={props.files.filter(f => props.old() || f.new)}>
      {(file) => <File file={file}/>}
    </For>
  </ul>
}