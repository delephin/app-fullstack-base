class Main {

    private lista: Array<User> = new Array();
    private deviceService = new DeviceService();
    private htmlFramework = new HtmlFramework();
    private devicesTable: HTMLTableElement;
    private getDevicesCallback: any;
    private createDeviceCallback: any;
    private deleteDeviceCallback: any;

    constructor() {
        this.getDevicesCallback = this.handleGetDevicesResponse.bind(this);
        this.createDeviceCallback = this.handleCreateDeviceResponse.bind(this);
        this.deleteDeviceCallback = this.handleDeleteDeviceResponse.bind(this);
        this.deviceService.getDevices(this.getDevicesCallback);
        this.devicesTable = <HTMLTableElement>document.getElementById("devices-table");
    }

    /**
     * Callback to process the result of getting all devices.
     * It will add a row to the devices html table for each device.
     * 
     * @param status Http status of the request.
     * @param response Body of the response, that will include all the devices.
     */
    handleGetDevicesResponse(status: number, response: string) {
        let devices: Array<Device> = JSON.parse(response);

        for (let device of devices) {
            this.htmlFramework.addDeviceRow(this.devicesTable, device);
        }
    }

    /**
     * Callback to process the result of deleting a device.
     * If status = 200, it will delete from the html table the row for the device selected.
     * 
     * @param deviceId Id of the device to delete.
     * @param status Http status of the request.
     * @param response Body of the response.
     */
    handleDeleteDeviceResponse(deviceId: any, status: number, response: string) {
        if (status === 200) {
            this.htmlFramework.deleteDeviceRow(document, deviceId);
        }
    }

    /**
     * Callback to process the result of creating a device.
     * If status = 200, it will add a new row to the html table that show the devices.
     * 
     * @param device Device that should be created.
     * @param status Http status of the request.
     * @param response Body of the response.
     */
    handleCreateDeviceResponse(device: Device, status: number, response: any) {
        let parsedResponse = JSON.parse(response);
        console.log('create response: ' + response)
        if (status === 200) {
            device.id = parsedResponse.insertId;
            this.htmlFramework.addDeviceRow(this.devicesTable, device);
        }
        this.cleanModal();
    }

    createDevice() {
        const newDeviceName = this.htmlFramework.getElementValueById(document, "new-device-name");
        const newDeviceDesc = this.htmlFramework.getElementValueById(document, "new-device-description");
        // device type select
        const selectedOption = this.htmlFramework.getSelectedItemFromSelect(document, "new-device-type");
        const newDeviceType = selectedOption.value;
        const newDeviceTypeDesc = selectedOption.text;
        // device state type select
        const selectedOption2 = this.htmlFramework.getSelectedItemFromSelect(document, "new-device-state-type");
        const newDeviceStateType = selectedOption2.value;
        const newDeviceStateTypeDesc = selectedOption2.text;
        let newDeviceState;

        if (newDeviceStateType == 1) {
            newDeviceState = document.getElementById("new-device-state").checked;
            newDeviceState = (newDeviceState) ? 1 : 0;
        } else {
            newDeviceState = document.getElementById("new-device-state").value;
            // to convert from the decimal state range to int
            newDeviceState = newDeviceState * 100;
        }

        let device = this.newDevice(undefined, newDeviceName, newDeviceDesc, newDeviceStateType, newDeviceStateTypeDesc, newDeviceState, newDeviceType, newDeviceTypeDesc);
        console.log("newDevice: " + JSON.stringify(device));

        this.deviceService.addDevice(device, this.createDeviceCallback);
    }

    editDevice(deviceId: any) {
        console.log('edit device');

        // this.htmlFramework.editDevice(this.devicesTable);
    }

    deleteDevice(deviceId: any) {
        console.log('deleting device');
        this.deviceService.deleteDevice(deviceId, this.deleteDeviceCallback);
    }

    showNewDeviceState(selectedStateTypeId: number) {
        this.htmlFramework.addNewDeviceState(document, selectedStateTypeId);
    }

    cleanModal() {
        this.htmlFramework.setElementValueById(document, "new-device-name", "")
        this.htmlFramework.setElementValueById(document, "new-device-description", "")
        this.htmlFramework.setElementValueById(document, "new-device-type", "");
        this.htmlFramework.setElementValueById(document, "new-device-state-type", "");
        this.htmlFramework.setElementValueById(document, "new-device-state", "");
    }

    private newDevice(id: number, name: string, description: string, state_type: number, state_type_description: string, state: number, type: number, type_description: string) {
        let device = new Device();
        device.id = id;
        device.description = description;
        device.name = name;
        device.state_type = state_type;
        device.state = state;
        device.state_type_description = state_type_description;
        device.type_description = type_description;
        device.type = type;
        return device;
    }
}

const myMain: Main = new Main();

window.onload = function inicio() {



    // get reference to add-device-button
    // let boton = document.getElementById("add-device-button");

    // // adding listener to button click event
    // boton.addEventListener("click", myMainObject)

    // document.getElementById("add-device-button").addEventListener("click", function (ev) {
    //         //myMainObject.addDevice();
    //         // let instance = M.Modal.getInstance(boton);
    //         // console.log("M: " + JSON.stringify(M))
    //         // console.log("Modal: " + JSON.stringify(M.modal))
    //         // instance.open();

    // }, false);

    //M.click;


    //    console.log('window onload')
}

document.addEventListener('DOMContentLoaded', function () {

    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, '');

    var elems1 = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems1, '');

    M.updateTextFields();
});