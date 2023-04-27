export type MarksOptions = {
    milliseconds: number; // if this value 0, disabled marks effect
    color: string; // css backgroundColor
};

export class ItemObject {
    settings: {
        // shortcut key
        keys: { next: string; prev: string; blur: string };
        // focus nearest element in active area or around
        nearest: boolean;
        // options. marks focused element
        marks: MarksOptions;
        /*
          ScrollIntoViewOptions{
            behavior: 'auto' | 'instant' | 'smooth'
            block:  'start' | 'center' | 'end' | 'nearest'
            inline:   'start' | 'center' | 'end' | 'nearest'
        } */
        scroll: ScrollIntoViewOptions;
    } = {
        // default settings
        keys: {
            next: "f2",
            prev: "shift+f2",
            blur: "f4",
        },
        nearest: true,
        marks: {
            milliseconds: 700,
            color: "#ff5566",
        },
        scroll: {
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        },
    };

    constructor() {}

    public static shortcutKeys(o: ItemObject): string[] {
        let a: string[] = [];
        let keys = o.settings.keys as { [k: string]: string };
        for (let key in keys) {
            let value = keys[key].trim();
            if (value == "") continue;
            a.push(value);
        }
        return a;
    }
}

export class StorageLocal {
    protected static readonly KEY: string = "settings";

    public static init() {
        const initialize = (items: { [key: string]: any }) => {
            if (
                typeof items == "undefined" ||
                !items.hasOwnProperty(StorageLocal.KEY)
            ) {
                StorageLocal.set(new ItemObject());
            }
        };
        StorageLocal.get(initialize);
    }

    public static set(items: ItemObject) {
        chrome.storage.local.set(items);
    }

    public static get(callback: (items: ItemObject) => void) {
        chrome.storage.local.get(StorageLocal.KEY, (items) =>
            callback(items as ItemObject)
        );
    }

    private static onChangedCallback(callback: (items: ItemObject) => void) {
        return (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string
        ) => {
            if (areaName != "local") return;
            StorageLocal.get(callback);
        };
    }

    public static onChangedListener(callback: (items: ItemObject) => void) {
        chrome.storage.onChanged.addListener(
            StorageLocal.onChangedCallback(callback)
        );
    }
}
