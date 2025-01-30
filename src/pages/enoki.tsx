import { useAuthCallback } from "@mysten/enoki/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function EnokiPage() {
  const { handled } = useAuthCallback();
  useEffect(() => {
    if (handled) {
      // Get access token, perform security checks,
      // manage user session, handle errors, and so on.
      window.location.href = "/";
    }
  }, [handled]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      Redirecting...
    </div>
  );
}
