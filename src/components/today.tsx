"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const format = () => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

// Today's date, filled in in the browser. The server renders nothing, so the build never sees a changing value.
export function Today() {
  const text = useSyncExternalStore(noop, format, () => "");
  return <>{text}</>;
}
