// Test endpoint to debug Twitter API
export default async function handler(req, res) {
  const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
  const USER_ID = process.env.VITE_TWITTER_USER_ID;

  console.log('Testing Twitter API...');
  console.log('Bearer Token exists:', !!BEARER_TOKEN);
  console.log('User ID:', USER_ID);

  if (!BEARER_TOKEN || !USER_ID) {
    return res.status(500).json({ 
      error: 'Missing credentials',
      hasBearerToken: !!BEARER_TOKEN,
      hasUserId: !!USER_ID,
      userId: USER_ID
    });
  }

  try {
    const url = `https://api.twitter.com/2/users/${USER_ID}/tweets?` +
      new URLSearchParams({
        'max_results': '10',
        'tweet.fields': 'created_at,public_metrics',
      });

    console.log('Fetching:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'User-Agent': 'v2TweetLookupJS'
      }
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    return res.status(200).json({
      status: response.status,
      ok: response.ok,
      userId: USER_ID,
      tweetsCount: data.data?.length || 0,
      rawResponse: data
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}
