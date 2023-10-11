import type {Snippet as S} from '../types/file'
import {For, Accessor} from "solid-js";
import { Snippet } from './Snippet';

export function SnippetList(props: { snippets: S[], old: Accessor<boolean> }) {
  return <ul role="list" class="grid grid-cols-[repeat(auto-fit,_minmax(35ch,_1fr))] gap-2 overflow-auto p-0 m-0">
    <For each={props.snippets.filter(s => props.old() || s.new)}>
      {(snippet) => <Snippet snippet={snippet}/>}
    </For>
  </ul>
}