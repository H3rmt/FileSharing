import { createSignal } from "solid-js";
import { toast } from "../services/toast";
import { login, loginOAuth2 } from "src/services/login";
import ImportantText from "./importantText";

export default function LoginComponent() {
  const [password, setPassword] = createSignal("");
  const [loggingIn, setLoggingIn] = createSignal(false);
  const [oAuthing, setOAuthing] = createSignal(false);

  const passwordLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    console.log("new Login");

    if (password() === "") {
      toast("Password empty", true);
      setLoggingIn(false);
      return;
    }

    if (await login(password())) {
      toast("Login successful");
      setLoggingIn(false);
      window.location.href = "/";
    } else {
      toast("Login failed", true);
      setLoggingIn(false);
    }
  };

  const oathLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    setOAuthing(true);
    console.log("new OAuth Login");

    if (await loginOAuth2()) {
      toast("Login OAuth successful");
      setOAuthing(false);
      window.location.href = "/";
    } else {
      toast("Login OAuth failed", true);
      setOAuthing(false);
    }
  };

  /* TODO check if 60 20 better */
  return (
    <div class="flex justify-around w-auto align-middle my-auto">
      <div
        class="rounded-lg flex p-0.5 shadow-[0_0_70px_30px_rgba(130_1_120/20%)] bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
        <form
          class="grid grid-cols-[auto_1fr] rounded-lg  bg-white dark:bg-slate-950 grid-rows-[1fr_auto] gap-4 p-4"
          onsubmit={passwordLogin}
        >
            <span class="col-span-2 flex w-full items-center justify-center text-3xl font-bold">
              <ImportantText>Login</ImportantText>
            </span>
          <span
            class="col-span-1 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
            <input
              autofocus
              autocomplete="current-password"
              type="password"
              class="cursor-text rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
              value={password()}
              placeholder="Password"
              oninput={(e) => setPassword(e.target.value)}
            />
          </span>
          <span
            class="col-span-1 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
            <input
              type="submit"
              disabled={loggingIn()}
              class="cursor-pointer rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
              value={loggingIn() ? "Logging in..." : "Login"}
            />
          </span>
        </form>
      </div>
      <div
        class="rounded-lg flex p-0.5 shadow-[0_0_70px_30px_rgba(130_1_120/20%)] bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
        <form
          class="grid grid-cols-[auto_1fr] rounded-lg  bg-white dark:bg-slate-950 grid-rows-[1fr_auto] gap-4 p-4"
          onsubmit={oathLogin}
        >
          <span class="col-span-2 flex w-full items-center justify-center text-3xl font-bold">
              <ImportantText>OAuth</ImportantText>
            </span>
          <span
            class="col-span-2 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
          <input
            type="submit"
            disabled={oAuthing()}
            class="cursor-pointer rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
            value={oAuthing() ? "Logging in..." : "Login"}
          />
          </span>
        </form>
      </div>
    </div>
  );
}
