
// https://github.com/ccampbell/mousetrap
// https://craig.is/killing/mice
import Mousetrap from 'mousetrap';
; // global-bind must be import after Mousetrap
import 'mousetrap-global-bind';

import {ItemObject, StorageLocal} from './storageLocal';
import {Finder} from './finder';
import {Focus} from './focus';

function bindCallback(items: ItemObject): (e: ExtendedKeyboardEvent,
                                           combo: string) => any {
    return (e: ExtendedKeyboardEvent, combo: string) => {
        e.preventDefault();

        const settings = items.settings;
        const keys     = settings.keys;

        if (keys.blur == combo) {
            const active    = document.activeElement;
            const selection = window.getSelection();
            if (selection != null) {
                selection.removeAllRanges();
            }
            if (active != null) {
                (active as HTMLElement).blur();
            }
            window.top.focus();
            return;
        }

        const finder = Finder.new(settings.nearest);
        let element: HTMLElement|undefined;
        if (keys.next == combo) {
            element = finder.getNextInputElement();
        } else if (keys.prev == combo) {
            element = finder.getPrevInputElement();
        } else {
            return;
        }

        // console.log(e, combo);
        // console.log(element);

        if (typeof element != 'undefined') {
            const focus = Focus.new(settings.scroll, settings.marks);
            focus.to(element);
        }
    }
}

StorageLocal.get(items => {
    Mousetrap.bindGlobal(ItemObject.shortcutKeys(items), bindCallback(items));
});

const onChangedCallback = (items: ItemObject) => {
    Mousetrap.reset();
    Mousetrap.bindGlobal(ItemObject.shortcutKeys(items), bindCallback(items));
};

StorageLocal.onChangedListener(onChangedCallback);