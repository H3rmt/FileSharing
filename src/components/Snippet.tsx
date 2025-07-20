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
    toast("Snippet copied");
  };

  return (
    <div
      class="flex rounded-lg bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
      <a
        target="_blank"
        tabindex="0"
        href=""
        onclick={copy}
        class="
      relative flex min-h-[180px] flex-col justify-between
      text-ellipsis whitespace-nowrap

      cursor-pointer rounded-lg border-transparent overflow-auto flex-1
      focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
      focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
"
      >
        <div class="mx-2 overflow-auto py-2 text-center">
          <h2 class="text-3xl font-semibold [text-shadow:2px_2px_0.2em_#000000de]">
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
            class="
                  h-16 w-16 cursor-pointer p-2 bg-gray-950/55 fill-white
                border-gray-950 border-r-2 border-t-2 rounded-tr-xl
                  focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                  focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white"
            onClick={share}
          >
            <div
              class="m-auto grid h-10 w-10 place-items-center"
              innerHTML={sha}
            ></div>
          </button>
          {props.viewOld() ? (
            <button
              class="
                  h-16 w-16 cursor-pointer p-2 bg-gray-950/55 fill-white
                border-gray-950 border-l-2 border-t-2 rounded-tl-xl
                  focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                  focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white"
              onClick={remove}
            >
              <div
                class="m-auto grid h-10 w-10 place-items-center"
                innerHTML={del}
              ></div>
            </button>
          ) : (
            <button
              class="
                  h-16 w-16 cursor-pointer p-2 bg-gray-950/55 fill-white
                border-gray-950 border-l-2 border-t-2 rounded-tl-xl
                  focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                  focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white"
              onClick={hide}
            >
              <div
                class="m-auto grid h-10 w-10 place-items-center"
                innerHTML={hid}
              ></div>
            </button>
          )}
        </div>
      </a>
    </div>
  );
}
