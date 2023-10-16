import { removeSnippet, unmarkSnippet } from "src/services/snippets";
import type { Snippet } from "../types/file";

export function Snippet(props: { snippet: Snippet }) {
  const close = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Close snippet", props.snippet)
    await unmarkSnippet(props.snippet)
  }

  const remove = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Remove file", props.snippet)
    await removeSnippet(props.snippet)
  }

  const copy = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(props.snippet.text);
    console.log("Copy snippet", props.snippet)
    await unmarkSnippet(props.snippet)
  }

  return <div onclick={copy}
    class="flex flex-col relative p-3 bg-cover rounded-md mix-blend-difference min-h-[100px] text-ellipsis
  whitespace-nowrap overflow-hidden sm:hover:text-accent border-2 border-accent cursor-pointer sm:hover:bg-textbg">
    <h2 class="mb-1 text-3xl [text-shadow:_0_0_0.4em_black]">{props.snippet.name}</h2>
    <div class="absolute z-50 right-1 top-1 flex items-start gap-3 rounded-lg font-bold [text-shadow:_0_0_0.4em_black]">
      <div>{new Date(props.snippet.created).toLocaleString()}</div>
      <div class='p-1 cursor-pointer rounded-lg border-dashed border-2 border-accent sm:hover:bg-background-accent' onclick={props.snippet.new ? close : remove}>X</div>
    </div>
    <p class="whitespace-normal max-h-[40dvh] overflow-auto text-text">{props.snippet.text}</p>
  </div>
}