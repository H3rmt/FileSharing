import './File.css'
import { getFiles, subscribe } from "../services/service";
import { Info } from "./Info";
import { List } from "./List";
import { NewFile } from "./NewFile";
import { createResource, onMount, createSignal} from "solid-js";

export function Overview() {
  const [files, { refetch }] = createResource(getFiles)
  const [old, setOld] = createSignal(false)

  onMount(async () => {
    await subscribe((ev) => {
      console.log("Event", ev)
      refetch()
    })
  })

  return <div>
    {files.error && <div>Error: {files.error}</div>}
    {files.loading && <div>Loading...</div>}
    {files() && <>
      <Info files={files() ?? []} old={old} setOld={setOld} />
      <List files={files() ?? []} old={old} />
      <NewFile />
    </>}
  </div>
}