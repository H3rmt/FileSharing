import { createSignal } from "solid-js";
import { toast } from "../services/toast";
import { login } from "src/services/login";
import { checkLoginReverse } from "src/services/pocketpase";

export function Login() {
  const [password, setPassword] = createSignal("");

  checkLoginReverse();

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()
    console.log("new Login");

    if (password() === "") {
      toast("No Password");
      return;
    }

    if (await login(password())) {
      toast("Login");
      setTimeout(() => window.location.href = "/", 500)
    } else {
      toast("Login failed");
    }
  };

  return (
    <form class="flex flex-row gap-4 overflow-auto" onsubmit={submit}>
      <input
        autofocus
        autocomplete="current-password"
        type="password"
        class="rounded-lg border-2 border-border bg-transparent p-2
            focus:bg-background-accent focus:text-accent sm:hover:bg-background-accent sm:hover:text-accent"
        value={password()}
        placeholder="Password"
        oninput={(e) => setPassword(e.target.value)}
      />
      <input
        type="submit"
        class="rounded-lg border-2 border-border bg-transparent p-2
            focus:bg-background-accent focus:text-accent sm:hover:bg-background-accent sm:hover:text-accent"
        value="Login"
      />
    </form>
  );
}
