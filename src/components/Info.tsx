import { getSize } from 'src/services/files'
import type { File as F, Snippet as S } from '../types/file'
import ImportantText from "./importantText"
import { createResource, Accessor, Setter } from 'solid-js'

export function Info(props: { files: F[], snippets: S[], old: Accessor<boolean>, setOld: Setter<boolean> }) {
  const [size, { }] = createResource(getSize)

  return <div class='rounded-md bg-textbg p-0.5'>
    <div class="flex gap-2 p-2 justify-between rounded-lg bg-background">
      <p class='m-0 leading-5'>
        This is a file/snippet sharing service. You can upload files and snippets to share them with others. <br />
        Currently <ImportantText>{props.files.filter(f => f.new).length}</ImportantText> new files and <ImportantText>{props.files.length}</ImportantText> files are stored on the server using <ImportantText>{Math.round(size() / 1000000)}</ImportantText> MB. <br />
        <ImportantText>{props.snippets.filter(f => f.new).length}</ImportantText> new snippets and <ImportantText>{props.snippets.length}</ImportantText> snippets are stored in total.
      </p>
      <button class='p-2 border-2 border-accent rounded-lg bg-transparent hover:text-accent hover:bg-background-accent' onClick={() => props.setOld(!props.old())}>{props.old() ? "Hide Old" : "Show Old"}</button>
    </div>
  </div>
}