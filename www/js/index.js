// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton */
/* global detailPage, batteryState, batteryStateButton, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
'use strict';
var commandList = new Array()
const measuredPower = -58 //1 metro = -60 Dbm
class coordinatesStruct{
    constructor(X, Y, Z){
    this.X = X
    this.Y = Y
    this.Z = Z
    }
    setX(newX)
    {
        this.X = newX
    }
    setY(newY)
    {
        this.Y = newY
    }
    setZ(newZ)
    {
        this.Z = newZ
    }

    get Xpos()
    {
        return this.X
    }
    get Ypos()
    {
        return this.y
    }
    get Zpos()
    {
        return this.z
    }
}

class DistanceItem{
    constructor(rssi, coordinates){
    this.rssi = rssi
    this.coordinates = coordinates
    }
}

class PositioningItem{
    constructor(deviceName){
        this.deviceName = deviceName
        this.position1 = coordinatesStruct
        this.position2 = coordinatesStruct
        this.position3 = coordinatesStruct
    }
    setPosition1(distanceItem)
    {
        this.position1 = distanceItem
    }
    setPosition2(distanceItem)
    {
        this.position2 = distanceItem
    }
    setposition3(distanceItem)
    {
        this.position3 = distanceItem
    }
}

var deviceCoordinates = new coordinatesStruct
var itemPositionList = new PositioningItem

var ESP = {
    service: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
    write: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'
}

var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
        distancePage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        distancesButton.addEventListener('touchstart', this.showDistancePage, false);
        returnButton.addEventListener('touchstart', this.showMainPage, false);
        commandButton.addEventListener('touchstart', this.commandButtonAction, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
        if (window.DeviceMotionEvent != undefined) {
            window.addEventListener("devicemotion", this.updatecoordinates, true);
        }
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
        app.updatecoordinates();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        // scan for all devices
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {

        console.log(JSON.stringify(device));
        var devicePosition = new coordinatesItem(device.rssi, deviceCoordinates)
        positioningList.push(devicePosition)
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                'Distancia(Metros): ' + Math.round(Math.pow(10,(parseInt(measuredPower)-parseInt(device.rssi))/(10*2))*100)/100 + '&nbsp;|&nbsp;'
                device.id;
        
        //define distance item(get distance and accelerometer data for X,Y,Z positioning)
        //add distance item to distances list for current moment.
        //make a list containing the list of distances for the last 3 moments(2d positioning, 4 for 3d positioning)
        //account for error in each member of each list
        //calculate estimate positioning of object based on the intersection of the 3 circles
        //create vector to estimate point
        //copare angle of created vectors to current angle based on gyroscope to determine which device we're pointing to
        listItem.dataset.deviceId = device.id;  // TODO
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);

    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function() {

                // TODO check if we have the battery service
                // TODO check if the battery service can notify us
                //ble.startNotification(deviceId, battery.service, battery.level, app.onBatteryLevelChange, app.onError);
                commandButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                app.showDetailPage();
            };

        ble.connect(deviceId, onConnect, app.onError);
    },
    updatecoordinates: function(event){
        deviceCoordinates.newX(event.accelerationIncludingGravity.x*1)
        deviceCoordinates.newY(event.accelerationIncludingGravity.y*1)
        deviceCoordinates.newZ(event.accelerationIncludingGravity.z*1)
    },
    getDistance: function(device){
        return 
    },
    commandButtonAction: function(event) {
        var deviceId = event.target.dataset.deviceId
       /*  if (commandList.length === 0)
        {
            this.getCommands()
            this.commandButtonAction()
        }
        else
        {
            ble.write(deviceId, ESP, ESP, 'A')
        } */
        var array = new Uint8Array(1)
        array[0] = 65
        ble.write(deviceId, ESP.service, ESP.write, array.buffer, print('sent'), print('failed to send'))
    }, 
    disconnect: function(event) {
        var array = new Uint8Array(1)
        array[0] = 66
        var deviceId = event.target.dataset.deviceId;
        ble.write(deviceId,ESP.service,ESP.write,array.buffer, print('sent'), print('failed to send'))
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
        distancePage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
        distancePage.hidden = true;
    },
    showDistancePage: function() {
        mainPage.hidden = true;
        detailPage.hidden = true;
        distancePage.hidden = false;
    },
    onError: function(reason) {
        notification.alert("ERROR: " + reason); // real apps should use notification.alert
    },

    calculatePositioning: function(event){
        console.log("Accelerometer: "
        + event.accelerationIncludingGravity.x + ", "
        + event.accelerationIncludingGravity.y + ", "
        + event.accelerationIncludingGravity.z
  );

    }
};
