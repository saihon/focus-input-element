
type InputField = {
    element: HTMLElement
    domRect: DOMRect
}

// To sort founded input elements according to position.
const compareInputField = (a: InputField, b: InputField): number => {
    const aY = window.scrollY + a.domRect.top;
    const bY = window.scrollY + b.domRect.top;
    if (aY == bY) {
        const aX = window.scrollX + a.domRect.left;
        const bX = window.scrollX + b.domRect.left;
        return (aX > bX) ? 1 : -1;
    }
    return (aY > bY) ? 1 : -1;
}

export class Finder {
    private static instance: Finder;

    public nearest: boolean = false;

    private constructor() { }

    public static new(nearest: boolean): Finder {
        if (typeof Finder.instance === 'undefined') {
            Finder.instance = new Finder();
        }
        Finder.instance.nearest = nearest;
        return Finder.instance;
    }

    private isEditable(element: HTMLElement): boolean {
        const tagName = element.tagName;

        if (tagName == 'TEXTAREA' || tagName == 'INPUT') {
            if (element.getAttribute('disabled') != null ||
                element.getAttribute('readonly') != null) {
                return false;
            }

            // TextArea: https://www.w3.org/html/wiki/Elements/textarea
            if (tagName == 'TEXTAREA') {
                return true;
            }

            // Input:
            // https://www.w3.org/html/wiki/Elements/input
            if (tagName == 'INPUT') {
                switch (element.getAttribute('type')) {
                    case null: // if not set, it input element is type text
                    case 'date':
                    case 'datetime-local':
                    case 'email':
                    case 'month':
                    case 'number':
                    case 'password':
                    case 'search':
                    case 'tel':
                    case 'text':
                    case 'time':
                    case 'url':
                    case 'week':
                        return true;
                }
                return false;
            }
        }

        return element.isContentEditable;
    }

    // verify that the element is visible, including the parent element.
    private isVisible(element: HTMLElement, domRect: DOMRect): boolean {
        let _element = element;

        // elements not intended to be displayed
        if ((window.scrollX + domRect.left < 0 || window.scrollY + domRect.top < 0) ||
            (domRect.height < 1 || domRect.width < 1)) {
            return false;
        }

        do {
            if (_element.getAttribute('hidden') != null) {
                return false;
            }

            const a = _element.getAttribute('aria-hidden');
            if (a != null && a != 'false') {
                return false;
            }

            const styles = getComputedStyle(_element);
            if (styles.display == 'none' || styles.visibility == 'hidden') {
                return false;
            }
            if (_element.tagName == 'BODY') break;

        } while (_element = <HTMLElement>_element.parentElement)

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

        return absBottom >= activeAreaTop && absTop <= activeAreaBottom &&
            absLeft <= activeAreaRight && absRight >= activeAreaLeft;
    }

    // find element closest to the active area
    private pastActiveArea(domRect: DOMRect, order: Symbol): boolean {
        switch (order) {
            case this.ASCENDING:
                const activeAreaBottom = window.scrollY + window.innerHeight;
                const activeAreaRight = window.scrollX + window.innerWidth;
                const absBottom = window.scrollY + domRect.bottom;
                const absRight = window.scrollX + domRect.right;
                return absBottom > activeAreaBottom || absRight > activeAreaRight;
            case this.DESCENDING:
                const activeAreaTop = window.scrollY;
                const activeAreaLeft = window.scrollX;
                const absTop = window.scrollY + domRect.top;
                const absLeft = window.scrollX + domRect.left;

                return absTop <= activeAreaTop || absLeft <= activeAreaLeft;
        }
        return false;
    }

    private readonly ASCENDING: Symbol = Symbol(1);
    private readonly DESCENDING: Symbol = Symbol(2);


    private getInputElement(order: Symbol): HTMLElement | undefined {
        const collection = document.body.getElementsByTagName('*') as
            HTMLCollectionOf<HTMLElement>;

        const fields: InputField[] = [];
        for (const element of collection) {
            const domRect = element.getBoundingClientRect();
            if (this.isEditable(element) && this.isVisible(element, domRect)) {
                fields.push({ element: element, domRect: domRect });
            }
        }
        if (fields.length == 0) return;

        // Sort by absolute position.
        fields.sort(compareInputField);

        const activeElement = document.activeElement as HTMLElement;
        // for skipping until after an active element.
        let skip = this.isEditable(activeElement);

        if (skip) {
            const domRect = activeElement.getBoundingClientRect();
            skip = this.isVisible(activeElement, domRect);
            if (skip && this.nearest) {
                skip = this.inActiveArea(domRect);
            }
        }

        // set initial index number and additional values
        // in ascending or descending order
        const l = fields.length;
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

        // first found input element
        let firstElement: HTMLElement | undefined;

        for (; i >= 0 && i < l; i += a) {
            const field: InputField = fields[i];
            const element = field.element;
            const domRect = field.domRect;

            if (skip == false) {
                if (this.nearest) {
                    // element in or closest to the active area
                    if (this.inActiveArea(domRect) ||
                        this.pastActiveArea(domRect, order)) {
                        return element;
                    }
                } else {
                    return element;
                }
            }

            if (typeof firstElement == 'undefined') {
                firstElement = element;
            }

            if (skip == true && activeElement == element) {
                skip = false;
            }
        }

        return firstElement;
    }

    public getNextInputElement(): HTMLElement | undefined {
        return this.getInputElement(this.ASCENDING);
    }

    public getPrevInputElement(): HTMLElement | undefined {
        return this.getInputElement(this.DESCENDING);
    }
}