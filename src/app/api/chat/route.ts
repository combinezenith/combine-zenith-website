// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { message } = await request.json();

    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        if (!message || message.trim() === "") {
            return NextResponse.json(
                { response: "Please enter a message." },
                { headers }
            );
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBoS-XQy7UhJc8tYXQ-TrpOf_FWP_wg6gs';

        const systemPrompt = `You are a professional digital marketing expert AI assistant for Combine Zenith. 

Key Services: Digital Strategy, SEO & SEM, Social Media Marketing, Content Creation, Brand Identity, Web Development.

Response Guidelines:
- Be professional and helpful
- Focus on digital marketing solutions
- Keep responses concise (2-4 sentences)
- Highlight business growth and ROI
- Redirect unrelated questions to marketing topics
- Always be polite and engaging

Tone: Professional, knowledgeable, client-focused.

User Question: ${message}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 300,
                    temperature: 0.7,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from Gemini API');
        }

        const botResponse = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ response: botResponse }, { headers });

    } catch (error) {
        console.error('Chat API error:', error);

        // Fallback responses in case of error
        const fallbackResponses = [
            "I specialize in digital marketing services like SEO, social media marketing, and web development. How can I help your business grow online?",
            "As Combine Zenith's AI assistant, I can help with digital strategy, content creation, and brand development. What specific area are you interested in?",
            "Let me tell you about our digital marketing services. We offer SEO, social media management, and web development to boost your online presence."
        ];

        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        return NextResponse.json(
            { response: randomResponse },
            { headers, status: 200 }
        );
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}