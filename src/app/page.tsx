"use client";
import { Button } from "@geist-ui/core";
import { useEffect } from "react";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Galaxy from "../components/Galaxy";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect to dashboard if signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while checking auth status
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black">
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
      
      {/* Auth buttons in top right */}
      <div className="fixed top-4 right-4 z-20">
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <Button type="secondary" size="small" auto style={{backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6'}}>
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button type="secondary" size="small" auto style={{backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6'}}>
              Sign Up
            </Button>
          </SignUpButton>
        </div>
          </div>
          
      {/* Main content */}
      <main className="relative z-10 h-screen flex flex-col items-center justify-center p-8 gap-8">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6" style={{color: '#f8fafc'}}>
            УЧЕБНЫЙ ПРОЕКТ
          </h1>
          <p className="text-xl mb-8" style={{color: '#e2e8f0'}}>
            Платформа для работы с данными, аналитикой и AI
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {/* Feature 1 */}
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#f8fafc'}}>
              Графики и Аналитика
            </h3>
            <p className="text-sm" style={{color: '#cbd5e1'}}>
              Визуализация данных с интерактивными графиками. Поддержка линейных и столбчатых диаграмм с динамическим обновлением метрик.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#f8fafc'}}>
              Анализ Изображений
            </h3>
            <p className="text-sm" style={{color: '#cbd5e1'}}>
              Загружайте изображения и получайте детальное AI-описание. Поддержка drag-and-drop для удобной работы.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-3" style={{color: '#f8fafc'}}>
              Генерация Изображений
            </h3>
            <p className="text-sm" style={{color: '#cbd5e1'}}>
              Создавайте уникальные изображения с помощью AI. Просто введите текстовый промпт и получите результат.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
