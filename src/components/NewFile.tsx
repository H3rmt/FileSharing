import './File.css'
import {createSignal} from "solid-js";
import {uploadFile} from "../services/service";

export function NewFile() {
  const [name, setName] = createSignal("")
  const [files, setFiles] = createSignal<File[]>([])

  const submit = async () => {
    console.log("Submit new file")

    const formData = new FormData();
    formData.append('name', name());
    formData.append('new', 'true');

    for (let file of files() ?? []) {
      formData.append('file', file);
    }
    console.log(formData)

    if ((files() ?? []).length === 0) {
      console.log("No files")
      return
    }
    if (name() === "" || name().length < 3) {
      console.log("No name")
      return
    }

    await uploadFile(formData)
    setTimeout(() => window.location.reload(), 100)
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
  }

  const input = (e: Event) => {
    console.log("Input", e)
    const f = files()
    for (let file of (e.target as HTMLInputElement).files ?? []) {
      f.push(file)
    }
    setFiles(f)
  }

  return <div class="file newFile" ondrop={drop}>
    <h2>&nbsp;+&nbsp; Add</h2>
    <input type="text" value={name()} placeholder="Custom Name" oninput={(e) => setName(e.target.value)}/>
    <input type="file" value={files().map(f => f.name)} placeholder="File name" multiple onchange={input}/>
    <input type="submit" value="Upload" onclick={submit}/>
  </div>
}