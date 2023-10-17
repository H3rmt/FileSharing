import { createSignal } from "solid-js";
import { isDuplicateFile, uploadFile } from "../services/files";
import ImportantText from "./importantText";
import { toast } from "../services/toast";

export function NewFile() {
  const [name, setName] = createSignal("");
  const [files, setFiles] = createSignal<File[]>([]);
  const [fileCount, setFileCount] = createSignal(0);

  const submit = async () => {
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
      <div
        class="flex flex-col items-center  gap-4 overflow-auto rounded-lg bg-background p-2"
        id="f-dropzone"
        ondragleave={dragoverleave}
        ondragover={dragover}
        ondrop={drop}
      >
        <div class="flex flex-row gap-4 overflow-auto">
          <span class="hidden text-3xl font-bold sm:block">
            Add <ImportantText>File</ImportantText>
          </span>
          <input
            type="text"
            class="rounded-lg border-2 border-border bg-transparent p-2
            hover:bg-background-accent hover:text-accent focus:bg-background-accent focus:text-accent"
            value={name()}
            placeholder="Custom Name"
            oninput={(e) => setName(e.target.value)}
          />
          <input
            type="submit"
            class="rounded-lg border-2 border-border bg-transparent p-2
            hover:bg-background-accent hover:text-accent focus:bg-background-accent focus:text-accent"
            value="Upload"
            onclick={submit}
          />
        </div>
        <div class="flex flex-row items-center gap-4 overflow-auto">
          <input
            type="file"
            class="rounded-lg border-2 border-border bg-transparent p-2
            hover:bg-background-accent hover:text-accent focus:bg-background-accent focus:text-accent"
            value={files().map((f) => f.name)}
            placeholder="File name"
            multiple
            onchange={input}
          />
          <div class="count">{fileCount()}</div>
        </div>
      </div>
    </div>
  );
}
