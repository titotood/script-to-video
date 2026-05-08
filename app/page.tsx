'use client'

import { useState } from 'react'

export default function Home() {
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!script.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'حدث خطأ')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">🎬 Script to Video</h1>
          <p className="text-gray-400">حوّل نصك إلى فيديو بالذكاء الاصطناعي</p>
        </div>

        {/* Input */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <label className="block text-sm text-gray-400 mb-2">أدخل النص أو السكريبت</label>
          <textarea
            className="w-full bg-gray-800 rounded-xl p-4 text-white resize-none h-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="مثال: اشرح كيف تعمل الألواح الشمسية في 3 نقاط..."
            value={script}
            onChange={e => setScript(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !script.trim()}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? '⏳ جاري التوليد...' : '🚀 توليد الفيديو'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/40 border border-red-500 rounded-xl p-4 mb-6 text-red-300">
            ❌ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-purple-300 mb-4">✅ خطة الفيديو جاهزة</h2>
            <div className="space-y-4">
              {result.scenes?.map((scene: any, i: number) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      مشهد {i + 1}
                    </span>
                    <span className="text-gray-400 text-sm">⏱ {scene.duration} ثانية</span>
                  </div>
                  <p className="text-white font-medium mb-1">{scene.narration}</p>
                  <p className="text-gray-400 text-sm">🖼 {scene.visual}</p>
                  {scene.keyword && (
                    <p className="text-purple-400 text-xs mt-2">🔍 كلمة البحث: {scene.keyword}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">⏱ المدة الإجمالية: <span className="text-white font-bold">{result.totalDuration} ثانية</span></p>
              <p className="text-gray-400 text-sm mt-1">🎬 عدد المشاهد: <span className="text-white font-bold">{result.scenes?.length}</span></p>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
