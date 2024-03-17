import { checkLogin, checkLoginReverse } from "src/services/pocketpase";

export default function CheckLogin(params: { reverse?: boolean }) {
    if (params.reverse)
        checkLoginReverse();
    else
        checkLogin();

    return <></>;
}