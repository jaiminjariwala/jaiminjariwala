// Vercel Serverless Function to fetch tweets and retweets
// This keeps your Bearer Token secure on the server

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
  const USER_ID = process.env.VITE_TWITTER_USER_ID;

  if (!BEARER_TOKEN || !USER_ID) {
    return res.status(500).json({ 
      error: 'Missing API credentials. Please configure environment variables.',
      hint: 'Check your .env file and make sure TWITTER_BEARER_TOKEN and VITE_TWITTER_USER_ID are set'
    });
  }

  try {
    // Fetch user's tweets (including retweets)
    // Using max_results=100 to get more tweets (Twitter API v2 limit)
    const response = await fetch(
      `https://api.twitter.com/2/users/${USER_ID}/tweets?` +
      new URLSearchParams({
        'max_results': '100', // Maximum allowed by Twitter API v2
        'exclude': 'replies', // Exclude replies to keep feed clean
        'tweet.fields': 'created_at,public_metrics,referenced_tweets,entities,attachments',
        'expansions': 'author_id,referenced_tweets.id,referenced_tweets.id.author_id,attachments.media_keys',
        'user.fields': 'name,username,profile_image_url,verified,verified_type',
        'media.fields': 'url,preview_image_url,type,alt_text'
      }),
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'User-Agent': 'v2TweetLookupJS'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Twitter API Error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to fetch tweets',
        details: error,
        hint: response.status === 401 
          ? 'Invalid Bearer Token. Please check your TWITTER_BEARER_TOKEN in .env'
          : response.status === 404
          ? 'User not found. Please check your VITE_TWITTER_USER_ID in .env'
          : 'Twitter API error occurred'
      });
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return res.status(200).json({ 
        tweets: [],
        count: 0,
        message: 'No tweets found for this user'
      });
    }

    // Create a map of users for easy lookup
    const usersMap = {};
    if (data.includes?.users) {
      data.includes.users.forEach(user => {
        usersMap[user.id] = user;
      });
    }

    // Create a map of referenced tweets for retweet info
    const referencedTweetsMap = {};
    if (data.includes?.tweets) {
      data.includes.tweets.forEach(tweet => {
        referencedTweetsMap[tweet.id] = tweet;
      });
    }

    // Transform the data into the format your component expects
    const tweets = data.data.map((tweet) => {
      const isRetweet = tweet.referenced_tweets?.some(ref => ref.type === 'retweeted');
      const isQuoteTweet = tweet.referenced_tweets?.some(ref => ref.type === 'quoted');
      const metrics = tweet.public_metrics || {};
      
      // Find media attachments
      const media = data.includes?.media?.find(m => 
        tweet.attachments?.media_keys?.includes(m.media_key)
      );

      // Get retweet author info if this is a retweet
      let retweetAuthor = null;
      if (isRetweet) {
        const retweetedRef = tweet.referenced_tweets.find(ref => ref.type === 'retweeted');
        if (retweetedRef) {
          const referencedTweet = referencedTweetsMap[retweetedRef.id];
          if (referencedTweet && referencedTweet.author_id) {
            retweetAuthor = usersMap[referencedTweet.author_id];
          }
        }
      }

      // Format the tweet content
      let content = tweet.text;
      
      // For retweets, get the original tweet content if available
      if (isRetweet) {
        const retweetedRef = tweet.referenced_tweets.find(ref => ref.type === 'retweeted');
        if (retweetedRef) {
          const originalTweet = referencedTweetsMap[retweetedRef.id];
          if (originalTweet) {
            content = originalTweet.text;
          }
        }
      }

      return {
        id: tweet.id,
        tweetUrl: `https://twitter.com/${usersMap[tweet.author_id]?.username || 'twitter'}/status/${tweet.id}`,
        profileImage: retweetAuthor?.profile_image_url || usersMap[tweet.author_id]?.profile_image_url || "/api/placeholder-avatar.svg",
        name: retweetAuthor?.name || usersMap[tweet.author_id]?.name || "Jaimin Jariwala",
        username: retweetAuthor?.username ? `@${retweetAuthor.username}` : `@${usersMap[tweet.author_id]?.username || 'jaiminjariwala_'}`,
        verified: retweetAuthor?.verified || usersMap[tweet.author_id]?.verified || false,
        verifiedType: retweetAuthor?.verified_type || usersMap[tweet.author_id]?.verified_type,
        content: content,
        media: media?.url || media?.preview_image_url || null,
        mediaType: media?.type || null,
        mediaAlt: media?.alt_text || null,
        likes: metrics.like_count || 0,
        retweets: metrics.retweet_count || 0,
        replies: metrics.reply_count || 0,
        quotes: metrics.quote_count || 0,
        date: new Date(tweet.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        timestamp: new Date(tweet.created_at).toISOString(),
        isRetweet,
        isQuoteTweet,
        retweetedBy: isRetweet ? usersMap[tweet.author_id]?.name : null
      };
    });

    // Sort by date (newest first)
    tweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Cache for 5 minutes to reduce API calls
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    
    return res.status(200).json({ 
      tweets,
      count: tweets.length,
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching tweets:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      hint: 'Check server logs for more details'
    });
  }
}
