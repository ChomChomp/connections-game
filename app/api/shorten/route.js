import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    // Make the request from the server side instead of the client
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`TinyURL API failed with status: ${response.status}`);
    }
    
    const shortUrl = await response.text();
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error('URL shortening failed:', error);
    return NextResponse.json({ error: 'Failed to shorten URL', originalUrl: url }, { status: 500 });
  }
}