import { getFiles, subscribeFiles } from "../services/files";
import { getSnippets, subscribeSnippets } from "src/services/snippets";
import { Info } from "./Info";
import { FileList } from "./FileList";
import { NewFile } from "./NewFile";
import { createResource, onMount, createSignal, ErrorBoundary } from "solid-js";
import { NewSnippet } from "./NewSnippet";
import { SnippetList } from "./SnippetList";
import { loggedIn } from "src/services/pocketpase";

export function Overview() {
  const [files, { refetch: refetchFiles }] = createResource(getFiles);
  const [snippets, { refetch: refetchSnippets }] = createResource(getSnippets);
  const [old, setOld] = createSignal(false);

  if (!loggedIn()) {
    window.location.href = "/login";
  }

  onMount(async () => {
    await subscribeFiles((ev) => {
      console.log("Event Files", ev);
      refetchFiles();
    });
    await subscribeSnippets((ev) => {
      console.log("Event Snippets", ev);
      refetchSnippets();
    });
  });

  return (
    <div class="flex flex-col gap-8">
      <ErrorBoundary
        fallback={(err, reset) => <div onClick={reset}>{err.toString()}</div>}
      >
        {(files.loading || snippets.error) && <div>Loading...</div>}
        {files() && snippets() && (
          <Info
            snippets={snippets() ?? []}
            files={files() ?? []}
            old={old}
            setOld={setOld}
          />
        )}
        {files() && (
          <div class="flex flex-col gap-3">
            <FileList files={files() ?? []} old={old} />
            <NewFile />
          </div>
        )}
        {snippets() && (
          <div class="flex flex-col gap-3">
            <SnippetList snippets={snippets() ?? []} old={old} />
            <NewSnippet />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}
