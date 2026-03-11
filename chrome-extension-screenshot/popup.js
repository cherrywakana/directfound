// ポップアップからBackgroundにメッセージを送信し、
// 完了後に結果をUIに表示する

function getDomainSlug(url) {
    try {
        const hostname = new URL(url).hostname;
        // Remove 'www.' if present
        let slug = hostname.replace(/^www\./, '');
        // Keep only the first part before the dot (e.g. "ssense.com" -> "ssense", "yahoo.co.jp" -> "yahoo")
        slug = slug.split('.')[0];
        return slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    } catch (e) {
        return '';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const btn = document.getElementById('captureBtn');
    const slugInput = document.getElementById('slug');
    const statusDiv = document.getElementById('status');

    // アクティブタブのURLから自動でドメイン名を取得して入力
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url) {
            const autoSlug = getDomainSlug(tab.url);
            if (autoSlug) {
                slugInput.value = autoSlug;
            }
        }
    } catch (err) {
        console.error(err);
    }

    // Inputにフォーカスを当てる
    slugInput.focus();

    // Enterキーでも実行できるように設定
    slugInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btn.click();
        }
    });

    btn.addEventListener('click', async () => {
        const slug = slugInput.value.trim();

        if (!slug) {
            statusDiv.textContent = '❌ Slug を入力してください';
            statusDiv.className = '';
            return;
        }

        if (!/^[a-z0-9-]+$/.test(slug)) {
            statusDiv.textContent = '❌ Slugは小文字英数字とハイフンのみです';
            statusDiv.className = '';
            return;
        }

        // UIをローディング状態に
        btn.disabled = true;
        btn.textContent = 'Capturing...';
        statusDiv.textContent = '⏳ クリーンアップ＆撮影中…';
        statusDiv.style.color = '#e65100'; // Orange

        try {
            // Backgroundスクリプトにキャプチャ処理を依頼
            chrome.runtime.sendMessage({ action: 'CAPTURE_SHOP', slug: slug }, (response) => {
                btn.disabled = false;
                btn.textContent = 'キャプチャ (WebP)';

                if (response && response.success) {
                    statusDiv.textContent = `✅ ${slug}.webp 保存完了！`;
                    statusDiv.style.color = '#2e7d32'; // Green
                } else {
                    statusDiv.textContent = '❌ 失敗: ' + (response?.error || 'Unknown Error');
                    statusDiv.style.color = '#d32f2f'; // Red
                }
            });
        } catch (err) {
            btn.disabled = false;
            btn.textContent = 'キャプチャ (WebP)';
            statusDiv.textContent = '❌ 予期せぬエラーが発生しました';
            statusDiv.style.color = '#d32f2f';
        }
    });
});
