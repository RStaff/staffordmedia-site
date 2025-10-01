<<<<<<< HEAD
export const TRIAL_URL = process.env.NEXT_PUBLIC_TRIAL_URL ?? "/signup";
export const PRICE_BASIC  = process.env.NEXT_PUBLIC_PRICE_BASIC  ?? "$X,XXX";
export const PRICE_GROWTH = process.env.NEXT_PUBLIC_PRICE_GROWTH ?? "$X,XXX";
export const PRICE_PRO    = process.env.NEXT_PUBLIC_PRICE_PRO    ?? "$X,XXX";
=======
export const TRIAL_URL = process.env.NEXT_PUBLIC_TRIAL_URL || "/signup";
export const DEMO_URL  = process.env.NEXT_PUBLIC_DEMO_URL  || "/demo";
export const BOOK_URL  = process.env.NEXT_PUBLIC_BOOK_URL  || "/book";

export const PRICE_BASIC  = process.env.NEXT_PUBLIC_PRICE_BASIC  || "29.99";
export const PRICE_GROWTH = process.env.NEXT_PUBLIC_PRICE_GROWTH || "59.99";
export const PRICE_PRO    = process.env.NEXT_PUBLIC_PRICE_PRO    || "149.99";
>>>>>>> f751bc5 (feat(site): About + Services + Pricing pages (drop-in))
