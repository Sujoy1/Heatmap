// Copyright    - Frubil s.r.o. - https://frubil.com/
// Licence      - https://frubil.info/licence.html

function FrubilJSdetector() {
    var self = this;
    var Client = function() {
        this.class = "Browser";
        this.class_code = "browser";
        this.name = "Chrome";
        this.name_code = "chrome";
        this.version = "83.0.4103.116";
        this.version_major = "83";
        this.os = "Linux";
        this.os_code = "linux";
        this.os_family = "Linux";
        this.os_family_code = "linux"
    };
    var Device = function() {
        this.class = "Desktop";
        this.class_code = "desktop";
        this.brand = "";
        this.brand_code = "";
        this.marketname = ""
    };
    var Status = function() {
        this.value = 1
    };
    Client.prototype = {
        isClass: function() {
            var valid = false;
            for (i = 0; i < arguments.length; i++) {
                if (arguments[i] == this.class || arguments[i] == this.class_code) {
                    valid = true;
                    break
                }
            }
            return valid
        },
        isOs: function() {
            var valid = false;
            for (i = 0; i < arguments.length; i++) {
                if (arguments[i] == this.os || arguments[i] == this.os_code) {
                    valid = true;
                    break
                }
            }
            return valid
        },
        isOsFamily: function() {
            var valid = false;
            for (i = 0; i < arguments.length; i++) {
                if (arguments[i] == this.os_family || arguments[i] == this.os_family_code) {
                    valid = true;
                    break
                }
            }
            return valid
        }
    };
    Device.prototype = {
        isClass: function() {
            var valid = false;
            for (i = 0; i < arguments.length; i++) {
                if (arguments[i] == this.class || arguments[i] == this.class_code) {
                    valid = true;
                    break
                }
            }
            return valid
        },
        isBrand: function() {
            var valid = false;
            for (i = 0; i < arguments.length; i++) {
                if (arguments[i] == this.brand || arguments[i] == this.brand_code) {
                    valid = true;
                    break
                }
            }
            return valid
        }
    };
    this.client = new Client();
    this.device = new Device();
    this.status = new Status()
}
var FRUBIL = new FrubilJSdetector();