import { getFileUrl, getFileUrls, unmarkFile } from "../services/files";
import { createResource } from "solid-js";
import type { File } from "../types/file";

export function File(props: { file: File }) {
  const loadURL = async () => await getFileUrls(props.file)
  const [urls] = createResource(loadURL)

  let displayURL: string
  const firstFile = props.file.file[0]
  const type = firstFile?.split('.').pop()?.toLowerCase()
  if (firstFile && (type === "jpg" || type === "png" || type === "gif" || type === "jpeg" || type === "webp")) {
    displayURL = "url(" + getFileUrl(props.file, firstFile, true) + ")"
  } else {
    displayURL = 'var(--important)'
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

  return <a target="_blank" download={props.file.name} href={urls()?.length === 1 ? (urls()?.[0] + "?download=1" ?? '') : ''} onclick={open}
    class="flex flex-col relative p-3 bg-cover rounded-md mix-blend-difference min-h-[100px] text-ellipsis
      whitespace-nowrap overflow-hidden cursor-pointer sm:hover:text-accent 
      before:content-[''] before:absolute before:left-0 before:top-0 before:-z-10 before:w-full before:h-full before:blur-[2px]
      before:bg-img-background before:bg-cover before:bg-center"
    style={`--img-background: ${displayURL}`}>
    <div class="absolute z-50 right-1 top-1 flex items-start gap-3 rounded-lg font-bold [text-shadow:_0_0_0.4em_black]">
      {new Date(props.file.created).toLocaleString()}
      <div class='p-1 cursor-pointer rounded-lg border-dashed border-2 border-accent sm:hover:bg-background-accent' onclick={close}>X</div>
    </div>
    <h2 class="mb-1 text-3xl [text-shadow:_0_0_0.4em_black]">{props.file.name}</h2>
    {props.file.file.length > 1 ? <div class="absolute z-50 right-1 p-1 bottom-1 font-bold border-dashed rounded-lg border-2 border-accent">{props.file.file.length}</div> : ''}
  </a>
}