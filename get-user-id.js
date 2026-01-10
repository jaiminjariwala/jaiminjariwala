import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file manually
let BEARER_TOKEN = '';

try {
  const envPath = join(__dirname, '.env');
  const envFile = readFileSync(envPath, 'utf8');
  
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('TWITTER_BEARER_TOKEN=')) {
      BEARER_TOKEN = trimmed.replace('TWITTER_BEARER_TOKEN=', '').trim();
    }
  });
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  process.exit(1);
}

const username = 'jaiminjariwala_';

async function getUserId() {
  if (!BEARER_TOKEN) {
    console.error('❌ TWITTER_BEARER_TOKEN not found in .env file');
    console.log('\n💡 Make sure your .env file has:');
    console.log('TWITTER_BEARER_TOKEN=your_token_here');
    process.exit(1);
  }

  console.log(`🔍 Looking up user: @${username}...`);
  console.log(`🔑 Using Bearer Token: ${BEARER_TOKEN.substring(0, 20)}...\n`);

  try {
    const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=id,name,username,verified,created_at,public_metrics`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'User-Agent': 'v2UserLookupJS'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Twitter API Error:', JSON.stringify(error, null, 2));
      
      if (response.status === 401) {
        console.log('\n💡 Your Bearer Token is invalid or expired.');
        console.log('Get a new one from: https://developer.x.com/');
      } else if (response.status === 404) {
        console.log('\n💡 Username not found.');
      }
      
      process.exit(1);
    }

    const data = await response.json();
    const user = data.data;

    console.log('✅ Success!\n');
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
    console.log('\n📋 Add this to your .env file (line 6):\n');
    console.log(`VITE_TWITTER_USER_ID=${user.id}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getUserId();
