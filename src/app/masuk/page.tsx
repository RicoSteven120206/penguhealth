import { Suspense } from "react";
import { AuthForm } from "@/components/forms/AuthForm";

export const metadata = { title: "Masuk – PenguHealth" };

export default function MasukPage() {
  return (
    <Suspense>
      <AuthForm mode="masuk" />
    </Suspense>
  );
}
