import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json()

    if (!script || script.trim().length === 0) {
      return NextResponse.json({ error: 'النص فارغ' }, { status: 400 })
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `أنت مساعد متخصص في تحويل النصوص إلى خطط فيديو.
قم بتحليل النص وإرجاع JSON فقط بهذا الشكل بدون أي نص إضافي:
{
  "scenes": [
    {
      "narration": "نص التعليق الصوتي للمشهد",
      "visual": "وصف الصورة أو المشهد المرئي بالعربية",
      "keyword": "search keyword in English for stock footage",
      "duration": 5
    }
  ],
  "totalDuration": 30
}
قواعد مهمة:
- قسّم النص لمشاهد من 3 إلى 7 مشاهد
- كل مشهد من 4 إلى 8 ثواني
- keyword يجب أن يكون بالإنجليزية لأنه للبحث في مكتبة الصور`,
          },
          {
            role: 'user',
            content: script,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!openaiRes.ok) {
      const errData = await openaiRes.json()
      return NextResponse.json(
        { error: errData.error?.message || 'خطأ في OpenAI' },
        { status: 500 }
      )
    }

    const openaiData = await openaiRes.json()
    const content = openaiData.choices[0].message.content

    const parsed = JSON.parse(content)

    return NextResponse.json(parsed)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'خطأ غير متوقع' },
      { status: 500 }
    )
  }
}
