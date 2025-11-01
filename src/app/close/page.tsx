"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@geist-ui/core";
import Galaxy from "@/components/Galaxy";

export default function ClosePage() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Galaxy background */}
      <div className="fixed inset-0 z-0">
        <Galaxy 
          mouseRepulsion={false}
          mouseInteraction={false}
          density={1.5}
          glowIntensity={0.3}
          saturation={0.0}
          hueShift={140}
          transparent={false}
        />
      </div>
      
      {/* Sign out form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center bg-black/20 backdrop-blur-md p-8 rounded-lg shadow-lg border border-gray-600">
          <h1 className="text-2xl font-bold mb-6 text-white">Закрыть сессию</h1>
          <SignOutButton>
            <Button type="error" size="large">
              Выйти
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

