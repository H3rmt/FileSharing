import { getSize } from 'src/services/files'
import type { File as F, Snippet as S } from '../types/file'
import { createResource, Accessor, Setter } from 'solid-js'

export function Info(props: { files: F[], snippets: S[], old: Accessor<boolean>, setOld: Setter<boolean> }) {
  const [size, { }] = createResource(getSize)

  return <div class="instructions">
    <p>
      This is a file/snippet sharing service. You can upload files and snippets to share them with others. <br />
      Currently <span class="text-color">{props.files.filter(f => f.new).length}</span> new files and <span
        class="text-color">{props.files.length}</span> files are
      stored on the server using <span class="text-color">{Math.round(size() / 1000000)}</span> MB. <br />
      <span class="text-color">{props.snippets.filter(f => f.new).length}</span> new snippets and <span
        class="text-color">{props.files.length}</span> snippets are stored in total.
    </p>
    <button onClick={() => props.setOld(!props.old())}>{props.old() ? "Hide Old" : "Show Old"}</button>
  </div>
}