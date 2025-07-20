import type { JSX } from "solid-js";

export default function ImportantText(props: { children: JSX.Element }) {
  return (
    <span class="bg-gradient-to-tr from-fuchsia-800 via-pink-600 to-rose-900 bg-clip-text font-bold text-transparent">
      {props.children}
    </span>
  );
}
