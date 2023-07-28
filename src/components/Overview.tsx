import './File.css'
import {getFiles, subscribe} from "../services/service";
import {Info} from "./Info";
import {List} from "./List";
import {NewFile} from "./NewFile";
import {createResource, onMount} from "solid-js";

export function Overview() {
  const [files, {refetch}] = createResource(getFiles)
  onMount(async () => {
    console.log("Mounted")
    await subscribe((ev) => {
      console.log("Event", ev)
      refetch()
    })
  })

  return <div>
    {files.loading ? <p>Loading...</p> : ''}
    {files.error ? <p>Error: {files.error.message}</p> : ''}
    {files() && <>
		 <Info files={files() ?? []}/>
		 <List files={files() ?? []}/>
		 <NewFile/>
	 </>}
  </div>
}