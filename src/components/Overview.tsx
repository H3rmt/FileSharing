import './styles.css'
import { getFiles, subscribeFiles } from "../services/files";
import { getSnippets, subscribeSnippets } from 'src/services/snippets';
import { Info } from "./Info";
import { FileList } from "./FileList";
import { NewFile } from "./NewFile";
import { createResource, onMount, createSignal } from "solid-js";
import { NewSnippet } from './NewSnippet';
import { SnippetList } from './SnippetList';

export function Overview() {
  const [files, { refetch: refetchFiles }] = createResource(getFiles)
  const [snippets, { refetch: refetchSnippets }] = createResource(getSnippets)
  const [old, setOld] = createSignal(false)

  onMount(async () => {
    await subscribeFiles((ev) => {
      console.log("Event", ev)
      refetchFiles()
    })
    await subscribeSnippets((ev) => {
      console.log("Event", ev)
      refetchSnippets()
    })
  })

  return <div class='content'>
    {(files.error || snippets.error) && <div>Error: {files.error} | {snippets.error}</div>}
    {(files.loading || snippets.error) && <div>Loading...</div>}
    {files() && snippets() && <Info snippets={snippets() ?? []} files={files() ?? []} old={old} setOld={setOld} />}
    {files() && <div class='sub-content'>
      <FileList files={files() ?? []} old={old} />
      <NewFile />
    </div>}
    {snippets() && <div class='sub-content'>
      <SnippetList snippets={snippets() ?? []} old={old} />
      <NewSnippet />
    </div>}
  </div>
}