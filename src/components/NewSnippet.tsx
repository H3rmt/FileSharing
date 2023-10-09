import { createSignal } from "solid-js";
import { uploadSnippet } from "../services/snippets";

export function NewSnippet() {
  const [name, setName] = createSignal("")
  const [snippet, setSnippet] = createSignal<string>("")

  const submit = async () => {
    console.log("Submit new snippet")

    if (snippet() === "") {
      alert("No snippet")
      return
    }
    if (name() === "" || name().length < 3) {
      alert("No name / to short")
      return
    }

    const formData = new FormData();
    formData.append('name', name());
    formData.append('new', 'true');
    formData.append('text', snippet());

    setName("")
    setSnippet("")

    await uploadSnippet(formData)
    setTimeout(() => alert("Hochgeladen"), 100);
  }

  return <div class="file newSnippet">
    <h2 class="add">Add <span class="text-color">Snippet</span></h2>
    <input type="text" value={name()} placeholder="Custom Name" oninput={(e) => setName(e.target.value)} />
    <div class="grow-wrap" data-replicated-value={snippet()}>
      <textarea value={snippet()} placeholder="Snippet" oninput={(e) => {
        setSnippet(e.target.value)
      }} />
    </div>
    <input type="submit" value="Upload" onclick={submit} />
  </div>
}