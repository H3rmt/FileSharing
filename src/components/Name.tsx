import { Suspense, createResource } from "solid-js";
import { getName } from "src/services/files";
import ImportantText from "./importantText";

export default function Name() {
  const [name, {}] = createResource(getName);

  return (
    <h1 class="m-0 mb-4 mt-3 text-center text-4xl font-bold">
      <Suspense fallback="Loading...">
        Welcome to <ImportantText>{name()}</ImportantText>
      </Suspense>
    </h1>
  );
}
