import { FocusableElement } from "../focusableElement";

// Implement the Extractor interface to extract
// the missing focusable elements of each website.
// This is used for sites that use Shadow DOM etc.
export interface Extractor {
    // Regular expression matching the target web page URL.
    matches: RegExp;

    extract(): FocusableElement[] | undefined;
}
