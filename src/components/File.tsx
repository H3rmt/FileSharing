import { getFileUrl, getFileUrls, unmarkFile } from "../services/files";
import { createResource } from "solid-js";
import type { File } from "../types/file";

export function File(props: { file: File }) {
  const loadURL = async () => await getFileUrls(props.file)
  const [urls] = createResource(loadURL)

  let displayURL: string
  const firstFile = props.file.file[0]
  if (firstFile?.endsWith(".jpg") || firstFile?.endsWith(".JPG") ||firstFile?.endsWith(".png") || firstFile?.endsWith(".gif") || firstFile?.endsWith(".jpeg") || firstFile?.endsWith(".webp")) {
    displayURL = getFileUrl(props.file, firstFile, true)
  } else {
    displayURL = ''
  }

  const close = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Close file", props.file)
    await unmarkFile(props.file)
  }

  const open = async (e: Event) => {
    if ((urls()?.length ?? 0) > 1) {
      e.preventDefault()
      e.stopPropagation()
      console.log('Multiple files')

      for (const url of urls() ?? []) {
        window.open(url + '?download=1', "_blank")
      }
    }

    await unmarkFile(props.file)
  }

  return <a target="_blank" download={props.file.name} href={urls()?.length === 1 ? (urls()?.[0] + "?download=1" ?? '') : ''} onclick={open} class="file existingFile" style={"--background-img: url(" + displayURL + ")"}>
    <div class="close">
      {new Date(props.file.created).toLocaleString()}
      <div class='close-btn' onclick={close}>X</div>
    </div>
    <h2>{props.file.name}</h2>
    <p>{new Date(props.file.created).toLocaleString()}</p>
    {props.file.file.length > 1 ? <p class="count">{props.file.file.length}</p> : ''}
  </a>
}