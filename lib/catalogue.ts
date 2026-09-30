import seed from "../data/works.json";
import { normalizeWorks } from "./works";

/** Published seed catalogue shared by the page (initial state) and the MCP route. */
export const SEED_WORKS = normalizeWorks(seed.works);
