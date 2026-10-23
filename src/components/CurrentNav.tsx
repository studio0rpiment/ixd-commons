"use client";

import { usePathname } from "next/navigation";
import { NavList } from "./NavList";

export function CurrentNav() {
  return <NavList path={usePathname()} />;
}
