import type {File as F} from '../types/file'

export function Info(props: { files: F[] }) {
  return <p class="instructions">
    This is a local file sharing service. You can upload files and share them with others.
    Currently <span class="text-color">{props.files.filter(f => f.new).length}</span> new files and <span
      class="text-color">{props.files.length}</span> files are
    stored on the server using <span class="text-color">{9405834967}</span> MB.
  </p>
}