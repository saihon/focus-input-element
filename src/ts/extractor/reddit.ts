import { FocusableElement } from "../focusableElement";
import { Extractor } from "./_extractorInterface";

export class RedditExtractor implements Extractor {
    matches: RegExp = /https:\/\/www\.reddit\.com/;

    extract(): FocusableElement[] | undefined {
        const a = document.querySelector("reddit-search-large")?.shadowRoot;
        if (!a) return;

        const b = a.querySelector("faceplate-search-input")?.shadowRoot;
        if (!b) return;

        const element = b.querySelector("input");
        if (!element) return;

        return [new FocusableElement(element as HTMLElement)];
    }
}
