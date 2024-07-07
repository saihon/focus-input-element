export type MarkerOptions = {
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
        marker: MarkerOptions;
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
        marker: {
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

    public static set(items: ItemObject) {
        chrome.storage.local.set(items);
    }

    public static get(callback: (items: ItemObject) => void) {
        chrome.storage.local.get(StorageLocal.KEY, (items) => {
            if (
                typeof items == "undefined" ||
                !items.hasOwnProperty(StorageLocal.KEY)
            ) {
                items = new ItemObject();
                chrome.storage.local.set(items);
            } else {
                // Temporary processing required due to name change
                // and should to be removed in a future version.
                // Current version 1.4
                const settings = items[StorageLocal.KEY];
                if (
                    settings.hasOwnProperty("marks") &&
                    !settings.hasOwnProperty("marker")
                ) {
                    items[StorageLocal.KEY].marker =
                        items[StorageLocal.KEY].marks;
                    chrome.storage.local.set(items);
                }
            }
            callback(items as ItemObject);
        });
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
