import GObject from 'gi://GObject';
import St from 'gi://St';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';

function toNepaliBS(gregorianDate) {
    const bsMonthNames = [
        'Baishak', 
        'Jestha',    
        'Ashar',    
        'Sawan',    
        'Bhadra',    
        'Ashwin',   
        'Kartik',  
        'Mangsir',    
        'Poush',      
        'Magh',      
        'Falgun',   
        'Chaitra'     
    ];

    const adToBsOffset = 57;
    let adYear = gregorianDate.getFullYear();
    let adMonth = gregorianDate.getMonth() + 1; 
    let adDate = gregorianDate.getDate();
    
    let bsYear = adYear + adToBsOffset;
    let bsMonth, bsDay;

    if (adMonth > 4) { 
        bsMonth = adMonth - 4;
    } else {
        bsMonth = adMonth + 8;
        bsYear -= 1; 
    }
    
    bsDay = adDate;
    return `${bsMonthNames[bsMonth - 1]} ${bsDay} ${bsYear} `; // Return formatted BS date
}

const DateIndicator = GObject.registerClass(
class DateIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Current Date'));

        this._timeout = null;

        this._dateLabel = new St.Label({
            text: this._getCurrentDate(),
            y_align: Clutter.ActorAlign.CENTER
        });

        this.add_child(this._dateLabel);

        this._startDateUpdate();
    }

    _startDateUpdate() {
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }

        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            this._dateLabel.set_text(this._getCurrentDate());
            return true;
        });
    }

    _getCurrentDate() {
        let currentDate = new Date();
        let nepaliDate = toNepaliBS(currentDate);
        return nepaliDate;
    }

    destroy() {
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }
        super.destroy();
    }
});

export default class CurrentDateExtension extends Extension {
    enable() {
        this._indicator = new DateIndicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
};
