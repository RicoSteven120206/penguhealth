import { Suspense } from "react";
import { AuthForm } from "@/components/forms/AuthForm";

export const metadata = { title: "Daftar – PenguHealth" };

export default function DaftarPage() {
  return (
    <Suspense>
      <AuthForm mode="daftar" />
    </Suspense>
  );
}
