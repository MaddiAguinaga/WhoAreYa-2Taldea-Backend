export function match(query, text) {
    if (!query || !text) return false;

    // lowercase konparaketa azpikateak bilatzeko
    return text.toLowerCase().includes(query.toLowerCase());
}