import { createSignal } from "solid-js";
import { uploadFile } from "../services/files";
import ImportantText from "./importantText";

export function NewFile() {
  const [name, setName] = createSignal("")
  const [files, setFiles] = createSignal<File[]>([])
  const [fileCount, setFileCount] = createSignal(0)

  const submit = async () => {
    console.log("Submit new file")

    if ((files() ?? []).length === 0) {
      alert("No files")
      return
    }
    if (name() === "" || name().length < 3) {
      alert("No name / to short")
      return
    }

    const formData = new FormData();
    formData.append('name', name());
    formData.append('new', 'true');

    for (let file of files() ?? []) {
      formData.append('file', file);
    }

    setName("")
    setFiles([])
    setFileCount(0)

    await uploadFile(formData)
    setTimeout(() => alert("Hochgeladen"), 100);
  }

  const drop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById("dropzone")?.classList.remove("bg-transparent")

    console.log("Drop", e.dataTransfer?.files)
    addFiles(e.dataTransfer?.files ?? null)
  }

  const dragover = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById("dropzone")?.classList.add("bg-transparent")
  }
  const dragoverleave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById("dropzone")?.classList.remove("bg-transparent")
  }

  const input = (e: Event) => {
    addFiles((e.target as HTMLInputElement).files)
  }

  const addFiles = (newFiles: FileList | null) => {
    const f = files()
    for (let file of newFiles ?? []) {
      f.push(file)
    }
    if (name() === "")
      setName(f.at(-1)?.name ?? '')
    setFiles(f)
    setFileCount(f.length)
  }

  return <div class='rounded-md bg-textbg p-0.5'>
    <div class="flex flex-col items-center  gap-4 p-2 rounded-lg bg-background overflow-auto"
      id="dropzone" ondragleave={dragoverleave} ondragover={dragover}
      ondrop={drop}>
      <div class="flex flex-row gap-4 overflow-auto">
        <span class="text-3xl font-bold hidden sm:block">Add <ImportantText>File</ImportantText></span>
        <input type="text" class="bg-transparent border-2 rounded-lg border-accent p-2" value={name()} placeholder="Custom Name" oninput={(e) => setName(e.target.value)} />
        <input type="submit" class="bg-transparent border-2 rounded-lg border-accent p-2 hover:text-accent hover:bg-background-accent" value="Upload" onclick={submit} />
      </div>
      <div class="flex flex-row gap-4 overflow-auto items-center">
        <input type="file" class="bg-transparent border-2 rounded-lg border-accent p-2 hover:text-accent hover:bg-background-accent" value={files().map(f => f.name)} placeholder="File name" multiple onchange={input} />
        <div class='count'>{fileCount()}</div>
      </div>
    </div>
  </div>
}