import {File} from './File'
import type {File as F} from '../types/file'
import {For} from "solid-js";

export function List(props: { files: F[] }) {
  return <ul role="list" class="files">
    <For each={props.files.filter(f => f.new)}>
      {(file) => <File file={file}/>}
    </For>
  </ul>
}