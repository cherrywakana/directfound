// Background Service Worker

// 厄介なポップアップなどを非表示にするスクリプト
function cleanPage() {
    const selectors = [
        // 一般的なCookie・承諾バナー
        '[id*="cookie" i]', '[class*="cookie" i]', '[id*="consent" i]', '[class*="consent" i]',
        '[id*="banner" i]', '[class*="banner" i]', '[id*="popup" i]', '[class*="popup" i]',
        '[id*="modal" i]', '[class*="modal" i]', '[aria-label*="close" i]',
        '.close-button', '.newsletter-popup',

        // Shopify系、よくあるモダール
        'div[data-testid*="modal"]', 'div[role="dialog"]',

        // オーバーレイ（背景を暗くするやつ）
        '[class*="overlay" i]', '[id*="overlay" i]', '[class*="backdrop" i]',

        // アプリDLバナーみたいなもの
        '[class*="smart-banner" i]',

        // チャットツール系
        '#hubspot-messages-iframe-container', '#fc_widget', '#zopim', 'iframe[id*="chat"]'
    ];

    selectors.forEach(sel => {
        try {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
                el.style.pointerEvents = 'none';
            });
        } catch (e) { }
    });

    // 全画面の50%以上を覆う「z-index過剰な要素」を強制削除するロジック
    try {
        const allElements = document.querySelectorAll('*');
        const threshold = window.innerWidth * window.innerHeight * 0.4;
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const isFixed = style.position === 'fixed' || style.position === 'absolute';
            const zIndex = parseInt(style.zIndex, 10);
            if (isFixed && zIndex > 5) {
                const rect = el.getBoundingClientRect();
                const area = rect.width * rect.height;
                if (area > threshold) {
                    el.style.display = 'none';
                }
            }
        });

        // スクロール禁止(overflow: hidden)などを強制リセット
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // bodyについた固定クラス等があれば削除
        document.body.classList.remove('modal-open', 'no-scroll');
    } catch (e) { }
}

// ページを指定した解像度(1200x800)に近い形でキャプチャするため、ウィンドウサイズを操作する処理（任意）
async function tryResizeWindow(tabId, windowId) {
    try {
        await chrome.windows.update(windowId, {
            width: 1200,
            height: 800 + 40 // ナビゲーションバー分
        });
        // 少し待つ
        return new Promise(resolve => setTimeout(resolve, 800));
    } catch (e) {
        console.log("Could not resize window, continuing.");
        return Promise.resolve();
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'CAPTURE_SHOP') {
        const slug = request.slug;

        (async () => {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tab || !tab.id) {
                    throw new Error('アクティブなタブが見つかりません');
                }

                await tryResizeWindow(tab.id, tab.windowId);

                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: cleanPage,
                });

                await new Promise(resolve => setTimeout(resolve, 1500));

                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: cleanPage,
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                const dataUrlPng = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });

                // Content Scriptに巨大なBase64文字列を送ると「Unexpected end of input」エラーが起きるため、
                // Background Worker 内部（OffscreenCanvas）で直接WebPに変換する
                const response = await fetch(dataUrlPng);
                const blob = await response.blob();
                const imgBitmap = await createImageBitmap(blob);

                const targetW = 1200;
                const targetH = 800;

                const canvas = new OffscreenCanvas(targetW, targetH);
                const ctx = canvas.getContext('2d');

                // 背景を白で塗りつぶす（透過対応）
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, targetW, targetH);

                const currentRatio = imgBitmap.width / imgBitmap.height;
                const targetRatio = targetW / targetH;

                let srcX = 0;
                let srcY = 0;
                let srcW = imgBitmap.width;
                let srcH = imgBitmap.height;

                if (currentRatio > targetRatio) {
                    // 画像が横長すぎる場合：左右を切り落とす
                    srcW = imgBitmap.height * targetRatio;
                    srcX = (imgBitmap.width - srcW) / 2;
                } else {
                    // 画像が縦長すぎる場合：下を切り落とす
                    srcH = imgBitmap.width / targetRatio;
                }

                ctx.drawImage(imgBitmap, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);

                const webpBlob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.5 });

                // BlobをBase64 (Data URI) に変換するための確実な手法
                const reader = new FileReader();
                reader.onloadend = () => {
                    const webpDataUrl = reader.result; // data:image/webp;base64,...

                    chrome.downloads.download({
                        url: webpDataUrl,
                        filename: `directfound-shops/${slug}.webp`,
                        saveAs: false
                    }, (downloadId) => {
                        if (chrome.runtime.lastError) {
                            sendResponse({ success: false, error: chrome.runtime.lastError.message });
                        } else {
                            sendResponse({ success: true, downloadId });
                        }
                    });
                };
                reader.onerror = () => {
                    sendResponse({ success: false, error: 'ファイルの読み込みに失敗しました' });
                };
                reader.readAsDataURL(webpBlob);

            } catch (err) {
                sendResponse({ success: false, error: err.message || err.toString() });
            }
        })();

        return true;
    }
});
