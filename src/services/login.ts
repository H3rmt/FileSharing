import { pb } from "./pocketpase";

export async function login(password: string) {
  try {
    await pb.collection("users").authWithPassword("generated-user", password);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function loginOAuth2() {
  try {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'oidc3' });
    console.log(authData);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
