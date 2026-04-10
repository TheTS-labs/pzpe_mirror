import { TIME_TABLE_URL } from ".";

export default async function headPortal() {
    const res = await fetch(TIME_TABLE_URL, {
        method: "HEAD",
        signal: AbortSignal.timeout(1000)
    });

    return res.status === 200;
}
