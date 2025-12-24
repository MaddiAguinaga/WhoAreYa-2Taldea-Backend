import { match } from "./match.js";

export function parse(players, query) {
    if (!players || !query) return [];

    const q = query.trim().toLowerCase();

    return players.filter(p =>
        match(q, p.name)     // jokalariaren izenarekin konparatzen dugu
    );
}