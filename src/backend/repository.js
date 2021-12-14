//=======[ Settings, Imports & Data ]==========================================
var connection = require('./mysql-connector');

findDevices = (callback) => {
    console.log('findDevices')

    connection.query("select d.id, d.name, d.description, st.name as state_type_description, st.id as state_type, d.state, dt.id as type, dt.name as type_description " +
    " from Devices d, StateType st, DeviceType dt " +
    " where d.type = dt.id " + 
    " and d.state_type = st.id " +
    " order by d.id asc", function (err, rows) {
        if (err) throw err;

        console.log("Device list: " + JSON.stringify(rows));
        return callback(rows, 200);
    });

    // connection.query("select * from Devices d order by d.id asc", function (err, rows) {
    //     if (err) throw err;

    //     console.log("Device list: " + JSON.stringify(rows));
    //     return callback(rows, 200);
    // });

}

findDeviceById = (deviceId, callback) => {
    console.log('findDeviceById')

    connection.query("select d.id, d.name, d.description, st.name as state_type_description, st.id as state_type, d.state, dt.id as type, dt.name as type_description" +
        " from Devices d, StateType st, DeviceType dt " +
        " where d.id = ? " + 
        " and d.type = dt.id " + 
        " and d.state_type = st.id ", deviceId, function (err, rows) {
            if (err) throw err;

            if (rows.length < 1) {
                console.log('Device not found.')
                return callback('Device not found. ', 404)
            }

            console.log("Device found: " + JSON.stringify(rows));
            return callback(rows, 200)
        });
}

createDevice = (device, callback) => {
    console.log('createDevice [' + JSON.stringify(device) + ']');

    connection.query("insert into Devices (id, name, description, state_type, state, type) "
        + " values (?, ?, ?, ?, ?, ?)", [device.id, device.name, device.description, device.state_type, device.state, device.type],
        function (err, result) {
            if (err) throw err;

            console.log("Device created: " + JSON.stringify(result));
            return callback(result, 200);
        });
}

updateDevice = (device, callback) => {
    console.log('updateDevice [' + JSON.stringify(device) + ']');

    connection.query("upadte Devices set name = ?, description = ?, state = ?, type = ? where id = ?",
        [device.name, device.description, device.state, device.type, device.id],
        function (err, result) {
            if (err) throw err;

            console.log("Device updated: " + JSON.stringify(result));
            return callback(result, 200);
        });
}

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