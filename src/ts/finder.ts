import { extractors } from "./extractor/_extractors";
import { FocusableElement } from "./focusableElement";

export class Finder {
    private static instance: Finder;

    public nearest: boolean = false;

    private constructor() {}

    public static new(nearest: boolean): Finder {
        if (typeof Finder.instance === "undefined") {
            Finder.instance = new Finder();
        }
        Finder.instance.nearest = nearest;
        return Finder.instance;
    }

    private isEditable(element: HTMLElement): boolean {
        const tagName = element.tagName;

        if (tagName == "TEXTAREA" || tagName == "INPUT") {
            if (
                element.getAttribute("disabled") != null ||
                element.getAttribute("readonly") != null
            ) {
                return false;
            }

            // TextArea: https://www.w3.org/html/wiki/Elements/textarea
            if (tagName == "TEXTAREA") {
                return true;
            }

            // Input:
            // https://www.w3.org/html/wiki/Elements/input
            if (tagName == "INPUT") {
                switch (element.getAttribute("type")) {
                    case null: // if not set, it input element is type text
                    case "date":
                    case "datetime-local":
                    case "email":
                    case "month":
                    case "number":
                    case "password":
                    case "search":
                    case "tel":
                    case "text":
                    case "time":
                    case "url":
                    case "week":
                        return true;
                }
                return false;
            }
        }

        return element.isContentEditable;
    }

    // verify that the element is visible, including the parent element.
    private isVisible(element: HTMLElement): boolean {
        const domRect = element.getBoundingClientRect();

        let _element = element;

        // elements not intended to be displayed
        if (
            window.scrollX + domRect.left < 0 ||
            window.scrollY + domRect.top < 0 ||
            domRect.height < 1 ||
            domRect.width < 1
        ) {
            return false;
        }

        do {
            if (_element.getAttribute("hidden") != null) {
                return false;
            }

            const a = _element.getAttribute("aria-hidden");
            if (a != null && a != "false") {
                return false;
            }

            const styles = getComputedStyle(_element);
            if (styles.display == "none" || styles.visibility == "hidden") {
                return false;
            }
            if (_element.tagName == "BODY") break;
        } while ((_element = <HTMLElement>_element.parentElement));

        return true;
    }

    // returns boolean whether the element is in active area.
    private inActiveArea(domRect: DOMRect): boolean {
        const absTop = window.scrollY + domRect.top;
        const absBottom = window.scrollY + domRect.bottom;
        const absLeft = window.scrollX + domRect.left;
        const absRight = window.scrollX + domRect.right;

        const activeAreaTop = window.scrollY;
        const activeAreaBottom = window.scrollY + window.innerHeight;
        const activeAreaLeft = window.scrollX;
        const activeAreaRight = window.scrollX + window.innerWidth;

        return (
            absBottom >= activeAreaTop &&
            absTop <= activeAreaBottom &&
            absLeft <= activeAreaRight &&
            absRight >= activeAreaLeft
        );
    }

    // find element closest to the active area
    private pastActiveArea(domRect: DOMRect, order: Symbol): boolean {
        switch (order) {
            case this.ASCENDING:
                const activeAreaBottom = window.scrollY + window.innerHeight;
                const activeAreaRight = window.scrollX + window.innerWidth;
                const absBottom = window.scrollY + domRect.bottom;
                const absRight = window.scrollX + domRect.right;
                return (
                    absBottom > activeAreaBottom || absRight > activeAreaRight
                );
            case this.DESCENDING:
                const activeAreaTop = window.scrollY;
                const activeAreaLeft = window.scrollX;
                const absTop = window.scrollY + domRect.top;
                const absLeft = window.scrollX + domRect.left;

                return absTop <= activeAreaTop || absLeft <= activeAreaLeft;
        }
        return false;
    }

    // A callback function for sorting.
    // Sort the found focusable elements according to their absolute position.
    compareFocusableElement(a: FocusableElement, b: FocusableElement): number {
        const aY = window.scrollY + a.domRect.top;
        const bY = window.scrollY + b.domRect.top;
        if (aY == bY) {
            const aX = window.scrollX + a.domRect.left;
            const bX = window.scrollX + b.domRect.left;
            return aX > bX ? 1 : -1;
        }
        return aY > bY ? 1 : -1;
    }

    private getFocusableElementAll(): FocusableElement[] | undefined {
        let focusableCollection: FocusableElement[] = [];

        const rawUrl = location.toString();
        for (const extractor of extractors) {
            if (extractor.matches.test(rawUrl)) {
                const a = extractor.extract();
                if (typeof a != "undefined") {
                    focusableCollection = focusableCollection.concat(a);
                }
            }
        }

        const collection = document.body.getElementsByTagName(
            "*"
        ) as HTMLCollectionOf<HTMLElement>;

        for (const element of collection) {
            if (this.isEditable(element) && this.isVisible(element)) {
                focusableCollection.push(new FocusableElement(element));
            }
        }
        if (focusableCollection.length == 0) return;

        // Sort by absolute position.
        focusableCollection.sort(this.compareFocusableElement);
        return focusableCollection;
    }

    private readonly ASCENDING: Symbol = Symbol(1);
    private readonly DESCENDING: Symbol = Symbol(2);

    private getFocusableElement(order: Symbol): FocusableElement | undefined {
        const focusableCollection = this.getFocusableElementAll();
        if (typeof focusableCollection == "undefined") {
            return;
        }

        const activeElement = document.activeElement as HTMLElement;
        // for skipping until after an active element.
        let skip = this.isEditable(activeElement);

        if (skip) {
            skip = this.isVisible(activeElement);
            if (skip && this.nearest) {
                const domRect = activeElement.getBoundingClientRect();
                skip = this.inActiveArea(domRect);
            }
        }

        // set initial index number and additional values
        // in ascending or descending order
        const l = focusableCollection.length;
        let a, i: number;
        switch (order) {
            case this.ASCENDING:
                a = 1;
                i = 0;
                break;
            case this.DESCENDING:
                a = -1;
                i = l - 1;
                break;
            default:
                return;
        }

        // first found focusable element
        let firstElement: FocusableElement | undefined;

        for (; i >= 0 && i < l; i += a) {
            const focusableElement: FocusableElement = focusableCollection[i];

            if (skip == false) {
                if (this.nearest) {
                    // element in or closest to the active area
                    if (
                        this.inActiveArea(focusableElement.domRect) ||
                        this.pastActiveArea(focusableElement.domRect, order)
                    ) {
                        return focusableElement;
                    }
                } else {
                    return focusableElement;
                }
            }

            if (typeof firstElement == "undefined") {
                firstElement = focusableElement;
            }

            if (skip == true && focusableElement.isActive()) {
                skip = false;
            }
        }

        return firstElement;
    }

    public getNextFocusableElement(): FocusableElement | undefined {
        return this.getFocusableElement(this.ASCENDING);
    }

    public getPrevFocusableElement(): FocusableElement | undefined {
        return this.getFocusableElement(this.DESCENDING);
    }

    public getFirstFocusableElement(): FocusableElement | undefined {
        const focusableCollection = this.getFocusableElementAll();
        if (typeof focusableCollection == "undefined") return;
        return focusableCollection[0];
    }

    public getLastFocusableElement(): FocusableElement | undefined {
        const focusableCollection = this.getFocusableElementAll();
        if (typeof focusableCollection == "undefined") return;
        return focusableCollection[focusableCollection.length - 1];
    }
}
