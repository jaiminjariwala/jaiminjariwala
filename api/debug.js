// Debug endpoint to see raw tweet data
export default async function handler(req, res) {
  const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
  const USER_ID = process.env.VITE_TWITTER_USER_ID;

  if (!BEARER_TOKEN || !USER_ID) {
    return res.status(500).json({ 
      error: 'Missing credentials',
      hasBearerToken: !!BEARER_TOKEN,
      hasUserId: !!USER_ID 
    });
  }

  try {
    const url = `https://api.twitter.com/2/users/${USER_ID}/tweets?max_results=5&tweet.fields=created_at,public_metrics`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'User-Agent': 'v2TweetLookupJS'
      }
    });

    const data = await response.json();

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      tweetCount: data.data?.length || 0,
      firstTweet: data.data?.[0] || null,
      fullResponse: data
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message 
    });
  }
}
