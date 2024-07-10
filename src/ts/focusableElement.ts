export class FocusableElement {
    public domRect: DOMRect;
    constructor(private element: HTMLElement) {
        this.domRect = element.getBoundingClientRect();
    }

    public activate(preventScroll: boolean = false) {
        // preventScroll is set to true, the browser will not scroll until the element into view after focus.
        this.element.focus({ preventScroll: preventScroll });
    }

    public isActive(): boolean {
        return document.activeElement == this.element;
    }

    public scrollIntoView(options: ScrollIntoViewOptions) {
        this.element.scrollIntoView(options);
    }
}
