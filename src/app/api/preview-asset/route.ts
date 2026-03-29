import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const brand = searchParams.get('brand');
    const type = searchParams.get('type');
    const apiKey = process.env.SERPAPI_API_KEY;

    const baseUrl = 'https://serpapi.com/search.json';
    const params = new URLSearchParams({
        engine: 'google_images',
        safe: 'active',
        hl: 'pt-br',
        gl: 'br',
    });

    const query = async (fallback = false) => {
        try {
            const response = await fetch(`${baseUrl}?${params}&api_key=${apiKey}&q=${name} ${brand} ${type}`);
            const data = await response.json();
            const images = data.images_results.slice(0, 10);
            return images;
        } catch (error) {
            if (!fallback) {
                return query(true);
            }
            return [];
        }
    };

    const images = await query();
    const shuffledImages = images.sort(() => 0.5 - Math.random());

    return NextResponse.json({
        kind: 'image',
        selected: shuffledImages[0],
        selectedIndex: 0,
        candidates: shuffledImages
    });
}