// https://github.com/ccampbell/mousetrap
// https://craig.is/killing/mice
import Mousetrap from "mousetrap"; // global-bind must be import after Mousetrap
import "mousetrap/plugins/global-bind/mousetrap-global-bind";

import { ItemObject, StorageLocal } from "./storageLocal";
import { Finder } from "./finder";
import { Focus } from "./focus";

function autofocus(items: ItemObject) {
    const settings = items.settings;
    const finder = Finder.new(settings.nearest);
    if (settings.autofocus) {
        const element = finder.getFirstInputElement();
        if (typeof element == "undefined") return;
        element.focus();
    }
}

function bindCallback(items: ItemObject): (e: Event, combo: string) => any {
    return (e: Event, combo: string) => {
        e.preventDefault();

        const settings = items.settings;
        const keys = settings.keys;

        if (keys.blur == combo) {
            const active = document.activeElement;
            const selection = window.getSelection();
            if (selection != null) {
                selection.removeAllRanges();
            }
            if (active != null) {
                (active as HTMLElement).blur();
            }
            window.top?.focus();
            return;
        }

        const finder = Finder.new(settings.nearest);
        let element: HTMLElement | undefined;

        switch (combo) {
            case keys.next:
                element = finder.getNextInputElement();
                break;
            case keys.prev:
                element = finder.getPrevInputElement();
                break;
            case keys.first:
                element = finder.getFirstInputElement();
                break;
            case keys.last:
                element = finder.getLastInputElement();
                break;
            default:
                return;
        }

        // console.log(e, combo);
        // console.log(element);

        if (typeof element != "undefined") {
            const focus = Focus.new(settings.scroll, settings.marker);
            focus.on(element);
        }
    };
}

StorageLocal.get((items) => {
    Mousetrap.bindGlobal(ItemObject.shortcutKeys(items), bindCallback(items));
    autofocus(items);
});

const onChangedCallback = (items: ItemObject) => {
    Mousetrap.reset();
    Mousetrap.bindGlobal(ItemObject.shortcutKeys(items), bindCallback(items));
};

StorageLocal.onChangedListener(onChangedCallback);
