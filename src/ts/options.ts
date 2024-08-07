import "../css/styles.css";
import "./contentScript";
import { ItemObject, StorageLocal } from "./storageLocal";

const pattern = new RegExp(
    "f[1-9]|f1[0-2]|ctrl|shift|alt|meta|backspace|tab|enter|return|capslock|esc|escape|space|pageup|pagedown|end|home|left|up|right|down|ins|del|plus",
    "ig"
);

const normalize = function (key: string): string {
    return key
        .trim()
        .replace(/\s+/, " ")
        .replace(pattern, (v) => v.toLowerCase())
        .split(/\s*\+\s*/)
        .join("+");
};

const handleEvent = function (e: any) {
    e.preventDefault();
    if (!e.target.checkValidity()) {
        return;
    }

    if (e.type == "change") {
        StorageLocal.get((items) => {
            switch (e.target.name) {
                case "next":
                case "prev":
                case "blur":
                case "first":
                case "last":
                    (items.settings.keys as any)[e.target.name] = normalize(
                        e.target.value
                    );
                    break;
                case "nearest":
                    items.settings.nearest = e.target.checked;
                    break;
                case "autofocus":
                    items.settings.autofocus = e.target.checked;
                    break;
                case "selectAll":
                    items.settings.selectAll = e.target.checked;
                    break;
                case "milliseconds":
                case "color":
                case "size":
                    (items.settings.marker as any)[e.target.name] =
                        e.target.value;
                    break;
                case "behavior":
                case "block":
                case "inline":
                    (items.settings.scroll as any)[e.target.name] =
                        e.target[e.target.selectedIndex].value;
                    break;
            }
            StorageLocal.set(items);
        });
    }
};

const onLoad = function (items: ItemObject) {
    const form = (document as any)["settings"];
    form.addEventListener("change", handleEvent);

    // nearest
    form.nearest.checked = items.settings.nearest;
    form.autofocus.checked = items.settings.autofocus;
    form.selectAll.checked = items.settings.selectAll;

    // keys
    const keys = items.settings.keys;
    form.next.value = keys.next;
    form.prev.value = keys.prev;
    form.blur.value = keys.blur;
    form.first.value = keys.first;
    form.last.value = keys.last;

    // marker options
    const marker = items.settings.marker;
    form.milliseconds.value = marker.milliseconds;
    form.color.value = marker.color;
    form.size.value = marker.size;

    const indexOf = function (name: string, options: any): number {
        const l = options.length;
        for (let i = 0; i < l; i++) {
            if (options[i].value == name) return i;
        }
        return -1;
    };

    let index: number;
    const scroll = items.settings.scroll;
    index = indexOf(<string>scroll.behavior, form.behavior.options);
    form.behavior.options[index].selected = true;

    index = indexOf(<string>scroll.block, form.block.options);
    form.block.options[index].selected = true;

    index = indexOf(<string>scroll.inline, form.inline.options);
    form.inline.options[index].selected = true;
};

StorageLocal.get(onLoad);
