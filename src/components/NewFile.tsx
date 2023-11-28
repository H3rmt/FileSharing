import { createSignal } from "solid-js";
import { isDuplicateFile, uploadFile } from "../services/files";
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
      if (await isDuplicateFile(name())) {
        if (
          !confirm("File/Files with same name already exists. Upload anyway?")
        )
          return;
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
    document.getElementById("f-dropzone")?.classList.remove("bg-textbg");

    console.log("Drop", e.dataTransfer?.files);
    addFiles(e.dataTransfer?.files ?? null);
  };

  let hovering = 0; // 0 = false, 1 = true, 2 = false but delayed

  const dragover = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("f-dropzone")?.classList.add("bg-textbg");
    hovering = 1;
  };
  const dragoverleave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hovering = 2;
    setTimeout(() => {
      if (hovering === 2) {
        document.getElementById("f-dropzone")?.classList.remove("bg-textbg");
        hovering = 0;
      }
    }, 200);
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
    <div class="flex justify-center">
      <div class="rounded-lg bg-textbg p-1">
        <div class="flex justify-center overflow-auto rounded-lg bg-background p-1">
          <form
            class="grid w-fit grid-cols-[1fr_auto] grid-rows-3 gap-4 p-2 sm:grid-cols-[auto_1fr_auto] sm:grid-rows-2"
            id="f-dropzone"
            ondragleave={dragoverleave}
            ondragover={dragover}
            ondrop={drop}
            onsubmit={submit}
          >
            <span class="col-span-2 flex w-full items-center justify-center text-3xl font-bold sm:col-span-1">
              Add&nbsp;<ImportantText>File</ImportantText>
            </span>
            <input
              type="text"
              class="focus-visible:outline-solid col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2
            focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-1 focus-visible:outline-offset-4
            focus-visible:outline-text sm:hover:bg-background-accent sm:hover:text-accent"
              value={name()}
              placeholder="Custom Name"
              oninput={(e) => setName(e.target.value)}
            />
            <input
              type="submit"
              class="focus-visible:outline-solid col-span-1 w-full rounded-lg border-2 border-border bg-transparent
            p-2 focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-1
            focus-visible:outline-offset-4 focus-visible:outline-text sm:hover:bg-background-accent sm:hover:text-accent"
              value="Upload"
            />
            <input
              type="file"
              class="focus-visible:outline-solid col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2
            focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-1 focus-visible:outline-offset-4
            focus-visible:outline-text sm:col-span-2 sm:hover:bg-background-accent sm:hover:text-accent"
              value={files().map((f) => f.name)}
              placeholder="Files"
              multiple
              onchange={input}
            />
            <div class="col-span col-span-1 flex w-full items-center p-2 text-center text-base">
              {fileCount()}&nbsp;Files
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
