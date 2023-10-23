import { removeSnippet, unmarkSnippet } from "src/services/snippets";
import type { Snippet } from "../types/file";

export function Snippet(props: { snippet: Snippet }) {
  const close = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Close snippet", props.snippet);
    await unmarkSnippet(props.snippet);
  };

  const remove = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Remove permanently?")) return;
    console.log("Remove file", props.snippet);
    await removeSnippet(props.snippet);
  };

  const copy = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(props.snippet.text);
    console.log("Copy snippet", props.snippet);
    await unmarkSnippet(props.snippet);
  };

  // removed mix-blend-difference, caused weird coloring on white mode
  return (
    <div
      tabindex="0"
      onclick={copy}
      class="relative flex min-h-[100px] cursor-pointer flex-col overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border-2 border-border bg-cover p-3 
      focus:bg-background-accent focus:text-accent sm:hover:bg-background-accent sm:hover:text-accent
      "
    >
      <h2 class="mb-1 text-3xl [text-shadow:_0_0_0.2em_#00000069]">
        {props.snippet.name}
      </h2>
      <div class="absolute right-1 top-1 z-50 flex items-start gap-3 rounded-lg font-bold [text-shadow:_0_0_0.2em_#00000069]">
        <div>{new Date(props.snippet.created).toLocaleString()}</div>
        <div
          class="cursor-pointer rounded-lg border-2 border-dashed border-border p-1 sm:hover:bg-background-accent"
          onclick={props.snippet.new ? close : remove}
        >
          X
        </div>
      </div>
      <pre class="max-h-[40dvh] overflow-auto whitespace-pre text-text">
        {props.snippet.text}
      </pre>
    </div>
  );
}
