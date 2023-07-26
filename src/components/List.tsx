import {File} from './File'
import type {File as F} from '../types/file'

export function List(props: { files: F[] }) {
  return <ul role="list" class="files">
    {props.files.filter(f => f.new).map((file) => (
        <File file={file}/>))}
  </ul>
}