/**
 * Simple Twitter User ID Lookup
 * Just replace YOUR_BEARER_TOKEN with your actual token and run: node get-id-simple.js
 */

// 👇 PASTE YOUR BEARER TOKEN HERE (from your .env file)
const BEARER_TOKEN = 'PASTE_YOUR_BEARER_TOKEN_HERE';

const username = 'jaiminjariwala_';

async function getUserId() {
  if (BEARER_TOKEN === 'PASTE_YOUR_BEARER_TOKEN_HERE') {
    console.log('❌ Please edit this file and paste your Bearer Token on line 7');
    console.log('\nOpen your .env file, copy the value after TWITTER_BEARER_TOKEN=');
    console.log('Then paste it in this file where it says PASTE_YOUR_BEARER_TOKEN_HERE');
    return;
  }

  try {
    console.log(`🔍 Looking up user: @${username}...\n`);

    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=id,name,username,verified,created_at,public_metrics`,
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'User-Agent': 'v2UserLookupJS'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error:', JSON.stringify(error, null, 2));
      
      if (response.status === 401) {
        console.log('\n💡 Your Bearer Token is invalid or expired.');
        console.log('Get a new one from: https://developer.x.com/');
      } else if (response.status === 404) {
        console.log('\n💡 Username not found. Check if it\'s spelled correctly.');
      }
      
      return;
    }

    const data = await response.json();
    const user = data.data;

    console.log('✅ Success! Here\'s your information:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📛 Name:       ${user.name}`);
    console.log(`🐦 Username:   @${user.username}`);
    console.log(`🆔 User ID:    ${user.id}`);
    console.log(`✓  Verified:   ${user.verified ? 'Yes' : 'No'}`);
    console.log(`📅 Created:    ${new Date(user.created_at).toLocaleDateString()}`);
    
    if (user.public_metrics) {
      console.log('\n📊 Stats:');
      console.log(`   Followers:  ${user.public_metrics.followers_count.toLocaleString()}`);
      console.log(`   Following:  ${user.public_metrics.following_count.toLocaleString()}`);
      console.log(`   Tweets:     ${user.public_metrics.tweet_count.toLocaleString()}`);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Add this line to your .env file:\n');
    console.log(`VITE_TWITTER_USER_ID=${user.id}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getUserId();
