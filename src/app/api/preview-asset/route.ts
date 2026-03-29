import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const brand = searchParams.get('brand');
    const type = searchParams.get('type');
    const apiKey = process.env.SERPAPI_API_KEY;

    // 1. Validar que a API key existe
    if (!apiKey) {
        return NextResponse.json(
            { error: 'SERPAPI_API_KEY não configurada' },
            { status: 500 }
        );
    }

    // 2. Validar parâmetros de entrada
    if (!name) {
        return NextResponse.json(
            { error: 'Parâmetro "name" é obrigatório' },
            { status: 400 }
        );
    }

    // 3. Montar a query com encoding correto usando URLSearchParams
    const searchQuery = [name, brand, type].filter(Boolean).join(' ');

    const params = new URLSearchParams({
        engine: 'google_images',
        safe: 'active',
        hl: 'pt-br',
        gl: 'br',
        api_key: apiKey,
        q: searchQuery,
    });

    const baseUrl = 'https://serpapi.com/search.json';

    try {
        const response = await fetch(`${baseUrl}?${params}`);

        // 4. Verificar se a resposta da API foi bem-sucedida
        if (!response.ok) {
            console.error(`SerpAPI erro: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Erro na SerpAPI: ${response.status}` },
                { status: 502 }
            );
        }

        const data = await response.json();
        const images = data.images_results?.slice(0, 10) ?? [];
        const shuffledImages = images.sort(() => 0.5 - Math.random());

        return NextResponse.json({
            kind: 'image',
            selected: shuffledImages[0] ?? null,
            selectedIndex: 0,
            candidates: shuffledImages,
        });
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        return NextResponse.json(
            { error: 'Falha ao buscar imagens' },
            { status: 500 }
        );
    }
}