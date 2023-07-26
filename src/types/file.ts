import type {Record} from "pocketbase";

export type File = {
  id: string;
  created: string;
  name: string;
  new: boolean;
  file: string[];
} & Record