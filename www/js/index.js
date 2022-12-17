'use strict';

import {postRequest} from "./api"

var commandType = 0;
let closestDevice = { name: "", id: "", rssi: "" };
const measuredPower = -58 //1 metro = -60 Dbm

var ESP = {
    service: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
    write: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'
}

var app = {
    initialize: function () {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        batteryStateButton.addEventListener('touchstart', this.commandButtonAction, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        connectButton.addEventListener('touchstart', this.connect, false)
        //deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function () {
        app.refreshDeviceList();
    },
    refreshDeviceList: function () {
        document.getElementById("connectButton").disabled = true;
        document.getElementById("refreshButton").disabled = true;
        deviceList.innerHTML = '';
        closestDevice = [];
        ble.scan([], 5, app.onDiscoverDevice, app.onError);

        setTimeout(function () {
            app.addTextElement(closestDevice.name, closestDevice.id,app.RSSItoDistance(closestDevice.rssi) + " M")
            connectButton.dataset.deviceId = closestDevice.id
            document.getElementById("connectButton").disabled = false;
            document.getElementById("refreshButton").disabled = false;
        }, 6000);
    },
    onDiscoverDevice: function (device) {

        console.log(JSON.stringify(device));
        if (closestDevice.name == null) {
            closestDevice.name = device.name;
            closestDevice.id = device.id;
            closestDevice.rssi = device.rssi;
        }

        if (parseInt(device.rssi) > parseInt(closestDevice.rssi)) {
            closestDevice.name = device.name;
            closestDevice.id = device.id;
            closestDevice.rssi = device.rssi;
        }

        /* var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id + '&nbsp;||&nbsp;' + closestDevice.name;

        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem); */
    },
    addTextElement: function (text) {
        var listItem = document.createElement('li'),
            html = '<b>' + text + '</b><br/>';
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },
    addTextElement: function (text1, text2, text3) {
        var listItem = document.createElement('li'),
            html = '<b>' + text1 + '</b><br/><br/>' +
             '<b>' + 'ID: ' + '</b>' + text2 + '<br/>' +
             '<b>' + 'Distancia: ' + '</b>' + text3;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
    },
    onConnect: function () {
        batteryStateButton.dataset.deviceId = closestDevice.id;
        disconnectButton.dataset.deviceId = closestDevice.id;
        app.showDetailPage();
    },
    connect: function () {
        ble.connect(closestDevice.id, app.onConnect, app.onError);
    },
    RSSItoDistance: function (rssi) {
        return Math.round(Math.pow(10, (parseInt(measuredPower) - parseInt(rssi)) / (10 * 2)) * 100) / 100;
    },
    commandButtonAction: function (event) {
        var deviceId = event.target.dataset.deviceId
        var array = new Uint8Array(1)
        if (commandType == 0) {
            array[0] = 65
            ble.write(deviceId, ESP.service, ESP.write, array.buffer, print('sent'), print('failed to send'))
            commandType = 1;
            //postRequest(1,"device_name", "device_lat","device_lng")
        }
        else {
            array[0] = 66
            ble.write(deviceId, ESP.service, ESP.write, array.buffer, print('sent'), print('failed to send'));
            commandType = 0;
            //postRequest(0,"device_name", "device_lat","device_lng")
        }
    },
    disconnect: function (event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function () {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function () {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onError: function (reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
