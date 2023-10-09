import { unmarkSnippet } from "src/services/snippets";
import type { Snippet } from "../types/file";

export function Snippet(props: { snippet: Snippet }) {
  const close = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Close snippet", props.snippet)
    await unmarkSnippet(props.snippet)
  }

  const copy = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(props.snippet.text);
    console.log("Copy snippet", props.snippet)
    await unmarkSnippet(props.snippet)
  }

  return <div onclick={copy} class="file existingFile">
    <h2>{props.snippet.name}</h2>
    <div class="close">
      <div>{new Date(props.snippet.created).toLocaleString()}</div>
      <div class="close-btn"onclick={close}>X</div>
    </div>
    <p class="data">{props.snippet.text}</p>
  </div>
}