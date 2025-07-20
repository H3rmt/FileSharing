import { createSignal } from "solid-js";
import { isDuplicateSnippet, uploadSnippet } from "../services/snippets";
import ImportantText from "./importantText";
import { toast } from "../services/toast";

export function NewSnippet() {
  const [name, setName] = createSignal("");
  const [snippet, setSnippet] = createSignal<string>("");

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    console.log("Submit new snippet");

    if (snippet() === "") {
      toast("No snippet");
      return;
    }
    if (name() === "" || name().length < 3) {
      toast("No name / to short");
      return;
    }

    try {
      if (await isDuplicateSnippet(name())) {
        if (!confirm("Snippet with same name already exists. Upload anyway?"))
          return;
      }
    } catch (e) {
      console.error(e);
      toast("Error checking for duplicate snippet");
      return;
    }

    const formData = new FormData();
    formData.append("name", name());
    formData.append("new", "true");
    formData.append("text", snippet());

    setName("");
    setSnippet("");

    toast("Uploading");
    try {
      await uploadSnippet(formData);
    } catch (e) {
      console.error(e);
      toast("Error uploading snippet");
      return;
    }
    toast("Upload finished");
  };

  const drop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document
      .getElementById("s-dropzone")
      ?.classList.remove("shadow-[inset_0_0_70px_30px_rgba(130,1,120,0.4)]");
    hovering = 0;

    console.log("Drop", e.dataTransfer?.files[0]);

    if (e.dataTransfer?.files === null) return;
    if (e.dataTransfer?.files.length !== 1) {
      toast("Only one file allowed");
      return;
    }
    const file = e.dataTransfer?.files[0] as File;

    setName(file.name);
    console.log("name", file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSnippet(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  let hovering = 0; // 0 = false, 1 = true, 2 = false but delayed

  const dragover = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document
      .getElementById("s-dropzone")
      ?.classList.add("shadow-[inset_0_0_70px_30px_rgba(130,1,120,0.4)]");
    hovering = 1;
  };
  const dragoverleave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    hovering = 2;
    setTimeout(() => {
      if (hovering === 2) {
        document
          .getElementById("s-dropzone")
          ?.classList.remove(
          "shadow-[inset_0_0_70px_30px_rgba(130,1,120,0.4)]"
        );
        hovering = 0;
      }
    }, 120);
  };

  return (
    <div
      class="rounded-lg mx-auto flex p-0.5 shadow-[0_0_15px_15px_rgba(130_1_120/20%)] bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
      <div class="flex flex-1 justify-center gap-2 rounded-lg bg-white dark:bg-slate-950 p-2">
        <div
          class="flex justify-center overflow-auto rounded-lg bg-background p-1"
          id="s-dropzone"
        >
          <form
            class="grid w-fit grid-cols-[1fr_auto] grid-rows-[1fr_1fr_auto] gap-4 p-2 sm:grid-cols-[auto_1fr_auto] sm:grid-rows-[1fr_auto]"
            ondragleave={dragoverleave}
            ondragover={dragover}
            ondrop={drop}
            onsubmit={submit}
          >
            <span class="col-span-2 flex w-full items-center justify-center text-3xl font-bold sm:col-span-1">
              Add&nbsp;<ImportantText>Snippet</ImportantText>
            </span>
            <span
              class="col-span-1 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
            <input
              type="text"
              class="cursor-text rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
              value={name()}
              placeholder="Custom Name"
              oninput={(e) => setName(e.target.value)}
            />
            </span>
            <span
              class="col-span-1 flex w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
            <input
              type="submit"
              class="cursor-pointer rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
              value="Upload"
            />
            </span>
            <div
              class="col-span-2 flex max-h-[40dvh] sm:col-span-3 w-full p-0.5 rounded-lg  bg-transparent bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900">
              <div
                data-replicated-value={snippet() + "\n"}
                class="grid flex-1 whitespace-pre after:invisible after:whitespace-pre-wrap after:p-2 after:text-lg after:content-[attr(data-replicated-value)] after:[grid-area:1/1/2/2] "
              >
                <textarea
                  value={snippet()}
                  placeholder="Snippet"
                  class="resize-none text-lg [grid-area:1/1/2/2]
                  cursor-text rounded-lg p-2 border-transparent flex-1
                focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-4
                focus-visible:outline-bg-slate-950 dark:focus-visible:outline-white
                bg-white dark:bg-slate-950 hover:bg-gray-200 dark:hover:bg-slate-900"
                  onInput={(e) => {
                    setSnippet(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
