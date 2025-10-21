import { APP_NAME } from "@/constants";
import { isAuthenticate } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuth = await isAuthenticate();
  if (!isUserAuth) redirect("/sign-in");
  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">{APP_NAME}</h2>
        </Link>
        {children}
      </nav>
    </div>
  );
};
export default RootLayout;
