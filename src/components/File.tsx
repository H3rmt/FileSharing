import {
  getFileUrl,
  getFileUrls,
  removeFile,
  unmarkFile,
} from "../services/files";
import { Accessor, createResource } from "solid-js";
import type { File } from "../types/file";
import share from "../../public/icons8-share.svg?raw";
import hide from "../../public/hide-svgrepo-com.svg?raw";
import del from "../../public/icons8-delete.svg?raw";

export function File(props: { file: File, viewOld: Accessor<boolean> }) {
  const loadURL = async () => await getFileUrls(props.file);
  const [urls] = createResource(loadURL);

  let displayURL: string;
  const firstFile = props.file.file[0];
  const type = firstFile?.split(".").pop()?.toLowerCase();
  if (
    firstFile &&
    (type === "jpg" ||
      type === "png" ||
      type === "gif" ||
      type === "jpeg" ||
      type === "webp")
  ) {
    displayURL = "url(" + getFileUrl(props.file, firstFile, true) + ")";
  } else {
    displayURL = "var(--textbg)";
  }

  const close = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Close file", props.file);
    await unmarkFile(props.file);
  };

  const remove = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Remove permanently?")) return;
    console.log("Remove file", props.file);
    await removeFile(props.file);
  };

  const open = async (e: Event) => {
    if ((urls()?.length ?? 0) > 1) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Multiple files");

      for (const url of urls() ?? []) {
        window.open(url + "?download=1", "_blank");
      }
    }

    await unmarkFile(props.file);
  };

  return (
    <a
      target="_blank"
      download={props.file.name}
      href={urls()?.length === 1 ? urls()?.[0] + "?download=1" ?? "" : ""}
      onclick={open}
      class="relative flex min-h-[150px] cursor-pointer flex-col justify-between overflow-hidden text-ellipsis
      whitespace-nowrap rounded-lg border-2 border-border bg-cover
      before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:bg-img-background before:bg-cover before:bg-center before:blur-[2px] before:content-['']
      focus-within:bg-background-accent focus-visible:outline-dotted focus-visible:outline-2
      focus-visible:outline-offset-2 focus-visible:outline-white sm:hover:bg-background-accent"
      style={`--img-background: ${displayURL}`}
    >
      <div class="py-1 overflow-auto mx-2 text-center">
        <h2 class="text-3xl font-semibold [text-shadow:_0_0_0.2em_#00000069]">
          {props.file.name}
        </h2>
      </div>
      <div class="flex flex-row justify-between">
        <button class="h-14 w-14 rounded-tr-lg border-r-2 border-t-2 border-border bg-background bg-cover fill-text
          focus-visible:fill-accent focus-visible:outline-dotted focus-visible:outline-2
          focus-visible:outline-offset-1 focus-visible:outline-white sm:hover:fill-accent"
            onClick={close}
          ><div
            class="m-auto grid h-10 w-10 place-items-center"
            innerHTML={share}
          ></div>
        </button>
        <span class="self-center text-xl [text-shadow:_0_0_0.2em_#00000069]">
          {new Date(props.file.created).toLocaleString("de-DE")}
          &nbsp;&nbsp;&nbsp;
          {props.file.file.length > 1 ? props.file.file.length + " Files" : ""}
        </span>
        {props.viewOld() ? (
          <button class="h-14 w-14 rounded-tl-lg border-l-2 border-t-2 border-border bg-background bg-cover fill-text
          focus-visible:fill-accent focus-visible:outline-dotted focus-visible:outline-2
          focus-visible:outline-offset-1 focus-visible:outline-white sm:hover:fill-accent"
            onClick={remove}
          >
            <div
              class="m-auto grid h-10 w-10 place-items-center"
              innerHTML={hide}
            ></div>
          </button>
        ) : (
          <button class="h-14 w-14 rounded-tl-lg border-l-2 border-t-2 border-border bg-background bg-cover fill-text
          focus-visible:fill-accent focus-visible:outline-dotted focus-visible:outline-2
          focus-visible:outline-offset-1 focus-visible:outline-white sm:hover:fill-accent"
            onClick={close}
          >
            <div
              class="m-auto grid h-10 w-10 place-items-center"
              innerHTML={del}
            ></div>
          </button>
        )}
      </div>
    </a>
  );
}
