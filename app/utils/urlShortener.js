export async function shortenUrl(longUrl) {
  try {
    console.log('Calling API route to shorten URL');
    
    // Use our API route
    const response = await fetch(`/api/shorten?url=${encodeURIComponent(longUrl)}`);
    
    if (!response.ok) {
      throw new Error(`URL shortening failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.shortUrl) {
      console.log('Successfully shortened URL');
      return data.shortUrl;
    } else {
      throw new Error('No short URL returned from API');
    }
  } catch (error) {
    console.error('Error in shortenUrl utility:', error);
    // Fall back to the original URL
    return longUrl;
  }
}