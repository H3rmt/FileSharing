import { getSize } from "src/services/files";
import type { File as F, Snippet as S } from "../types/file";
import ImportantText from "./importantText";
import { createResource, Accessor, Setter } from "solid-js";

export function Info(props: {
  files: F[];
  snippets: S[];
  old: Accessor<boolean>;
  setOld: Setter<boolean>;
}) {
  const [size, {}] = createResource(getSize);

  return (
    <div
      class="rounded-lg flex p-0.5 shadow-[0_0_15px_15px_rgba(130_1_120/20%)] bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
      <div class="flex flex-1 justify-between gap-2 rounded-lg bg-white dark:bg-slate-950 p-2">
        <p class="m-0 leading-5">
          This is a file/snippet sharing service. You can upload files and
          snippets to share them with others. <br />
          Currently{" "}
          <ImportantText>
            {props.files.filter((f) => f.new).length}
          </ImportantText>{" "}
          new files and <ImportantText>{props.files.length}</ImportantText>{" "}
          files are stored on the server using{" "}
          <ImportantText>{Math.round(size() / 1000000)}</ImportantText> MB.{" "}
          <br />
          <ImportantText>
            {props.snippets.filter((f) => f.new).length}
          </ImportantText>{" "}
          new snippets and{" "}
          <ImportantText>{props.snippets.length}</ImportantText> snippets are
          stored in total.
        </p>
        <div class="hidden">
          <a target="_blank" href="https://icons8.com/icon/99961/delete">
            Delete
          </a>{" "}
          icon by{" "}
          <a target="_blank" href="https://icons8.com">
            Icons8
          </a>
          <a target="_blank" href="https://icons8.com/icon/CEuLWmn45H5H/share">
            Share
          </a>{" "}
          icon by{" "}
          <a target="_blank" href="https://icons8.com">
            Icons8
          </a>
        </div>
        <span
          class="flex p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
         <button
           class="cursor-pointer rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
           onClick={() => props.setOld(!props.old())}
         >
          {props.old() ? "Hide Old" : "Show Old"}
        </button>
        </span>
      </div>
    </div>
  );
}
