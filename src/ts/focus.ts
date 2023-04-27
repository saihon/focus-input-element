import { MarksOptions } from "./storageLocal";

export class Focus {
    private static instance: Focus;

    private scrollOptions: ScrollIntoViewOptions;
    private marksOptions: MarksOptions;
    private animationProperties: PropertyIndexedKeyframes = {
        opacity: ["0.8", "0"],
        width: ["10px", "20px", "50px", "20px", "80px"],
        height: ["10px", "20px", "50px", "20px", "80px"],
    };
    private readonly styles: { [k: string]: any } = {
        position: "absolute",
        zIndex: "1000000000",
        padding: "0px",
        margin: "0px",
        boxShadow: "0 0 8px #888",
        borderRadius: "50%",
    };

    private constructor(
        scrollOptions: ScrollIntoViewOptions,
        marksOptions: MarksOptions
    ) {
        this.scrollOptions = scrollOptions;
        this.marksOptions = marksOptions;
    }

    public static new(
        scrollOptions: ScrollIntoViewOptions,
        marksOptions: MarksOptions
    ) {
        if (typeof Focus.instance === "undefined") {
            Focus.instance = new Focus(scrollOptions, marksOptions);
        } else {
            Focus.instance.scrollOptions = scrollOptions;
            Focus.instance.marksOptions = marksOptions;
        }
        return Focus.instance;
    }

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
        (element.style.backgroundColor = this.marksOptions.color || "#ff5566"),
            document.documentElement.appendChild(element);
        return element;
    }

    private getAnimationProperties(
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
        return this.animationProperties;
    }

    public on(element: HTMLElement): void {
        element.focus();
        element.scrollIntoView(this.scrollOptions);
        if (this.marksOptions.milliseconds < 1) return;

        const clientRect = element.getBoundingClientRect();
        const top = window.scrollY + clientRect.top;
        const left = window.scrollX + clientRect.left;

        let div = this.createElement("div", top, left);

        let animation = div.animate(
            this.getAnimationProperties(top, left),
            this.marksOptions.milliseconds
        );

        animation.addEventListener("finish", () =>
            document.documentElement.removeChild(div)
        );
    }
}
