import { createSignal } from "solid-js";
import { toast } from "../services/toast";
import { login } from "src/services/login";
import { checkLoginReverse } from "src/services/pocketpase";

export function Login() {
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
      toast("Login");
      setTimeout(() => (window.location.href = "/"), 500);
    } else {
      toast("Login failed");
    }
  };

  return (
    <form class="flex flex-row gap-4" onsubmit={submit}>
      <input
        autofocus
        autocomplete="current-password"
        type="password"
        class="rounded-lg border-2 border-border bg-transparent p-2
        focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-dotted focus-visible:outline-2
            focus-visible:outline-offset-1 focus-visible:outline-white sm:hover:bg-background-accent sm:hover:text-accent"
        value={password()}
        placeholder="Password"
        oninput={(e) => setPassword(e.target.value)}
      />
      <input
        type="submit"
        class="rounded-lg border-2 border-border bg-transparent p-2
        focus-visible:bg-background-accent focus-visible:text-accent focus-visible:outline-dotted focus-visible:outline-2
            focus-visible:outline-offset-1 focus-visible:outline-white sm:hover:bg-background-accent sm:hover:text-accent"
        value="Login"
      />
    </form>
  );
}
