class Main {

    private lista: Array<User> = new Array();
    private deviceService = new DeviceService();
    private htmlFramework = new HtmlFramework();
    private devicesTable: HTMLTableElement;
    private getDevicesCallback: any;
    private createDeviceCallback: any;
    private deleteDeviceCallback: any;
    private updateDeviceCallback: any;
    private devices: Array<Device>;

    constructor() {
        this.getDevicesCallback = this.handleGetDevicesResponse.bind(this);
        this.updateDeviceCallback = this.handleUpdateDeviceResponse.bind(this);
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
        this.devices = JSON.parse(response);

        for (let device of this.devices) {
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
            const index = this.devices.findIndex(innerDevice => innerDevice.id == deviceId)

            if (index > -1) {
                this.devices.splice(index, 1);
            }
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
        if (status === 200) {
            device.id = parsedResponse.insertId;
            this.htmlFramework.addDeviceRow(this.devicesTable, device);
        }
        this.cleanNewModal();
    }

    /**
     * Callback to process the result of updating a device.
     * If status = 200, it will add a new row to the html table that show the devices.
     * 
     * @param device Device that should be updated.
     * @param status Http status of the request.
     * @param response Body of the response.
     */
    handleUpdateDeviceResponse(device: Device, status: number, response: any) {
        if (status === 200) {
            this.htmlFramework.editDeviceRow(document, device);
            const index = this.devices.findIndex(innerDevice => innerDevice.id == device.id)
            if (index > -1) {
                this.devices[index] = device;
            }
        }
    }

    /**
     * 
     * Retrieves information from the modal windows
     * to create a device.
     * Will call the device service to send a request to create a new device.
     * 
     */
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

        if (newDeviceStateType == 0) {
            newDeviceState = document.getElementById("new-device-state").checked;
            newDeviceState = (newDeviceState) ? 1 : 0;
        } else {
            newDeviceState = document.getElementById("new-device-state").value;
            // to convert from the decimal state range to int
            newDeviceState = newDeviceState * 100;
        }

        let device = this.newDevice(undefined, newDeviceName, newDeviceDesc, newDeviceState, newDeviceType);

        this.deviceService.addDevice(device, this.createDeviceCallback);
    }

    /**
     * Will call the HtmlFramework to fill the modal window 
     * with the device recovered with the deviceId.
     * @param deviceId Id of the device that will be edited.
     */
    loadEditModal(deviceId) {
        const deviceFound = this.devices.find(device => device.id == deviceId)
        this.htmlFramework.drawEditModal(document, deviceFound);

        M.FormSelect.init(document.querySelectorAll('select'), '');
    }

    /**
     * 
     * Retrieves information from the modal windows
     * to create a device object.
     * Will use the device service to send an update request.
     *  
     */
    editDevice() {
        console.log('edit device');

        const editDeviceId = this.htmlFramework.getElementValueById(document, "edit-device-id");
        const editDeviceName = this.htmlFramework.getElementValueById(document, "edit-device-name");
        const editDeviceDesc = this.htmlFramework.getElementValueById(document, "edit-device-description");
        // device type select
        const selectedOption = this.htmlFramework.getSelectedItemFromSelect(document, "edit-device-type");
        const editDeviceType = parseInt(selectedOption.value);

        // device state type select
        const selectedOption2 = this.htmlFramework.getSelectedItemFromSelect(document, "edit-device-state-type");
        const editDeviceStateType = selectedOption2.value;
        let editDeviceState;

        if (editDeviceStateType == 0) {
            editDeviceState = document.getElementById("edit-device-state").checked;
            editDeviceState = (editDeviceState) ? 1 : 0;
        } else {
            editDeviceState = document.getElementById("edit-device-state").value;
            // to convert from the decimal state range to int
            editDeviceState = editDeviceState * 100;
        }

        let device = this.newDevice(editDeviceId, editDeviceName, editDeviceDesc, editDeviceState, editDeviceType);

        this.deviceService.editDevice(device, this.updateDeviceCallback);
    }

    /**
     * Will call the device service to delete a device identified by deviceId.
     * After the request is executed the function deleteDeviceCallback will
     * be called to process the backend response.
     * @param deviceId Device identifier.
     */
    deleteDevice(deviceId: any) {
        console.log('deleting device');
        this.deviceService.deleteDevice(deviceId, this.deleteDeviceCallback);
    }

    /**
     * Will call the htmlFramework to draw the correct html element 
     * to represent the state of the device.
     * @param deviceId Device identifier.
     */
    showNewDeviceState(selectedStateTypeId: number) {
        this.htmlFramework.chageModalDeviceState(document, "new-device-state-div", "new-device-state", selectedStateTypeId, null);
    }


    /**
     * Will call the htmlFramework to change html element 
     * to represent the state of the device.
     * @param deviceId Device identifier.
     */
    changeDeviceState(selectedStateTypeId: number, value: any) {
        this.htmlFramework.chageModalDeviceState(document, "edit-device-state-div", "edit-device-state", selectedStateTypeId, value);
    }

    /**
     * Will clean the new modal window.
     */
    cleanNewModal() {
        this.htmlFramework.setElementValueById(document, "new-device-name", "")
        this.htmlFramework.setElementValueById(document, "new-device-description", "")
    }

    /**
     * Creates a device object.
     * @param id Device id.
     * @param name Device name.
     * @param description Device description.
     * @param state Device state.
     * @param type Device type.
     * @returns a new device object.
     */
    private newDevice(id: number, name: string, description: string, state: number, type: number) {
        let device = new Device();
        device.id = id;
        device.description = description;
        device.name = name;
        device.state = state;
        device.type = type;
        return device;
    }
}

const myMain: Main = new Main();
var modalInstance;
var editModalInstance;

document.addEventListener('DOMContentLoaded', function () {

    var elems = document.querySelectorAll('#newDeviceModal');
    modalInstance = M.Modal.init(elems, '');

    var elems = document.querySelectorAll('#editDeviceModal');
    editModalInstance = M.Modal.init(elems, {});

    var elems1 = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems1, '');

    M.updateTextFields();
});