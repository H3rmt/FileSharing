import type { JSX } from 'solid-js';

export default function ImportantText(props: { children: JSX.Element }) {
    return <span class="font-bold bg-textbg bg-clip-text text-transparent">
        {props.children}
    </span>
}