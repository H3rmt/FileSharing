import type {RecordModel as R} from "pocketbase";

export type File = {
  id: string;
  created: string;
  name: string;
  new: boolean;
  file: string[];
} & R

export type Snippet = {
  id: string;
  created: string;
  name: string;
  new: boolean;
  text: string;
} & R