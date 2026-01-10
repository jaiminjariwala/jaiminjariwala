import './TwitterFeed.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useEffect, useRef, useState } from 'react';

const TwitterFeed = () => {
    const textRef = useScrollReveal();
    const scrollRef = useRef(null);
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tweets from API
    useEffect(() => {
        const fetchTweets = async () => {
            try {
                setLoading(true);
                
                // FOR LOCAL DEV ONLY - fetch directly from Twitter
                const BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAOfnfAEAAAAA8hOp9UGdq3MgEe2HIJXrsYaYH8M%3Du9q2JhQlfJURtKFGD4RTBXcGrLOAKGTJ9TVlGNkhQgmmR2rJTj';
                const USER_ID = import.meta.env.VITE_TWITTER_USER_ID || '1485563549372268544';
                
                const url = `https://api.twitter.com/2/users/${USER_ID}/tweets?` +
                    new URLSearchParams({
                        'max_results': '20',
                        'exclude': 'replies',
                        'tweet.fields': 'created_at,public_metrics,referenced_tweets',
                        'expansions': 'author_id,referenced_tweets.id.author_id,attachments.media_keys',
                        'user.fields': 'name,username,profile_image_url,verified',
                        'media.fields': 'url,preview_image_url,type,alt_text'
                    });
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${BEARER_TOKEN}`,
                        'User-Agent': 'v2TweetLookupJS'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tweets: ' + response.status);
                }
                
                const data = await response.json();
                console.log('Twitter API Response:', data);
                
                if (!data.data || data.data.length === 0) {
                    setTweets(getSampleTweets());
                    setError('No tweets found');
                    setLoading(false);
                    return;
                }

                // Create user map
                const usersMap = {};
                if (data.includes?.users) {
                    data.includes.users.forEach(user => {
                        usersMap[user.id] = user;
                    });
                }

                // Transform tweets
                const transformedTweets = data.data.map((tweet) => {
                    const author = usersMap[tweet.author_id] || {};
                    const metrics = tweet.public_metrics || {};
                    const isRetweet = tweet.referenced_tweets?.some(ref => ref.type === 'retweeted');
                    
                    return {
                        id: tweet.id,
                        tweetUrl: `https://twitter.com/${author.username || 'twitter'}/status/${tweet.id}`,
                        profileImage: author.profile_image_url || "/travel/virginia/IMG_0122.jpeg",
                        name: author.name || "Jaimin 🦅",
                        username: `@${author.username || 'jaiminjariwala_'}`,
                        verified: author.verified || false,
                        content: tweet.text,
                        media: null,
                        mediaType: null,
                        likes: metrics.like_count || 0,
                        retweets: metrics.retweet_count || 0,
                        replies: metrics.reply_count || 0,
                        date: new Date(tweet.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }),
                        timestamp: new Date(tweet.created_at).toISOString(),
                        isRetweet,
                        retweetedBy: isRetweet ? "Jaimin 🦅" : null
                    };
                });

                console.log('Transformed tweets:', transformedTweets);
                setTweets(transformedTweets);
                setError(null);
            } catch (err) {
                console.error('Error fetching tweets:', err);
                setError(err.message);
                setTweets(getSampleTweets());
            } finally {
                setLoading(false);
            }
        };

        fetchTweets();
    }, []);

    // Drag scroll functionality
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        const handleMouseDown = (e) => {
            isDown = true;
            scrollContainer.style.cursor = 'grabbing';
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        };

        const handleMouseUp = () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        };

        scrollContainer.addEventListener('mousedown', handleMouseDown);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);
        scrollContainer.addEventListener('mouseup', handleMouseUp);
        scrollContainer.addEventListener('mousemove', handleMouseMove);

        return () => {
            scrollContainer.removeEventListener('mousedown', handleMouseDown);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
            scrollContainer.removeEventListener('mouseup', handleMouseUp);
            scrollContainer.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    if (loading) {
        return (
            <div className="twitter-feed" id="twitter-feed">
                <div className="twitter-container">
                    <div className="loading-message">
                        <div className="loading-spinner"></div>
                        <p>Loading tweets...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (tweets.length === 0) {
        return (
            <div className="twitter-feed" id="twitter-feed">
                <div className="twitter-container">
                    <div className="error-message">
                        <h3>⚠️ No tweets found</h3>
                        {error && <p>{error}</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="twitter-feed" id="twitter-feed">
            <div ref={textRef} className="twitter-container">
                <div className="twitter-header">
                    <h2>Latest from Twitter</h2>
                    <p className="tweet-count">{tweets.length} tweets loaded</p>
                </div>
                <div className="twitter-scroll" ref={scrollRef}>
                    {tweets.map((tweet) => (
                        <a 
                            key={tweet.id} 
                            className="tweet-card reveal-text-container"
                            href={tweet.tweetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {tweet.isRetweet && tweet.retweetedBy && (
                                <div className="retweet-indicator">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
                                    </svg>
                                    <span>{tweet.retweetedBy} Retweeted</span>
                                </div>
                            )}

                            <div className="tweet-header">
                                <img 
                                    src={tweet.profileImage} 
                                    alt={tweet.name}
                                    className="profile-image"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
                                    }}
                                />
                                <div className="user-info">
                                    <div className="name-row">
                                        <span className="user-name" style={{ fontFamily: 'Helvetica, sans-serif' }}>
                                            {tweet.name}
                                        </span>
                                        {tweet.verified && (
                                            <svg className="verified-badge" viewBox="0 0 24 24" width="18" height="18">
                                                <path fill="#1d9bf0" d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="username-date">
                                        <span className="username" style={{ fontFamily: 'Helvetica, sans-serif' }}>
                                            {tweet.username}
                                        </span>
                                        <span className="date" style={{ fontFamily: 'Helvetica, sans-serif' }}>
                                            · {tweet.date}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="tweet-content" style={{ fontFamily: 'Helvetica, sans-serif' }}>
                                {tweet.content}
                            </div>

                            {tweet.media && (
                                <div className="tweet-media">
                                    <img src={tweet.media} alt={tweet.mediaAlt || "Tweet image"} />
                                </div>
                            )}

                            <div className="tweet-footer">
                                <div className="engagement">
                                    <span className="stat" style={{ fontFamily: 'Helvetica, sans-serif' }}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
                                        </svg>
                                        {tweet.replies}
                                    </span>
                                    <span className="stat" style={{ fontFamily: 'Helvetica, sans-serif' }}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
                                        </svg>
                                        {tweet.retweets}
                                    </span>
                                    <span className="stat" style={{ fontFamily: 'Helvetica, sans-serif' }}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                                        </svg>
                                        {tweet.likes}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

function getSampleTweets() {
    return [{
        id: '1',
        tweetUrl: 'https://twitter.com/jaiminjariwala_',
        profileImage: "/travel/virginia/IMG_0122.jpeg",
        name: "Jaimin 🦅",
        username: "@jaiminjariwala_",
        verified: false,
        content: "Loading your tweets... If you see this, check the browser console for errors.",
        media: null,
        likes: 0,
        retweets: 0,
        replies: 0,
        date: "Jan 10, 2025",
        isRetweet: false
    }];
}

export default TwitterFeed;
