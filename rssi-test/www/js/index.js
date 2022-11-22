'use strict';

app.initialize()

const app = {
    initialize: () => {
        document.addEventListener('deviceready', this.refreshDeviceList, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);

        detailPage.hidden = true;
    },

    bindEvents: () => {
        batteryStateButton.addEventListener('touchstart', this.readBatteryState, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },

    refreshDeviceList: () => {
        deviceList.innerHTML = ''; // empties the list
        ble.scan([], 5, app.onDiscoverDevice, app.onError); // scan for all devices
    },

    onDiscoverDevice: device => {

        console.log(JSON.stringify(device));
        const listItem = document.createElement('li');
        const html = '<b>' + device.name + '</b><br/>' +
            'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
            device.id;

        listItem.dataset.deviceId = device.id;  // TODO
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);

    },

    connect: e => {
        const deviceId = e.target.dataset.deviceId;
        const onConnect = () => {
            disconnectButton.dataset.deviceId = deviceId;
            app.showDetailPage();
        };

        ble.connect(deviceId, onConnect, app.onError);
    },

    disconnect: event => {
        const deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },

    showMainPage: () => {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },

    showDetailPage: () => {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },

    onError: reason => {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
