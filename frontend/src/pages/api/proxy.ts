import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;
    const targetPath = Array.isArray(path) ? `/${path.join('/')}` : typeof path === 'string' ? path : '/';

    const base =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.BACKEND_URL ||
        'http://127.0.0.1:8000';

    const url = `${base}${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;

    try {
        // Build headers, but drop host-specific ones
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(req.headers)) {
            if (!v) continue;
            const key = k.toLowerCase();
            if (['host', 'connection', 'content-length'].includes(key)) continue;
            headers[key] = Array.isArray(v) ? v.join(',') : v;
        }
        if (!headers['content-type']) headers['content-type'] = 'application/json';

        const method = req.method || 'GET';
        const hasBody = !['GET', 'HEAD'].includes(method.toUpperCase());
        const body = hasBody ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {})) : undefined;

        const resp = await fetch(url, { method, headers, body });
        const contentType = resp.headers.get('content-type') || '';
        const status = resp.status;

        if (contentType.includes('application/json')) {
            const data = await resp.json();
            res.status(status).json(data);
        } else {
            const text = await resp.text();
            res.status(status).send(text);
        }
    } catch (err: any) {
        res.status(502).json({ error: 'Proxy error', message: err?.message || String(err) });
    }
}