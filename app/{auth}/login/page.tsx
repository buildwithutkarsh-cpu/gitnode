// app/(auth)/login/page.tsx

import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

export const metadata = { title: "Login" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="border-3 border-black bg-black text-[#FFFF00] p-6 mb-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-black tracking-tighter">
              ⬡ GITNODE
            </span>
          </div>
          <p className="text-xs text-[#FFFF00]/70 font-mono">
            v1.0.0 :: OPEN SOURCE FORGE
          </p>
        </div>

        {/* Terminal Panel */}
        <div className="border-3 border-t-0 border-black p-6">
          <TerminalWindow title="auth.sh">
            <p className="text-green-400 text-sm">
              $ gitnode --authenticate
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Initiating OAuth handshake with GitHub...
            </p>
            <p className="text-gray-400 text-sm">
              Awaiting credentials. Stand by.
            </p>
            <p className="text-[#FFFF00] text-sm mt-2">
              ▶ Press the button below to authenticate.
            </p>
          </TerminalWindow>

          <div className="mt-6">
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/dashboard" });
              }}
            >
              <BrutalistButton type="submit" className="w-full">
                <svg
                  viewBox="0 0 24 24"
                  className="inline w-5 h-5 mr-2"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                SIGN IN WITH GITHUB
              </BrutalistButton>
            </form>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center font-mono">
            By signing in, you agree to GitNode's Terms of Use.
          </p>
        </div>

        {/* Footer tag */}
        <div className="border-3 border-t-0 border-black bg-gray-50 px-6 py-3">
          <p className="text-xs font-mono text-gray-400">
            [ OPEN SOURCE ] [ MIT LICENSE ] [ NO TRACKING ]
          </p>
        </div>
      </div>
    </main>
  );
}