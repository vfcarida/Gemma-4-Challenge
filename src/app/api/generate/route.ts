import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, type = 'pecs' } = await req.json();

    // Simulate Gemma 4 local processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (type === 'lesson') {
      return NextResponse.json({
        success: true,
        adaptations: [
          {
            title: 'Break Down Instructions',
            description: 'Divide the 30-minute reading block into three 10-minute segments with 2-minute "stretching" transitions.',
          },
          {
            title: 'Visual Schedule',
            description: 'Provide a checklist of the lesson steps (Read, Write, Draw) to reduce transition anxiety.',
          },
          {
            title: 'Quiet Zone',
            description: 'Designate a "Quiet Reading Corner" for students who may become overstimulated during group discussion.',
          },
        ],
      });
    }

    // Default PECS logic
    let cards = [
      {
        id: '1',
        title: 'Noise-canceling headphones',
        icon: 'Headphones',
        color: 'bg-blue-100 border-blue-200 text-blue-700',
      },
      {
        id: '2',
        title: 'Go to the Resource Room',
        icon: 'DoorOpen',
        color: 'bg-green-100 border-green-200 text-green-700',
      },
      {
        id: '3',
        title: 'Play with blocks',
        icon: 'Blocks',
        color: 'bg-purple-100 border-purple-200 text-purple-700',
      },
      {
        id: '4',
        title: 'Draw a picture',
        icon: 'Palette',
        color: 'bg-orange-100 border-orange-200 text-orange-700',
      },
    ];

    // Context-aware adjustments for other demo scenarios
    if (prompt.toLowerCase().includes('hungry') || prompt.toLowerCase().includes('snack')) {
      cards = [
        { id: '1', title: 'Apple', icon: 'Apple', color: 'bg-red-100 border-red-200 text-red-700' },
        { id: '2', title: 'Water Bottle', icon: 'CupSoda', color: 'bg-blue-100 border-blue-200 text-blue-700' },
        { id: '3', title: 'Cracker', icon: 'Cookie', color: 'bg-yellow-100 border-yellow-200 text-yellow-700' },
        { id: '4', title: 'I am finished', icon: 'CheckCircle', color: 'bg-green-100 border-green-200 text-green-700' },
      ];
    } else if (prompt.toLowerCase().includes('math') || prompt.toLowerCase().includes('numbers')) {
      cards = [
        { id: '1', title: 'Use Calculator', icon: 'Calculator', color: 'bg-slate-100 border-slate-200 text-slate-700' },
        { id: '2', title: 'Count with fingers', icon: 'Hand', color: 'bg-orange-100 border-orange-200 text-orange-700' },
        { id: '3', title: 'Draw numbers', icon: 'Pencil', color: 'bg-blue-100 border-blue-200 text-blue-700' },
        { id: '4', title: 'I need help', icon: 'HelpCircle', color: 'bg-purple-100 border-purple-200 text-purple-700' },
      ];
    }

    return NextResponse.json({ success: true, cards });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate content' }, { status: 500 });
  }
}
