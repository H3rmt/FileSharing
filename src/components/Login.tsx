import { createSignal } from "solid-js";
import { toast } from "../services/toast";
import { login } from "src/services/login";
import { loggedIn } from "src/services/pocketpase";

export function Login() {
  const [password, setPassword] = createSignal("");

  if (loggedIn()) {
    window.location.href = "/";
  }

  const submit = async () => {
    console.log("new Login");

    if (password() === "") {
      toast("No Password");
      return;
    }

    if (await login(password())) {
      toast("Login");
      window.location.href = "/";
    } else {
      toast("Login failed");
    }
  };

  return (
    <div class="flex flex-row gap-4 overflow-auto">
      <input
        type="text"
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
        value="Upload"
        onclick={submit}
      />
    </div>
  );
}
