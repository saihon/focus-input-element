// https://github.com/ccampbell/mousetrap
// https://craig.is/killing/mice
import Mousetrap from "mousetrap"; // global-bind must be import after Mousetrap
import "mousetrap/plugins/global-bind/mousetrap-global-bind";

import { ItemObject, StorageLocal } from "./storageLocal";
import { FocusableElement } from "./focusableElement";
import { Focus, FocusOptions } from "./focus";
import { Finder } from "./finder";

function autofocus(items: ItemObject) {
    const settings = items.settings;
    const finder = Finder.new(settings.nearest);

    if (settings.autofocus) {
        const focusableElement = finder.getFirstFocusableElement();
        if (typeof focusableElement == "undefined") return;
        focusableElement.activate(settings.selectAll);
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
        let element: FocusableElement | undefined;

        switch (combo) {
            case keys.next:
                element = finder.getNextFocusableElement();
                break;
            case keys.prev:
                element = finder.getPrevFocusableElement();
                break;
            case keys.first:
                element = finder.getFirstFocusableElement();
                break;
            case keys.last:
                element = finder.getLastFocusableElement();
                break;
            default:
                return;
        }

        // console.log(e, combo);
        // console.log(element);

        if (typeof element != "undefined") {
            const focusOptions: FocusOptions = {
                scroll: settings.scroll,
                marker: settings.marker,
                selectAll: settings.selectAll,
            };
            Focus.new(focusOptions).on(element);
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
