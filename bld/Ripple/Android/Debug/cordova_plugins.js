cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-social-message/www/socialmessage.js",
        "id": "cordova-plugin-social-message.SocialMessage",
        "clobbers": [
            "socialmessage"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-social-message": "0.3.1",
    "cordova-plugin-x-socialsharing": "5.0.4",
    "org.apache.cordova.geolocation": "0.3.10"
}
// BOTTOM OF METADATA
});