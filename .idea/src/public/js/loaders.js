export { fetchJSON };

async function fetchJSON(what) {
    if (!what) throw new Error('fetchJSON: "what" parametroa falta da');
    try {
        const res = await fetch(what);
        if (!res.ok) throw new Error(`fetchJSON: HTTP ${res.status} ${res.statusText}`);
        return await res.json();
    } catch (err) {
        console.error('fetchJSON error:', err);
        throw err;
    }


}
