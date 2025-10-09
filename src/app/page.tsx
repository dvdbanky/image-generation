"use client";
import { Button } from "@geist-ui/core";
import { useState } from "react";
import Galaxy from "../components/Galaxy";
// Using a lightweight custom SVG chart to avoid any library compatibility issues

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<unknown>(null);
  const [chartData, setChartData] = useState<Array<Record<string, any>>>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [hoveredData, setHoveredData] = useState<Record<string, any> | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [binaryFileUrl, setBinaryFileUrl] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [draggedImage, setDraggedImage] = useState<File | null>(null);
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const [imageDescription, setImageDescription] = useState<string>('');

  const handleLoad = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        "https://dvdbanky.app.n8n.cloud/webhook/d548319e-45bb-452f-83bf-44bafa113cff",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      // Try JSON first; fallback to text
      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        setResponseData(parsed);
        const direct = mapYearPopulation(parsed);
        setChartData(direct.length ? direct : normalizeForChart(parsed));
      } catch {
        setResponseData(text);
        setChartData([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(message);
      setResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChart = () => {
    if (chartData.length > 0) {
      // Hide chart
      setChartData([]);
      setResponseData(null);
      setErrorMessage(null);
    } else {
      // Load chart
      handleLoad();
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsPromptLoading(true);
    setErrorMessage(null);
    setBinaryFileUrl(null);
    
    // Save the current prompt before clearing
    const currentPrompt = prompt.trim();
    
    try {
      const res = await fetch(
        "https://dvdbanky.app.n8n.cloud/webhook/f4c7bc93-23f5-490b-bf71-12f3f629e0f2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: currentPrompt }),
        }
      );
      
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      
      // Handle binary file response
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setBinaryFileUrl(url);
      
      // Save the prompt that was used and clear the input
      setLastPrompt(currentPrompt);
      setPrompt('');
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(message);
    } finally {
      setIsPromptLoading(false);
    }
  };

  const handleImageAnalysis = async (file: File) => {
    setIsImageAnalyzing(true);
    setErrorMessage(null);
    setImageDescription('');
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:image/...;base64, prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;
      
      const res = await fetch(
        "https://dvdbanky.app.n8n.cloud/webhook/2096f9d5-2efd-49a2-9d87-373ffc0ac2d5",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            image: base64Data,
            filename: file.name,
            mimeType: file.type
          }),
        }
      );
      
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      
      const description = await res.text();
      setImageDescription(description);
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(message);
    } finally {
      setIsImageAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setDraggedImage(imageFile);
      handleImageAnalysis(imageFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setDraggedImage(file);
      handleImageAnalysis(file);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Galaxy background */}
      <div className="fixed inset-0 z-0">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.5}
          glowIntensity={0.3}
          saturation={0.0}
          hueShift={140}
          transparent={false}
        />
      </div>
      
      {/* Main content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start p-8 gap-8 pt-16">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg" style={{color: '#f8fafc'}}>УЧЕБНЫЙ ПРОЕКТ</h1>
        
        {/* Графики и Аналитика панель */}
        <div className="w-full max-w-4xl">
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600">
            <h2 className="text-xl font-semibold mb-6 text-white text-center" style={{color: '#ffffff'}}>Графики и Аналитика</h2>
            
            <div className="flex justify-center mb-6">
              <Button type="warning" size="large" onClick={handleToggleChart} disabled={isLoading} auto style={{backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6'}}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Загрузка...
                  </span>
                ) : chartData.length > 0 ? (
                  "Скрыть график"
                ) : (
                  "Загрузить график"
                )}
              </Button>
            </div>

            {chartData.length > 0 && (
              <div className="w-full">
                {/* Chart controls */}
                <div className="flex justify-center gap-4 mb-6">
                  <Button 
                    type="secondary" 
                    auto 
                    onClick={handleLoad}
                    disabled={isLoading}
                  >
                    Обновить
                  </Button>
                  <Button 
                    type={chartType === 'line' ? 'success' : 'secondary'} 
                    auto 
                    onClick={() => setChartType('line')}
                  >
                    Линейный график
                  </Button>
                  <Button 
                    type={chartType === 'bar' ? 'success' : 'secondary'} 
                    auto 
                    onClick={() => setChartType('bar')}
                  >
                    Столбчатая диаграмма
                  </Button>
                </div>
                
                {/* Chart */}
                <ChartView data={chartData} chartType={chartType} onHover={setHoveredData} />
                
                {/* Metric cards */}
                <MetricCards data={chartData} hoveredData={hoveredData} />
              </div>
            )}
          </div>
        </div>

        {/* Image Analysis Panel */}
        <div className="w-full max-w-4xl">
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600">
            <h2 className="text-xl font-semibold mb-6 text-white text-center" style={{color: '#ffffff'}}>Анализ Изображений</h2>
            
            {/* Drag and drop area */}
            <div 
              className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center mb-6 transition-colors hover:border-gray-400"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div>
                  <p className="text-gray-400 mb-2" style={{color: '#9ca3af'}}>Перетащите изображение сюда или</p>
                  <label className="cursor-pointer">
                    <span className="text-gray-400 hover:text-gray-300 underline" style={{color: '#9ca3af'}}>выберите файл</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileSelect}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {isImageAnalyzing && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 animate-spin text-orange-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span className="text-gray-400" style={{color: '#9ca3af'}}>Анализ изображения...</span>
                </div>
              </div>
            )}

            {/* Image preview and description */}
            {draggedImage && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <img 
                    src={URL.createObjectURL(draggedImage)} 
                    alt="Uploaded image" 
                    className="max-w-full max-h-64 rounded-lg shadow-lg border border-gray-600"
                  />
                </div>
                
                {imageDescription && (
                  <div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-gray-500">
                    <h3 className="text-lg font-semibold mb-3 text-white" style={{color: '#ffffff'}}>Описание:</h3>
                    <p className="text-white leading-relaxed" style={{color: '#ffffff'}}>{imageDescription}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Генерация Изображений панель */}
        <div className="w-full max-w-4xl">
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-600">
            <h2 className="text-xl font-semibold mb-6 text-white text-center" style={{color: '#ffffff'}}>Генерация Изображений</h2>
            
            <div className="flex flex-col items-center gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Введите ваш промпт здесь..."
                className="w-full h-32 p-4 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-black/20 backdrop-blur-sm text-white placeholder-gray-400"
                style={{color: '#ffffff'}}
                disabled={isPromptLoading}
              />
              <Button 
                type="warning" 
                size="large" 
                onClick={handlePromptSubmit} 
                disabled={isPromptLoading || !prompt.trim()} 
                auto
                style={{backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6'}}
              >
                {isPromptLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Обработка...
                  </span>
                ) : (
                  "Отправить промпт"
                )}
              </Button>
            </div>

            {/* Binary file display */}
            {binaryFileUrl && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-white text-center" style={{color: '#ffffff'}}>Результат:</h3>
                <div className="flex justify-center">
                  <img 
                    src={binaryFileUrl} 
                    alt="Generated content" 
                    className="max-w-full h-auto rounded-lg shadow-lg border border-gray-600"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={() => {
                      console.error('Failed to load image');
                      setErrorMessage('Не удалось загрузить изображение');
                    }}
                  />
                </div>
                {lastPrompt && (
                  <div className="mt-4 text-center">
                    <p className="text-white text-sm" style={{color: '#ffffff'}}>Промпт: {lastPrompt}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-400 mt-4 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">Ошибка: {errorMessage}</p>
        )}
      </main>
    </div>
  );
}

// Heuristic normalization to chart-friendly format
function normalizeForChart(input: unknown): Array<Record<string, any>> {
  const isNumericLike = (v: unknown) => {
    if (typeof v === "number" && Number.isFinite(v)) return true;
    if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return true;
    return false;
  };
  const toNumber = (v: unknown) => (typeof v === "number" ? v : Number(v));
  try {
    if (Array.isArray(input)) {
      if (input.length === 0) return [];
      // Case: array of arrays. Support headers in first row or positional indices
      if (Array.isArray(input[0])) {
        const rows = input as any[] as any[][];
        const firstRow = rows[0];
        const headerLike = firstRow.every((c) => typeof c === "string");
        if (headerLike && rows.length > 1) {
          const headers = firstRow as string[];
          const xIdx = Math.max(0, headers.findIndex((h) => /month|date|name|label/i.test(h)));
          const yIdxs = headers
            .map((h, i) => [h, i] as const)
            .filter(([h, i]) => i !== xIdx)
            .map(([_, i]) => i);
          return rows.slice(1).map((r, i) => {
            const obj: Record<string, any> = { name: String(r[xIdx] ?? i + 1) };
            yIdxs.forEach((idx) => {
              const key = headers[idx] ?? `value${idx}`;
              const val = r[idx];
              if (isNumericLike(val)) obj[key] = toNumber(val);
            });
            return obj;
          });
        } else {
          // Positional: [x, y1, y2]
          return rows.map((r, i) => {
            const name = r[0] ?? i + 1;
            const obj: Record<string, any> = { name: String(name) };
            if (isNumericLike(r[1])) obj.value = toNumber(r[1]);
            if (isNumericLike(r[2])) obj.value2 = toNumber(r[2]);
            return obj;
          });
        }
      }
      if (input.every((x) => typeof x === "number" || isNumericLike(x))) {
        return (input as any[]).map((v, i) => ({ name: `${i + 1}`, value: toNumber(v) }));
      }
      if (input.every((x) => x && typeof x === "object")) {
        const first = input[0] as Record<string, any>;
        const keys = Object.keys(first);
        // Special-case: Month + Profit shape
        if (keys.includes("Month") && keys.some((k) => /profit/i.test(k))) {
          const profitKey = keys.find((k) => /profit/i.test(k)) as string;
          return (input as Record<string, any>[]).map((row, i) => ({
            name: String(row["Month"] ?? `${i + 1}`),
            Profit: toNumber(row[profitKey]),
          }));
        }
        const xKey =
          keys.find((k) => typeof first[k] === "string") ||
          keys.find((k) => /month|date|name|label/i.test(k)) ||
          "name";
        const yKeys = keys.filter((k) => isNumericLike(first[k]));
        return (input as Record<string, any>[]).map((row, i) => {
          const base: Record<string, any> = { name: row[xKey] ?? `${i + 1}` };
          yKeys.forEach((k) => {
            base[k] = toNumber(row[k]);
          });
          return base;
        });
      }
    }
    if (input && typeof input === "object") {
      const obj: any = input;
      const maybe = obj.data ?? obj.items ?? obj.series ?? obj.points ?? obj.values;
      if (Array.isArray(maybe)) return normalizeForChart(maybe);
      // Also accept keyed series: { Jan: 10, Feb: 20 }
      const entries = Object.entries(obj);
      if (entries.every(([k, v]) => isNumericLike(v))) {
        return entries.map(([k, v]) => ({ name: k, value: toNumber(v) }));
      }
    }
    // CSV string: "Jan,10,20\nFeb,20,30"
    if (typeof input === "string" && /,|;|\n/.test(input)) {
      const lines = input.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length) {
        const rows = lines.map((l) => l.split(/[,;\t]/));
        return normalizeForChart(rows as any);
      }
    }
    // Fallback: extract all numbers from arbitrary string
    if (typeof input === "string") {
      const nums = (input.match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter((n) => Number.isFinite(n));
      if (nums.length) {
        return nums.map((v, i) => ({ name: `${i + 1}`, value: v }));
      }
    }
  } catch {
    // ignore and fall through
  }
  return [];
}

function mapYearPopulation(input: unknown): Array<Record<string, any>> {
  if (!Array.isArray(input)) return [];
  if (input.length === 0) return [];
  const first = input[0] as any;
  if (!first || typeof first !== "object") return [];
  
  const keys = Object.keys(first);
  
  // Helper function to parse numbers from strings with commas
  const parseNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove commas and convert to number
      const cleaned = value.replace(/,/g, '');
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };
  
  // Find year field by name
  const yearKey = keys.find(k => /year|год/i.test(k)) || 'Year';
  
  // Find India and World population fields by exact names
  const indiaKey = keys.find(k => k.includes('Population of India')) || 'Population of India';
  const worldKey = keys.find(k => k.includes('World Population')) || 'World Population';
  
  if (!keys.includes(yearKey) || !keys.includes(indiaKey) || !keys.includes(worldKey)) {
    console.log("Required fields not found:", { yearKey, indiaKey, worldKey, availableKeys: keys });
    return [];
  }
  
  const mappedData = (input as any[]).map((row, i) => {
    const yearValue = parseNumber((row as any)[yearKey]);
    const indiaValue = parseNumber((row as any)[indiaKey]);
    const worldValue = parseNumber((row as any)[worldKey]);
    
    return {
      name: String(yearValue),
      _sortValue: yearValue,
      india: indiaValue,
      world: worldValue
    };
  });

  // Sort by year in ascending order
  const sorted = mappedData.sort((a, b) => a._sortValue - b._sortValue).map(({ _sortValue, ...rest }) => rest);
  return sorted;
}

function ChartView({ data, chartType, onHover }: { 
  data: Array<Record<string, any>>, 
  chartType: 'line' | 'bar',
  onHover: (data: Record<string, any> | null) => void 
}) {
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 600;
  const height = 350;

  // Process population data for visualization
  const allKeys = new Set<string>();
  for (const row of data) Object.keys(row).forEach((k) => allKeys.add(k));
  const numericKeys = Array.from(allKeys).filter((k) => k !== "name");
  
  // Look for simplified keys we created in mapYearPopulation
  const indiaKey = 'india';
  const worldKey = 'world';

  const processedData = data.map((d, i) => {
    const indiaValue = Number((d as any)[indiaKey] ?? 0);
    const worldValue = Number((d as any)[worldKey] ?? 0);
    
    // Keep original values for accurate visualization
    return {
      name: (d as any).name || `Year ${i + 1}`,
      value1: indiaValue,
      value2: worldValue,
      indiaOriginal: indiaValue,
      worldOriginal: worldValue
    };
  });

  const allValues = processedData.flatMap(d => [d.value1, d.value2]);
  const minY = 0; // Start from 0
  const maxValue = Math.max(...allValues);
  // Round up to next billion and add some padding
  const maxY = Math.ceil(maxValue / 1000000000) * 1000000000 + 1000000000;

  const xTo = (i: number) => {
    const x0 = padding.left;
    const x1 = width - padding.right;
    if (processedData.length <= 1) return (x0 + x1) / 2;
    return x0 + (i * (x1 - x0)) / (processedData.length - 1);
  };
  
  const yTo = (v: number) => {
    const y0 = padding.top;
    const y1 = height - padding.bottom;
    const t = (v - minY) / (maxY - minY || 1);
    return y1 - t * (y1 - y0);
  };

  // Create smooth curves using cubic Bezier curves for more natural flow
  const smoothAreaPath = (values: number[]) => {
    if (values.length < 2) return "";
    
    let path = `M${xTo(0)},${yTo(values[0])}`;
    
    for (let i = 1; i < values.length; i++) {
      const x0 = i > 1 ? xTo(i - 2) : xTo(i - 1);
      const y0 = i > 1 ? yTo(values[i - 2]) : yTo(values[i - 1]);
      const x1 = xTo(i - 1);
      const y1 = yTo(values[i - 1]);
      const x2 = xTo(i);
      const y2 = yTo(values[i]);
      const x3 = i < values.length - 1 ? xTo(i + 1) : xTo(i);
      const y3 = i < values.length - 1 ? yTo(values[i + 1]) : yTo(values[i]);
      
      // Calculate control points for smooth curve
      const cp1x = x1 + (x2 - x0) / 6;
      const cp1y = y1 + (y2 - y0) / 6;
      const cp2x = x2 - (x3 - x1) / 6;
      const cp2y = y2 - (y3 - y1) / 6;
      
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }
    
    // Close area to bottom
    path += ` L${xTo(values.length - 1)},${yTo(0)} L${xTo(0)},${yTo(0)} Z`;
    return path;
  };

  const smoothLinePath = (values: number[]) => {
    if (values.length < 2) return "";
    
    let path = `M${xTo(0)},${yTo(values[0])}`;
    
    for (let i = 1; i < values.length; i++) {
      const x0 = i > 1 ? xTo(i - 2) : xTo(i - 1);
      const y0 = i > 1 ? yTo(values[i - 2]) : yTo(values[i - 1]);
      const x1 = xTo(i - 1);
      const y1 = yTo(values[i - 1]);
      const x2 = xTo(i);
      const y2 = yTo(values[i]);
      const x3 = i < values.length - 1 ? xTo(i + 1) : xTo(i);
      const y3 = i < values.length - 1 ? yTo(values[i + 1]) : yTo(values[i]);
      
      // Calculate control points for smooth curve
      const cp1x = x1 + (x2 - x0) / 6;
      const cp1y = y1 + (y2 - y0) / 6;
      const cp2x = x2 - (x3 - x1) / 6;
      const cp2y = y2 - (y3 - y1) / 6;
      
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }
    
    return path;
  };

  return (
    <div className="w-full bg-gray-50 p-1 rounded-lg overflow-hidden">
      <div className="mb-4">
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-full" style={{height: 'auto', maxHeight: '400px'}}>
          <style>
            {`
              .chart-grid { 
                opacity: 0; 
                animation: fadeIn 0.8s ease-out 0.2s forwards; 
              }
              .chart-axis { 
                opacity: 0; 
                animation: fadeIn 0.8s ease-out 0.4s forwards; 
              }
              .chart-area { 
                opacity: 0; 
                animation: drawArea 1.5s ease-out 0.6s forwards; 
              }
              .chart-line { 
                opacity: 0;
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: drawLine 2s ease-out 0.8s forwards; 
              }
              .chart-points { 
                opacity: 0; 
                transform: scale(0);
                animation: popPoints 0.6s ease-out 2.5s forwards; 
              }
                      .chart-bars {
                        opacity: 0; 
                        transform: scaleY(0);
                        transform-origin: bottom;
                        animation: growBars 1.2s ease-out 0.6s forwards; 
                      }
                      
                      .chart-point {
                        transition: all 0.2s ease-out;
                        transform-origin: center;
                      }
                      
                      .chart-point:hover {
                        transform: scale(1.5);
                        filter: brightness(1.2);
                      }
                      
                      .chart-bar {
                        transition: all 0.2s ease-out;
                      }
                      
                      .chart-bar:hover {
                        filter: brightness(1.2);
                        transform: scaleY(1.05);
                        transform-origin: bottom;
                      }
              
              @keyframes fadeIn {
                to { opacity: 1; }
              }
              
              @keyframes drawArea {
                to { opacity: 1; }
              }
              
              @keyframes drawLine {
                to { 
                  opacity: 1;
                  stroke-dashoffset: 0; 
                }
              }
              
              @keyframes popPoints {
                to { 
                  opacity: 1; 
                  transform: scale(1); 
                }
              }
              
              @keyframes growBars {
                to { 
                  opacity: 1; 
                  transform: scaleY(1); 
                }
              }
            `}
          </style>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g stroke="#e5e7eb" strokeWidth={1} className="chart-grid">
            {Array.from({length: Math.floor(maxY / 1000000000) + 1}, (_, i) => {
              const value = i * 1000000000; // Every 1 billion
              return (
                <line 
                  key={i}
                  x1={padding.left} 
                  y1={yTo(value)} 
                  x2={width - padding.right} 
                  y2={yTo(value)} 
                />
              );
            })}
          </g>
          
          {/* X-axis labels */}
          <g fill="#6b7280" fontSize="12" textAnchor="middle" className="chart-axis">
            {processedData.map((d, i) => {
              // Show every 2nd or 3rd year to avoid crowding
              const shouldShow = processedData.length <= 10 || i % Math.ceil(processedData.length / 8) === 0;
              return shouldShow ? (
                <text key={i} x={xTo(i)} y={height - padding.bottom + 20}>
                  {d.name}
                </text>
              ) : null;
            })}
          </g>
          
          {/* Y-axis labels */}
          <g fill="#6b7280" fontSize="12" textAnchor="end" className="chart-axis">
            {Array.from({length: Math.floor(maxY / 1000000000) + 1}, (_, i) => {
              const value = i * 1000000000; // Every 1 billion
              const label = i === 0 ? '0' : `${i}B`;
              
              return (
                <text key={i} x={padding.left - 10} y={yTo(value) + 4}>
                  {label}
                </text>
              );
            })}
          </g>
          
          {/* Chart content */}
          {chartType === 'line' ? (
            <>
              {/* Area chart (bottom layer) */}
              <path 
                d={smoothAreaPath(processedData.map(d => d.value1))} 
                fill="url(#areaGradient)" 
                className="chart-area"
              />
              
              {/* Area border line */}
              <path 
                d={smoothLinePath(processedData.map(d => d.value1))} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth={2}
                className="chart-line"
              />
              
              {/* Line chart (top layer) */}
              <path 
                d={smoothLinePath(processedData.map(d => d.value2))} 
                fill="none" 
                stroke="#93c5fd" 
                strokeWidth={2}
                className="chart-line"
                style={{animationDelay: '1s'}}
              />
              
              {/* Points for line chart with hover */}
              {processedData.map((d, i) => {
                const originalData = data[i]; // Get original data with all fields
                return (
                  <g key={i}>
                    {/* Invisible larger circle for easier hovering */}
                    <circle 
                      cx={xTo(i)} 
                      cy={yTo(d.value2)} 
                      r={8} 
                      fill="transparent"
                      onMouseEnter={() => {
                        console.log('Hover on point:', i, 'originalData:', originalData);
                        onHover(originalData);
                      }}
                      onMouseLeave={() => onHover(null)}
                      style={{cursor: 'pointer'}}
                    />
                    {/* Visible point */}
                    <circle 
                      cx={xTo(i)} 
                      cy={yTo(d.value2)} 
                      r={3} 
                      fill="#93c5fd"
                      stroke="#3b82f6"
                      strokeWidth={1}
                      className="chart-points chart-point"
                      style={{
                        animationDelay: `${2.7 + i * 0.1}s`,
                        transition: 'r 0.2s ease-out, stroke-width 0.2s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as SVGCircleElement).setAttribute('r', '5');
                        (e.target as SVGCircleElement).setAttribute('stroke-width', '2');
                        onHover(originalData);
                      }}
                      onMouseLeave={(e) => {
                        (e.target as SVGCircleElement).setAttribute('r', '3');
                        (e.target as SVGCircleElement).setAttribute('stroke-width', '1');
                        onHover(null);
                      }}
                    />
                    {/* India points */}
                    <circle 
                      cx={xTo(i)} 
                      cy={yTo(d.value1)} 
                      r={8} 
                      fill="transparent"
                      onMouseEnter={() => onHover(originalData)}
                      onMouseLeave={() => onHover(null)}
                      style={{cursor: 'pointer'}}
                    />
                    <circle 
                      cx={xTo(i)} 
                      cy={yTo(d.value1)} 
                      r={3} 
                      fill="#3b82f6"
                      stroke="#1e40af"
                      strokeWidth={1}
                      className="chart-points chart-point"
                      style={{
                        animationDelay: `${2.5 + i * 0.1}s`,
                        transition: 'r 0.2s ease-out, stroke-width 0.2s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as SVGCircleElement).setAttribute('r', '5');
                        (e.target as SVGCircleElement).setAttribute('stroke-width', '2');
                        onHover(originalData);
                      }}
                      onMouseLeave={(e) => {
                        (e.target as SVGCircleElement).setAttribute('r', '3');
                        (e.target as SVGCircleElement).setAttribute('stroke-width', '1');
                        onHover(null);
                      }}
                    />
                  </g>
                );
              })}
            </>
          ) : (
            <>
              {/* Bar chart */}
              {processedData.map((d, i) => {
                const originalData = data[i]; // Get original data with all fields
                const barWidth = (width - padding.left - padding.right) / processedData.length * 0.6;
                const barX = xTo(i) - barWidth / 2;
                const bar1Height = yTo(0) - yTo(d.value1);
                const bar2Height = yTo(0) - yTo(d.value2);
                
                return (
                  <g key={i}>
                    {/* First series bar */}
                    <rect
                      x={barX - barWidth * 0.2}
                      y={yTo(d.value1)}
                      width={barWidth * 0.4}
                      height={bar1Height}
                      fill="#3b82f6"
                      rx={2}
                      className="chart-bars chart-bar"
                      style={{
                        animationDelay: `${0.8 + i * 0.1}s`, 
                        cursor: 'pointer',
                        transition: 'height 0.2s ease-out, y 0.2s ease-out, fill 0.2s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.target as SVGRectElement;
                        const newHeight = bar1Height * 1.05;
                        const newY = yTo(d.value1) - (newHeight - bar1Height);
                        rect.setAttribute('height', newHeight.toString());
                        rect.setAttribute('y', newY.toString());
                        rect.setAttribute('fill', '#2563eb');
                        onHover(originalData);
                      }}
                      onMouseLeave={(e) => {
                        const rect = e.target as SVGRectElement;
                        rect.setAttribute('height', bar1Height.toString());
                        rect.setAttribute('y', yTo(d.value1).toString());
                        rect.setAttribute('fill', '#3b82f6');
                        onHover(null);
                      }}
                    />
                    {/* Second series bar */}
                    <rect
                      x={barX + barWidth * 0.2}
                      y={yTo(d.value2)}
                      width={barWidth * 0.4}
                      height={bar2Height}
                      fill="#93c5fd"
                      rx={2}
                      className="chart-bars chart-bar"
                      style={{
                        animationDelay: `${1.0 + i * 0.1}s`, 
                        cursor: 'pointer',
                        transition: 'height 0.2s ease-out, y 0.2s ease-out, fill 0.2s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.target as SVGRectElement;
                        const newHeight = bar2Height * 1.05;
                        const newY = yTo(d.value2) - (newHeight - bar2Height);
                        rect.setAttribute('height', newHeight.toString());
                        rect.setAttribute('y', newY.toString());
                        rect.setAttribute('fill', '#60a5fa');
                        onHover(originalData);
                      }}
                      onMouseLeave={(e) => {
                        const rect = e.target as SVGRectElement;
                        rect.setAttribute('height', bar2Height.toString());
                        rect.setAttribute('y', yTo(d.value2).toString());
                        rect.setAttribute('fill', '#93c5fd');
                        onHover(null);
                      }}
                    />
                  </g>
                );
              })}
            </>
          )}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-700 text-sm">Население Индии</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className="text-gray-700 text-sm">Население мира</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCards({ data, hoveredData }: { data: Array<Record<string, any>>, hoveredData: Record<string, any> | null }) {
  // Use simplified keys from mapYearPopulation
  const indiaKey = 'india';
  const worldKey = 'world';

  // Use hovered data if available, otherwise use latest data
  const displayData = hoveredData || (data.length > 0 ? data[data.length - 1] : null);
  
  console.log('MetricCards - hoveredData:', hoveredData);
  console.log('MetricCards - displayData:', displayData);
  console.log('MetricCards - available keys:', displayData ? Object.keys(displayData) : 'none');
  
  const currentIndiaPopulation = displayData ? Number(displayData[indiaKey] ?? 0) : 0;
  const currentWorldPopulation = displayData ? Number(displayData[worldKey] ?? 0) : 0;
  const currentYear = displayData ? displayData.name : '';
  
  console.log('MetricCards - india:', currentIndiaPopulation, 'world:', currentWorldPopulation, 'year:', currentYear);
  
  // Calculate India's share of world population
  const indiaWorldShare = currentWorldPopulation > 0 ? 
    (currentIndiaPopulation / currentWorldPopulation * 100) : 0;

  const formatPopulation = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  return (
    <div className="flex justify-center gap-8 mt-8">
      <div className={`bg-white p-6 rounded-lg shadow-md border text-center min-w-[180px] transition-all duration-300 ${hoveredData ? 'ring-2 ring-orange-200' : ''}`}>
        <div className="text-3xl font-bold text-orange-600 mb-2">
          {formatPopulation(currentIndiaPopulation)}
        </div>
        <div className="text-gray-600">Население Индии</div>
        {hoveredData && <div className="text-sm text-orange-500 mt-1">{currentYear} год</div>}
      </div>
      
      <div className={`bg-white p-6 rounded-lg shadow-md border text-center min-w-[180px] transition-all duration-300 ${hoveredData ? 'ring-2 ring-blue-200' : ''}`}>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {formatPopulation(currentWorldPopulation)}
        </div>
        <div className="text-gray-600">Население мира</div>
        {hoveredData && <div className="text-sm text-blue-500 mt-1">{currentYear} год</div>}
      </div>
      
      <div className={`bg-white p-6 rounded-lg shadow-md border text-center min-w-[180px] transition-all duration-300 ${hoveredData ? 'ring-2 ring-green-200' : ''}`}>
        <div className="text-3xl font-bold text-green-600 mb-2">
          {indiaWorldShare.toFixed(1)}%
        </div>
        <div className="text-gray-600">Доля Индии</div>
        {hoveredData && <div className="text-sm text-green-500 mt-1">{currentYear} год</div>}
      </div>
    </div>
  );
}

const SAMPLE_MONTH_PROFIT = [
  { name: "January", Profit: 2145215 },
  { name: "February", Profit: 235325 },
  { name: "March", Profit: 3523 },
  { name: "April", Profit: 1234 },
  { name: "May", Profit: 532532 },
  { name: "June", Profit: 14124521 },
  { name: "July", Profit: 2152315 },
  { name: "August", Profit: 32523 },
  { name: "September", Profit: 23523 },
  { name: "October", Profit: 23523 },
  { name: "November", Profit: 23532 },
  { name: "December", Profit: 2352 },
];
