"use client"

import { SignIn } from "@clerk/nextjs"
import Galaxy from "@/components/Galaxy"

export default function SignInPage() {
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
      
      {/* Sign in form */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <SignIn />
      </div>
    </div>
  )
}

