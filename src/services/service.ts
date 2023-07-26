import Pocketbase from 'pocketbase';
import type {File as F} from "../types/file";


const pb = new Pocketbase("http://127.0.0.1:8090");

export async function getFiles(): Promise<F[]> {
  return await pb
      .collection('files')
      .getFullList<F>();
}

export async function getFileUrls(file: F): Promise<string[]> {
  return file.file.map((filename) => {
    return getFileUrl(file, filename);
  })
}

export function getFileUrl(file: F, name: string, crop: boolean = false): string {
  return pb.files.getUrl(file, name, crop ? {thumb: '300x300'} : {});
}

export async function uploadFile(data: FormData): Promise<void> {
  await pb
      .collection('files')
      .create(data);
}

export async function unmarkFile(file: F): Promise<void> {
  await pb
      .collection('files')
      .update(file.id, {new: false});
}