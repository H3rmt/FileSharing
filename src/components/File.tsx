import {
  getFileUrl,
  getFileUrls,
  removeFile,
  unmarkFile,
} from "../services/files";
import { createResource } from "solid-js";
import type { File } from "../types/file";

export function File(props: { file: File }) {
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

  // removed mix-blend-difference, caused weird coloring on white mode
  return (
    <a
      target="_blank"
      download={props.file.name}
      href={urls()?.length === 1 ? urls()?.[0] + "?download=1" ?? "" : ""}
      onclick={open}
      class="relative flex min-h-[100px] cursor-pointer flex-col overflow-hidden text-ellipsis whitespace-nowrap
      rounded-lg border-2 border-border bg-cover 
      p-3 
      before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:bg-img-background before:bg-cover before:bg-center before:blur-[2px] before:content-['']
      sm:hover:bg-background-accent sm:hover:text-accent focus:bg-background-accent focus:text-accent"
      style={`--img-background: ${displayURL}`}
    >
      <div class="absolute right-1 top-1 z-50 flex items-start gap-3 rounded-lg font-bold [text-shadow:_0_0_0.2em_#00000069]">
        {new Date(props.file.created).toLocaleString()}
        <div
          class="cursor-pointer rounded-lg border-2 border-dashed border-border p-1 sm:hover:bg-background-accent"
          onclick={props.file.new ? close : remove}
        >
          X
        </div>
      </div>
      <h2 class="mb-1 text-3xl [text-shadow:_0_0_0.2em_#00000069]">
        {props.file.name}
      </h2>
      {props.file.file.length > 1 ? (
        <div class="absolute bottom-1 right-1 z-50 rounded-lg border-2 border-dashed border-border p-1 font-bold">
          {props.file.file.length}
        </div>
      ) : (
        ""
      )}
    </a>
  );
}
