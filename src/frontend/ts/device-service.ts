class DeviceService {

    private framework = new ApiFramework();

    constructor() { }

    public getDevices(processResponseCallback: any) {
        this.framework.requestGET("http://localhost:8000/devices", processResponseCallback);
    }

    public addDevice(device: Device, processResponseCallback: any) {
        this.framework.doPOST(device, "http://localhost:8000/devices", processResponseCallback);
    }

    public editDevice(device: Device, processResponseCallback: any) {
        this.framework.doPUT(device, "http://localhost:8000/devices" + device.id, processResponseCallback);
    }

    public deleteDevice(deviceId: any, processResponseCallback: any) {
        this.framework.doDELETE(deviceId, "http://localhost:8000/devices/" + deviceId, processResponseCallback);
    }
}