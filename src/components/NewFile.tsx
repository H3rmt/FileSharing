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

    if (await isDuplicateFile(name())) {
      if (
        !confirm(
          "File/Files with same name already exists. Do you want to upload it?",
        )
      )
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

    await uploadFile(formData);
    toast("Hochgeladen");
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("f-dropzone")?.classList.remove("bg-transparent");

    console.log("Drop", e.dataTransfer?.files);
    addFiles(e.dataTransfer?.files ?? null);
  };

  const dragover = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("f-dropzone")?.classList.add("bg-transparent");
  };
  const dragoverleave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("f-dropzone")?.classList.remove("bg-transparent");
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
    <div class="rounded-lg bg-textbg p-1">
      <div class="flex justify-center overflow-auto rounded-lg bg-background">
        <form
          class="grid w-fit grid-cols-[1fr_auto] grid-rows-3 p-2 gap-4 sm:grid-cols-[auto_1fr_auto] sm:grid-rows-2"
          id="f-dropzone"
          ondragleave={dragoverleave}
          ondragover={dragover}
          ondrop={drop}
          onsubmit={submit}
        >
          <span class="col-span col-span-2 flex w-full items-center justify-center text-3xl font-bold sm:col-span-1">
            Add&nbsp;<ImportantText>File</ImportantText>
          </span>
          <input
            type="text"
            class="col-span col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2 focus-visible:bg-background-accent
            focus-visible:text-accent focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-white sm:hover:bg-background-accent sm:hover:text-accent"
            value={name()}
            placeholder="Custom Name"
            oninput={(e) => setName(e.target.value)}
          />
          <input
            type="submit"
            class="col-span col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2
            focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-dotted focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-white sm:hover:bg-background-accent sm:hover:text-accent"
            value="Upload"
          />
          <input
            type="file"
            class="col-span col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2 focus-visible:bg-background-accent
            focus-visible:text-accent focus-visible:outline-dotted focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-white sm:col-span-2 sm:hover:bg-background-accent sm:hover:text-accent"
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
  );
}
