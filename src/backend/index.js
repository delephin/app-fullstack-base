//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
//var utils = require('./mysql-connector');
var repo = require('./repository')

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

/* 
* get all devices
*
* returns:
*   - 200 successfully retrieved a list of devices
*/
app.get('/devices/', function (req, res, next) {
    console.log('calling repo')

    repo.findDevices(function (result, statusCode) {
        res.status(statusCode).send(result);
    });
});

/* 
* get a device by id
*
* parameters:
*   - id: identificator associated to a device
* returns:
*   - 200 if device found
*   - 404 if device not found
*/
app.get('/devices/:id', function (req, res, next) {

    console.log('calling repo with id: ' + req.params.id)

    repo.findDeviceById(req.params.id, function (result, statusCode) {
        res.status(statusCode).send(result);
    })
})

/** 
* Create new device.
*
* Body can not be empty
*
* Returns:
*   - 200 device created successfully
*/
app.post('/devices', function (req, res, next) {
    let device = req.body

    console.log('creating device: ' + JSON.stringify(req.body))

    validateEmpty(req, res);

    repo.createDevice(device, function (result, statusCode) {
        res.status(statusCode).send(result);
    });
});

/**
 * Update device.
 * 
 * Returns:
 *   - 200 device updated successfully.
 *   - 404 if device does not exist.
 */
app.put('/devices/:id', function (req, res, next) {

    validateEmpty(req, res);

    repo.updateDevice(device, function (result, statusCode) {
        res.status(statusCode).send(result);
    });
});

/**
 * Delete device.
 * 
 * Returns:
 *   - 200 device deleted successfully.
 *   - 404 if device does not exist.
 */
 app.delete('/devices/:id', function (req, res, next) {

    const deviceId = req.params.id;

    console.log('deleting device with id: ' + deviceId)

    repo.deleteDevice(deviceId, function (result, statusCode) {
        res.status(statusCode).send(result);
    });
});

// helper functions
const validateEmpty = (req, res) => {
    let body = req.body;
    if (!body || Object.keys(body).length === 0) {
        console.log("Device body can not be empty.");
        return res.status(500).send({
            error: "Device body can not be empty"
        });
    }
}

app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
