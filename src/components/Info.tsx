import { getSize } from 'src/services/service'
import type { File as F } from '../types/file'
import { createResource, Accessor, Setter } from 'solid-js'

export function Info(props: { files: F[], old: Accessor<boolean>, setOld: Setter<boolean> }) {
  const [size, { }] = createResource(getSize)

  return <div class="instructions">
    <p>
      This is a local file sharing service. You can upload files and share them with others.
      Currently <span class="text-color">{props.files.filter(f => f.new).length}</span> new files and <span
        class="text-color">{props.files.length}</span> files are
      stored on the server using <span class="text-color">{Math.round(size() / 1000000)}</span> MB.
    </p>
    <button onClick={() => props.setOld(!props.old())}>{props.old() ? "Hide Old" : "Show Old"}</button>
  </div>
}