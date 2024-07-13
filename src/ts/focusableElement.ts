export class FocusableElement {
    public domRect: DOMRect;
    constructor(private element: HTMLElement) {
        this.domRect = element.getBoundingClientRect();
    }

    public activate(selectAll: boolean) {
        // preventScroll is set to true, the browser will not scroll until the element into view after focus.
        this.element.focus({ preventScroll: true });

        if (selectAll == true && "select" in this.element) {
            (this.element as any).select();
        }
    }

    public isActive(): boolean {
        return document.activeElement == this.element;
    }

    public scrollIntoView(options: ScrollIntoViewOptions) {
        this.element.scrollIntoView(options);
    }
}
