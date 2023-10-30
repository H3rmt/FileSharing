import Pocketbase from "pocketbase";

export const pb = new Pocketbase();

export async function checkLogin() {
  if (!pb.authStore.model) {
    window.location.href = "/login";
  }
  try {
    await pb.collection("users").authRefresh();
  } catch (e) {
    console.warn(e);
    window.location.href = "/login";
  }
}

export async function checkLoginReverse() {
  try {
    await pb.collection("users").authRefresh();
    window.location.href = "/";
  } catch (e) {
    console.warn(e);
  }
}
