import Pocketbase from "pocketbase";

export const pb = new Pocketbase();

export function loggedIn() {
  console.log(pb.authStore.model);
  return pb.authStore.model ? true : false;
}
