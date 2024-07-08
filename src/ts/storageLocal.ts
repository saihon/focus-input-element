export type MarkerOptions = {
    milliseconds: number; // Appearance time. If this value is 0, disabled marker effect
    color: string; // CSS backgroundColor
    size: number; // Marker size.
};

export class ItemObject {
    settings: {
        // Each shortcut key.
        keys: {
            next: string;
            prev: string;
            blur: string;
            first: string;
            last: string;
        };
        // Focus nearest element in active area or around.
        nearest: boolean;
        // Automatically focus the first input element when the page loads.
        autofocus: boolean;
        // Marker options
        marker: MarkerOptions;
        /*
          ScrollIntoViewOptions{
            behavior: 'auto' | 'instant' | 'smooth'
            block:  'start' | 'center' | 'end' | 'nearest'
            inline:   'start' | 'center' | 'end' | 'nearest'
        } */
        scroll: ScrollIntoViewOptions;
    } = {
        // Default settings
        keys: {
            next: "f2",
            prev: "shift+f2",
            blur: "f4",
            first: "",
            last: "",
        },
        nearest: true,
        autofocus: false,
        marker: {
            milliseconds: 700,
            color: "#ff5566",
            size: 10,
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

    private static addOptions(items: any) {
        // This is a temporary process that occurs when adding settings.
        // Current version 1.4 and should to be removed in a future version.

        let changed = false;

        const o = items[StorageLocal.KEY];

        if (o.hasOwnProperty("marks") && !o.hasOwnProperty("marker")) {
            items[StorageLocal.KEY].marker = items[StorageLocal.KEY].marks;
            items[StorageLocal.KEY].marker.size = 10;
            delete items[StorageLocal.KEY].marks;
        }

        if (typeof o.marker.size == "string") {
            const m = o.marker.size.match(/^\d+/);
            if (m != null) items[StorageLocal.KEY].marker.size = m[0] - 0; // string to number
        }

        if (!o.hasOwnProperty("autofocus")) {
            items[StorageLocal.KEY].autofocus = false;
        }

        if (
            !o["keys"].hasOwnProperty("first") ||
            !o["keys"].hasOwnProperty("last")
        ) {
            items[StorageLocal.KEY].keys["first"] = "";
            items[StorageLocal.KEY].keys["last"] = "";
        }

        if (changed) chrome.storage.local.set(items);
        return items;
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
                items = StorageLocal.addOptions(items);
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
