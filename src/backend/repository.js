//=======[ Settings, Imports & Data ]==========================================
var connection = require('./mysql-connector');

/**
 * Get all devices.
 * 
 * Params:
 *  - callback: Function to be called after the execution is done.
 */
findDevices = (callback) => {
    console.log('findDevices')

    connection.query("select * from Devices order by id asc", function (err, rows) {
        if (err) throw err;

        console.log("Device list: " + JSON.stringify(rows));
        return callback(rows, 200);
    });

}

/**
 * Get a device by id.
 * 
 * Params:
 *  - deviceId: Id of the device to be retrieved.
 *  - callback: Function to be called after the execution is done.
 */
findDeviceById = (deviceId, callback) => {
    console.log('findDeviceById')

    connection.query("select * from Devices where d.id = ? ", deviceId, function (err, rows) {
            if (err) throw err;

            if (rows.length < 1) {
                console.log('Device not found.')
                return callback('Device not found. ', 404)
            }

            console.log("Device found: " + JSON.stringify(rows));
            return callback(rows, 200)
        });
}

/**
 * Creates a device.
 * 
 * Params:
 *  - device: JSON representation of a device.
 *  - callback: Function to be called after the execution is done.
 */
createDevice = (device, callback) => {
    console.log('createDevice [' + JSON.stringify(device) + ']');

    connection.query("insert into Devices (id, name, description, state, type) "
        + " values (?, ?, ?, ?, ?)", [device.id, device.name, device.description, device.state, device.type],
        function (err, result) {
            if (err) throw err;

            console.log("Device created: " + JSON.stringify(result));
            return callback(result, 200);
        });
}

/**
 * Updates a device.
 * 
 * Params:
 *  - device: JSON representation of a device.
 *  - callback: Function to be called after the execution is done.
 */
updateDevice = (device, callback) => {
    console.log('updateDevice [' + JSON.stringify(device) + ']');

    connection.query("update Devices set name = ?, description = ?, state = ?, type = ? where id = ?",
        [device.name, device.description, device.state, device.type, device.id],
        function (err, result) {
            if (err) throw err;
            return callback(device, 200);
        });
}

/**
 * Deletes a device.
 * 
 * Params:
 *  - deviceId: Id of the device to be retrieved.
 *  - callback: Function to be called after the execution is done.
 */
deleteDevice = (deviceId, callback) => {
    console.log('deleteDevice [' + deviceId + ']');

    connection.query("delete from Devices where id = ?",
        deviceId,
        function (err, result) {
            if (err) throw err;

            console.log("Device deleted: " + JSON.stringify(result));
            return callback(result, 200);
        });
}

module.exports.findDevices = findDevices;
module.exports.findDeviceById = findDeviceById;
module.exports.createDevice = createDevice;
module.exports.updateDevice = updateDevice;
module.exports.deleteDevice = deleteDevice;