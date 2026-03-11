/**
 * Add target="_blank" and rel="noopener noreferrer" to all external links in an HTML string.
 * External links are those starting with http:// or https:// and NOT pointing to directfound.com.
 */
export function addExternalLinkAttributes(html: string): string {
    return html.replace(
        /<a\s([^>]*?)href="(https?:\/\/(?!directfound\.com)[^"]+)"([^>]*?)>/gi,
        (match, before, url, after) => {
            // If target is already set, don't overwrite
            if (/target=/i.test(before) || /target=/i.test(after)) return match;
            return `<a ${before}href="${url}"${after} target="_blank" rel="noopener noreferrer">`;
        }
    );
}
