export default function pingSite(url: string, timeoutMs = 2000) {
    return new Promise((resolve, reject) => {
        const timerId = setTimeout(reject, timeoutMs);
        const img = new Image();

        img.onload = () => {
            clearTimeout(timerId);
            resolve(undefined);
        };
        img.onerror = () => {
            clearTimeout(timerId);
            reject()
        };

        img.src = url;
    });
}
