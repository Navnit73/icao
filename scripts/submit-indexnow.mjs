/**
 * CLI Script: Submit all ID Photo Maker (id-photo-maker.com) URLs to IndexNow
 * Usage: npm run indexnow
 */

const INDEXNOW_KEY = "0c3dc5e8833b46beb209705aa05e5683";
const INDEXNOW_HOST = "id-photo-maker.com";
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const paths = [
  "",
  "/passport-photo-checker",
  "/uk/passport-photo-checker",
  "/us/visa-photo-checker",
  "/dv-lottery-photo-checker",
  "/passport-photo-template-4x6",
  "/print-passport-photo-a4",
  "/35x45-photo-maker",
  "/white-background-passport-photo",
  "/india/passport-photo-maker",
  "/digital-passport-photo",
  "/passport-size-photo-maker",
  "/us/passport-photo-checker",
  "/us/passport-photo-size",
];

const allUrls = paths.map((p) => `https://${INDEXNOW_HOST}${p}`);

const payload = {
  host: INDEXNOW_HOST,
  key: INDEXNOW_KEY,
  keyLocation: INDEXNOW_KEY_LOCATION,
  urlList: allUrls,
};

async function run() {
  console.log(`🚀 Preparing IndexNow submission for ${INDEXNOW_HOST}...`);
  console.log(`🔑 Key: ${INDEXNOW_KEY}`);
  console.log(`📄 Key Location: ${INDEXNOW_KEY_LOCATION}`);
  console.log(`🌐 Submitting ${allUrls.length} URLs to IndexNow protocol...`);

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Sending POST to ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`✅ SUCCESS: Search engines accepted ${allUrls.length} URLs via ${endpoint}!`);
      } else {
        const text = await response.text();
        console.warn(`⚠️ Warning: Status ${response.status}:`, text);
      }
    } catch (err) {
      console.error(`❌ Error submitting to ${endpoint}:`, err.message);
    }
  }

  console.log(`\n🎉 IndexNow submission process completed!`);
}

run();
