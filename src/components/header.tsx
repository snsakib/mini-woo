"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="menu">
      {pathname !== "/" && (
        <button className="back-btn" onClick={() => router.back()}>
          &#11013;
        </button>
      )}
      <Link href="/" className="back-btn">
        Home
      </Link>
    </div>
  );
}
