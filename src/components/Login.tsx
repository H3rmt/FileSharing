import { createSignal } from "solid-js";
import { toast } from "../services/toast";
import { login } from "src/services/login";
import { checkLoginReverse } from "src/services/pocketpase";
import ImportantText from "./importantText";

export default function LoginComponent() {
  const [password, setPassword] = createSignal("");

  checkLoginReverse();

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    console.log("new Login");

    if (password() === "") {
      toast("Password empty");
      return;
    }

    if (await login(password())) {
      toast("Login successful");
      setTimeout(() => (window.location.href = "/"), 500);
    } else {
      toast("Login failed");
    }
  };

  return (
    <form
      class="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 p-2"
      onsubmit={submit}
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
        class="focus-visible:outline-solid col-span-1 w-full rounded-lg border-2 border-border bg-transparent p-2 
            focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-1 focus-visible:outline-offset-4
            focus-visible:outline-text sm:hover:bg-background-accent sm:hover:text-accent"
        value="Login"
      />
    </form>
  );
}
