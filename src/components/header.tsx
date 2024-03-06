"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAppContext } from "@/providers/context-provider";

export default function Header() {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  console.log(state);

  return (
    <div className="menu">
      {state.mode !== "storefront" && (
        <button
          className="menu-btn"
          onClick={() => dispatch({ type: "storefront" })}
        >
          &#11013;
        </button>
      )}
      <button
        className="menu-btn"
        onClick={() => dispatch({ type: "storefront" })}
      >
        Home
      </button>
    </div>
  );
}
