import { createSignal } from "solid-js";
import { isDuplicateFile, removeFile, uploadFile } from "../services/files";
import ImportantText from "./importantText";
import { toast } from "../services/toast";

export function NewFile() {
  const [name, setName] = createSignal("");
  const [files, setFiles] = createSignal<File[]>([]);
  const [fileCount, setFileCount] = createSignal(0);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    console.log("Submit new file");

    if ((files() ?? []).length === 0) {
      toast("No files");
      return;
    }
    if (name() === "" || name().length < 3) {
      toast("No name / to short");
      return;
    }

    try {
      const files = await isDuplicateFile(name());
      if (files.length > 0) {
        if (
          !confirm(
            "File/Files with same name already exists. OVERRIDE the previous?",
          )
        )
          return;

        for (let file of files) {
          console.log("Remove file");
          await removeFile(file);
          toast("File removed");
        }
      }
    } catch (e) {
      console.error(e);
      toast("Error checking for duplicate file");
      return;
    }

    const formData = new FormData();
    formData.append("name", name());
    formData.append("new", "true");

    for (let file of files() ?? []) {
      formData.append("file", file);
    }

    setName("");
    setFiles([]);
    setFileCount(0);

    toast("Uploading");
    try {
      await uploadFile(formData);
    } catch (e) {
      console.error(e);
      toast("Error uploading file");
      return;
    }
    toast("Upload finished");
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document
      .getElementById("f-dropzone")
      ?.classList.remove("shadow-[inset_0_0_70px_30px_rgba(130,1,120,0.4)]");

    console.log("Drop", e.dataTransfer?.files);
    addFiles(e.dataTransfer?.files ?? null);
  };

  let hovering = 0; // 0 = false, 1 = true, 2 = false but delayed

  const dragover = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document
      .getElementById("f-dropzone")
      ?.classList.add("shadow-[inset_0_0_70px_30px_rgba(130,1,120,0.4)]");
    hovering = 1;
  };
  const dragoverleave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hovering = 2;
    setTimeout(() => {
      if (hovering === 2) {
        document
          .getElementById("f-dropzone")
          ?.classList.remove(
            "shadow-[inset_0_0_70px_30px_rgba(130,1,120,0.4)]",
          );
        hovering = 0;
      }
    }, 120);
  };

  const input = (e: Event) => {
    addFiles((e.target as HTMLInputElement).files);
  };

  const addFiles = (newFiles: FileList | null) => {
    const f = files();
    for (let file of newFiles ?? []) {
      f.push(file);
    }
    if (name() === "") setName(f.at(-1)?.name ?? "");
    setFiles(f);
    setFileCount(f.length);
  };

  return (
    <div
      class="rounded-lg mx-auto flex p-0.5 shadow-[0_0_15px_15px_rgba(130_1_120/20%)] bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
      <div class="flex flex-1 justify-center gap-2 rounded-lg bg-white dark:bg-slate-950 p-2">
        <div
          class="flex justify-center overflow-auto rounded-lg bg-background p-1"
          id="f-dropzone"
        >
          <form
            class="grid w-fit grid-cols-[1fr_auto] grid-rows-3 gap-4 p-2 sm:grid-cols-[auto_1fr_auto] sm:grid-rows-2"
            ondragleave={dragoverleave}
            ondragover={dragover}
            ondrop={drop}
            onsubmit={submit}
          >
            <span class="col-span-2 flex w-full items-center justify-center text-3xl font-bold sm:col-span-1">
              Add&nbsp;<ImportantText>File</ImportantText>
            </span>
            <span
              class="col-span-1 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
            <input
              type="text"
              class="cursor-text rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
              value={name()}
              placeholder="Custom Name"
              oninput={(e) => setName(e.target.value)}
            />
            </span>
            <span
              class="col-span-1 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
            <input
              type="submit"
              class="cursor-pointer rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
              value="Upload"
            />
            </span>
            <span
              class="col-span-2 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
            <input
              type="file"
              class="cursor-text rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
              value={files().map((f) => f.name)}
              placeholder="Files"
              multiple
              onchange={input}
            />
            </span>
            <div class="col-span col-span-1 flex w-full items-center p-2 text-center text-base">
              {fileCount()}&nbsp;Files
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
