"use client";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="menu">
      {pathname !== "/" && (
        <button className="menu-btn" onClick={() => router.back()}>
          &#11013;
        </button>
      )}
      <button className="menu-btn" onClick={() => router.push("/")}>
        Home
      </button>
    </div>
  );
}
