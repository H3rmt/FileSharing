import { Suspense, createResource } from "solid-js";
import { getName } from "src/services/files";
import ImportantText from "./importantText";

export default function Name() {
  const [name, {}] = createResource(getName);

  return (
    <Suspense fallback="Loading...">
      Welcome to <ImportantText>{name()}</ImportantText>
    </Suspense>
  );
}
