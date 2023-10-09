import { createSignal } from "solid-js";
import { uploadFile } from "../services/files";

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
    console.log("Drop", e.dataTransfer?.files)
    const f = files()
    for (let file of e.dataTransfer?.files ?? []) {
      f.push(file)
    }
    setFiles(f)
    setFileCount(f.length)
  }

  const dragover = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById("dropzone")?.classList.add("dragover")
  }
  const dragoverleave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    document.getElementById("dropzone")?.classList.remove("dragover")
  }

  const input = (e: Event) => {
    const f = files()
    for (let file of (e.target as HTMLInputElement).files ?? []) {
      f.push(file)
    }
    if (name() === "")
      setName(f.at(-1)?.name ?? '')
    setFiles(f)
    setFileCount(f.length)
  }

  return <div class="file newFile" id="dropzone" ondragleave={dragoverleave} ondragover={dragover}
    ondrop={drop}>
    <h2 class="add">Add <span class="text-color">File</span></h2>
    <input type="text" value={name()} placeholder="Custom Name" oninput={(e) => setName(e.target.value)} />
    <input type="file" value={files().map(f => f.name)} placeholder="File name" multiple onchange={input} />
    <input type="submit" value="Upload" onclick={submit} />
    <div class='count'>{fileCount()}</div>
  </div>
}