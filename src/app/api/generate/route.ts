import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Simulate Gemma 4 local processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Hardcoded response for the demo video as per requirements
    const cards = [
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

    return NextResponse.json({ success: true, cards });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate PECS cards' }, { status: 500 });
  }
}
