// 定義快取名稱
const CACHE_NAME = 'poker-tracker-v2';
// 定義需要離線儲存的檔案清單
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png' // 確保你有這張圖，否則會報錯
];

// 1. 安裝階段：將檔案存入瀏覽器的快取中
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在快取靜態資源');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 激活階段：清除舊版本的快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('清除舊快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. 攔截請求：當沒網路時，從快取拿資料
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果快取有資料就回傳，沒有就去網路抓
      return response || fetch(event.request);
    })
  );
});
