import { checkLogin, checkLoginReverse } from "src/services/pocketpase";

export default async function CheckLogin(params: { reverse?: boolean }) {
  if (params.reverse) await checkLoginReverse();
  else await checkLogin();

  return <></>;
}
