import { createSignal } from "solid-js";
import { uploadSnippet } from "../services/snippets";
import ImportantText from "./importantText";

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

  return <div class='rounded-md bg-textbg p-0.5'>
    <div class="flex flex-col items-center gap-4 p-2 rounded-lg bg-background overflow-auto">
      <div class="flex flex-row gap-4 overflow-auto">
        <span class="text-3xl font-bold hidden sm:block">Add <ImportantText>Snippet</ImportantText></span>
        <input type="text" class="bg-transparent border-2 rounded-lg border-accent p-2 outline-none" value={name()} placeholder="Custom Name" oninput={(e) => setName(e.target.value)} />
        <input type="submit" class="bg-transparent border-2 rounded-lg border-accent p-2 outline-none hover:text-accent hover:bg-background-accent" value="Upload" onclick={submit} />
      </div>
      <div data-replicated-value={snippet()} class="max-h-[40dvh] grid w-full overflow-auto
      after:content-[attr(data-replicated-value)] after:whitespace-pre-wrap after:invisible after:[grid-area:1/1/2/2] after:p-1"
      >
        <textarea value={snippet()} placeholder="Snippet" class="outline-none bg-transparent border-2 rounded-lg border-accent p-2 resize-none overflow-hidden [grid-area:1/1/2/2]" onInput={(e) => {
          setSnippet(e.target.value)
        }} />
      </div>
    </div>
  </div>
}