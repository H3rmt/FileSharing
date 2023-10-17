import type { JSX } from "solid-js";

export default function ImportantText(props: { children: JSX.Element }) {
  return (
    <span class="bg-textbg bg-clip-text font-bold text-transparent">
      {props.children}
    </span>
  );
}
