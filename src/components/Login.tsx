import { createResource, createSignal } from "solid-js";
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
      toast("Password empty");
      setLoggingIn(false);
      return;
    }

    if (await login(password())) {
      toast("Login successful");
      setLoggingIn(false);
      window.location.href = "/";
    } else {
      toast("Login failed");
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
      toast("Login OAuth failed");
      setOAuthing(false);
    }
  };

  return (
    <>
      <div class="rounded-lg bg-textbg p-1 shadow-[0_0_60px_40px_rgba(130_1_120_/_20%)]">
        <div class="flex justify-center overflow-auto rounded-lg bg-background p-2">
          <form
            class="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 p-2"
            onsubmit={passwordLogin}
          >
            <span class="col-span-2 flex w-full items-center justify-center text-3xl font-bold">
              <ImportantText>Login</ImportantText>
            </span>
            <input
              autofocus
              autocomplete="current-password"
              type="password"
              class="focus-visible:outline-solid col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2
              focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-1 focus-visible:outline-offset-4
              focus-visible:outline-text sm:hover:bg-background-accent sm:hover:text-accent"
              value={password()}
              placeholder="Password"
              oninput={(e) => setPassword(e.target.value)}
            />
            <input
              type="submit"
              disabled={loggingIn()}
              class="focus-visible:outline-solid col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2 
            focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-1 focus-visible:outline-offset-4
            focus-visible:outline-text sm:hover:bg-background-accent sm:hover:text-accent"
              value={loggingIn() ? "Logging in..." : "Login"}
            />
          </form>
        </div>
      </div>
      <div class="rounded-lg bg-textbg p-1 shadow-[0_0_60px_40px_rgba(130_1_120_/_20%)]">
        <div class="flex justify-center overflow-auto rounded-lg bg-background p-2">
          <form
            class="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 p-2"
            onsubmit={oathLogin}
          >
            <span class="col-span-2 flex w-full items-center justify-center text-3xl font-bold">
              <ImportantText>OAuth</ImportantText>
            </span>
            <input
              type="submit"
              disabled={oAuthing()}
              class="focus-visible:outline-solid col-span-2 w-full rounded-lg border-2 border-border bg-transparent p-2 
            focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-1 focus-visible:outline-offset-4
            focus-visible:outline-text sm:hover:bg-background-accent sm:hover:text-accent"
              value={oAuthing() ? "Logging in..." : "Login"}
            />
          </form>
        </div>
      </div>
    </>
  );
}
