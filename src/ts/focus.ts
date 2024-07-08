import { MarkerOptions } from "./storageLocal";

export class Marker {
    private animationProperties: PropertyIndexedKeyframes = {
        opacity: ["0.8", "0"],
        // width: ["10px", "20px", "50px", "20px", "80px"],
        // height: ["10px", "20px", "50px", "20px", "80px"],
        // top: [],
        // left: [],
    };

    private readonly styles: { [k: string]: any } = {
        position: "absolute",
        zIndex: "1000000000",
        padding: "0px",
        margin: "0px",
        boxShadow: "0 0 8px #888",
        borderRadius: "50%",
    };

    constructor(public options: MarkerOptions) {}

    private createElement(
        tagName: string,
        top: number,
        left: number
    ): HTMLElement {
        let element = document.createElement(tagName);
        for (const k in this.styles) {
            (<{ [k: string]: any }>element.style)[k] = this.styles[k];
        }
        element.style.top = String(top) + "px";
        element.style.left = String(left) + "px";
        (element.style.backgroundColor = this.options.color || "#ff5566"),
            document.documentElement.appendChild(element);
        return element;
    }

    private makeAnimationProperties(
        top: number,
        left: number
    ): PropertyIndexedKeyframes {
        this.animationProperties.top = [
            String(top) + "px",
            String(top - 5) + "px",
            String(top - 18) + "px",
            String(top - 5) + "px",
            String(top - 30) + "px",
        ];

        this.animationProperties.left = [
            String(left) + "px",
            String(left - 5) + "px",
            String(left - 18) + "px",
            String(left - 5) + "px",
            String(left - 30) + "px",
        ];

        const n = this.options.size;
        const a = new Array(5);
        let i = 0;
        for (const x of [1, 2, 5, 2, 8]) {
            a[i] = n * x + "px";
            i++;
        }
        this.animationProperties.width = a;
        this.animationProperties.height = a;

        return this.animationProperties;
    }

    public draw(element: HTMLElement) {
        if (this.options.milliseconds < 1 || this.options.size < 1) return;

        const clientRect = element.getBoundingClientRect();
        const top = window.scrollY + clientRect.top;
        const left = window.scrollX + clientRect.left;

        let div = this.createElement("div", top, left);

        let animation = div.animate(
            this.makeAnimationProperties(top, left),
            this.options.milliseconds
        );

        animation.addEventListener("finish", () =>
            document.documentElement.removeChild(div)
        );
    }
}

export class Focus {
    private static instance: Focus;

    private scrollOptions: ScrollIntoViewOptions;
    private marker: Marker;

    private constructor(
        scrollOptions: ScrollIntoViewOptions,
        markerOptions: MarkerOptions
    ) {
        this.scrollOptions = scrollOptions;
        this.marker = new Marker(markerOptions);
    }

    public static new(
        scrollOptions: ScrollIntoViewOptions,
        markerOptions: MarkerOptions
    ) {
        if (typeof Focus.instance === "undefined") {
            Focus.instance = new Focus(scrollOptions, markerOptions);
        } else {
            Focus.instance.scrollOptions = scrollOptions;
            Focus.instance.marker.options = markerOptions;
        }
        return Focus.instance;
    }

    public on(element: HTMLElement): void {
        element.focus();
        element.scrollIntoView(this.scrollOptions);
        this.marker.draw(element);
    }
}
