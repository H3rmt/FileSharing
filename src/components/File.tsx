import {
  getFileUrl,
  getFileUrls,
  removeFile,
  unmarkFile,
} from "../services/files";
import { Accessor, createResource } from "solid-js";
import type { File } from "../types/file";
import sha from "../../public/icons8-share.svg?raw";
import hid from "../../public/hide-svgrepo-com.svg?raw";
import del from "../../public/icons8-delete.svg?raw";
import { toast } from "src/services/toast";

export function File(props: { file: File; viewOld: Accessor<boolean> }) {
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
    displayURL = "var(--file-empty-bg)";
  }

  const share = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const firstFile = props.file.file[0];
    if (props.file.file.length > 1) {
      console.log("Share multiple files", props.file);
      const urls = await getFileUrls(props.file);
      let text = "";
      for (const url of urls) {
        text += url + "\n";
      }
      navigator.clipboard.writeText(text);
      toast(`Copied links to ${urls.length} files`);
      return;
    } else if (firstFile) {
      console.log("Share file", props.file);
      const url = getFileUrl(props.file, firstFile, false);
      navigator.clipboard.writeText(url);
      toast("Copied link to file");
      return;
    }
  };

  const hide = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Hide file", props.file);
    await unmarkFile(props.file);
    toast("File hidden");
  };

  const remove = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Remove permanently?")) return;
    console.log("Remove file", props.file);
    await removeFile(props.file);
    toast("File removed");
  };

  const download = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if ((urls()?.length ?? 0) > 1) {
      console.log("Multiple files");
      for (const url of urls() ?? []) {
        window.open(url + "?download=1", "_blank");
        toast("File downloaded");
      }
    } else {
      console.log("1 file");
      window.open(urls()?.[0] + "?download=1", "_blank");
      toast("File downloaded");
    }
    await unmarkFile(props.file);
  };

  return (
    <a
      target="_blank"
      download={props.file.name}
      href=""
      onclick={download}
      class="focus-visible:outline-solid relative flex min-h-[180px] cursor-pointer flex-col justify-between
      text-ellipsis whitespace-nowrap rounded-lg border-2 border-border bg-cover
      before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:rounded-lg before:bg-img-background before:bg-cover before:bg-center before:blur-[1px]
      before:content-[''] focus-within:bg-background-accent focus-visible:outline-1
      focus-visible:outline-offset-4 focus-visible:outline-text sm:hover:bg-background-accent"
      style={`--img-background: ${displayURL}`}
    >
      <div class="mx-2 overflow-auto py-2 text-center">
        <h2 class="text-3xl font-semibold text-white mix-blend-difference [text-shadow:_0_0_0.2em_#00000069]">
          {props.file.name}
        </h2>
      </div>
      <div class="flex flex-row justify-between">
        <button
          class="focus-visible:outline-solid h-14 w-14 rounded-bl-md rounded-tr-lg border-r-2 border-t-2 border-border bg-background bg-cover
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
          <span class="text-white mix-blend-difference [text-shadow:_0_0_0.2em_#00000069]">
            {new Date(props.file.created).toLocaleString("de-DE")}
          </span>
          <span class="text-white mix-blend-difference [text-shadow:_0_0_0.2em_#00000069]">
            {props.file.file.length > 1
              ? props.file.file.length + " Files"
              : ""}
          </span>
        </span>
        {props.viewOld() ? (
          <button
            class="focus-visible:outline-solid h-14 w-14 rounded-br-md rounded-tl-lg border-l-2 border-t-2 border-border bg-background bg-cover
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
            class="focus-visible:outline-solid h-14 w-14 rounded-br-md rounded-tl-lg border-l-2 border-t-2 border-border bg-background bg-cover
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
    </a>
  );
}
