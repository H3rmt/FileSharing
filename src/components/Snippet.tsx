import { removeSnippet, unmarkSnippet } from "src/services/snippets";
import type { Snippet } from "../types/file";
import sha from "../../public/icons8-share.svg?raw";
import hid from "../../public/hide-svgrepo-com.svg?raw";
import del from "../../public/icons8-delete.svg?raw";
import { toast } from "src/services/toast";
import type { Accessor } from "solid-js";

export default function Snippet(props: {
  snippet: Snippet;
  viewOld: Accessor<boolean>;
}) {
  const share = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    toast("Not implemented yet");
  };

  const hide = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Hide snippet", props.snippet);
    await unmarkSnippet(props.snippet);
    toast("Snippet hidden");
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

  return (
    <div
      tabindex="0"
      onclick={copy}
      class="focus-visible:outline-solid relative flex min-h-[180px] cursor-pointer flex-col justify-between text-ellipsis whitespace-nowrap rounded-lg border-2 
      border-border focus-within:bg-background-accent focus-visible:outline-1 
      focus-visible:outline-offset-4 focus-visible:outline-text sm:hover:bg-background-accent"
    >
      <div class="mx-2 overflow-auto py-2 text-center">
        <h2 class="text-3xl font-semibold [text-shadow:_0_0_0.2em_#00000069]">
          {props.snippet.name}
        </h2>
      </div>
      <div class="mx-2 overflow-auto py-2 text-center">
        <pre class="max-h-[40dvh] overflow-auto whitespace-pre text-text">
          {props.snippet.text}
        </pre>
      </div>
      <div class="flex flex-row justify-between">
        <button
          class="focus-visible:outline-solid h-14 w-14 rounded-bl-lg rounded-tr-lg border-r-2 border-t-2 border-border bg-background bg-cover
          fill-text focus-visible:fill-accent focus-visible:outline-1
          focus-visible:outline-offset-4 focus-visible:outline-text sm:hover:fill-accent"
          onClick={share}
        >
          <div
            class="m-auto grid h-10 w-10 place-items-center"
            innerHTML={sha}
          ></div>
        </button>
        <span class="flex flex-col items-center gap-0 self-center text-base sm:flex-row sm:gap-2">
          <span class="[text-shadow:_0_0_0.2em_#00000069]">
            {new Date(props.snippet.created).toLocaleString("de-DE")}
          </span>
        </span>
        {props.viewOld() ? (
          <button
            class="focus-visible:outline-solid h-14 w-14 rounded-br-lg rounded-tl-lg border-l-2 border-t-2 border-border bg-background bg-cover
          fill-text focus-visible:fill-accent focus-visible:outline-1
          focus-visible:outline-offset-4 focus-visible:outline-text sm:hover:fill-accent"
            onClick={remove}
          >
            <div
              class="m-auto grid h-10 w-10 place-items-center"
              innerHTML={del}
            ></div>
          </button>
        ) : (
          <button
            class="focus-visible:outline-solid h-14 w-14 rounded-br-lg rounded-tl-lg border-l-2 border-t-2 border-border bg-background bg-cover
          fill-text focus-visible:fill-accent focus-visible:outline-1
          focus-visible:outline-offset-4 focus-visible:outline-text sm:hover:fill-accent"
            onClick={hide}
          >
            <div
              class="m-auto grid h-10 w-10 place-items-center"
              innerHTML={hid}
            ></div>
          </button>
        )}
      </div>
    </div>
  );
}
