declare namespace JSX {
  interface IntrinsicElements {
    // fix random vscode error
    [elemName: string]: any;
  }
}
