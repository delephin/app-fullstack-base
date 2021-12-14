class ApiFramework {

    public requestGET(url: string, callback: any) {
        // generado por ajax = asynchronous javascript And XML
        let xml = new XMLHttpRequest();

        xml.onreadystatechange = function respuestaServidor() {
            console.log('respuesta recibida', xml.readyState)

            if (xml.readyState == 4) {
                callback(xml.status, xml.responseText);
            }
        }

        console.log('opening')

        // open(verbo, url, asincrono true/false)
        xml.open("GET", url, true)

        xml.send();
    }

    public doPOST(device: Device, url: string, callback: any) {
        // generado por ajax = asynchronous javascript And XML
        let xml = new XMLHttpRequest();

        xml.onreadystatechange = function respuestaServidor() {
            console.log('respuesta recibida', xml.readyState)

            if (xml.readyState == 4) {
                callback(device, xml.status, xml.responseText);
            }
        }

        console.log('creating: ' + JSON.stringify(device))

        // open(verbo, url, asincrono true/false)
        xml.open("POST", url, true)
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.send(JSON.stringify(device));
    }

    public doPUT(device: Device, url: string, callback: any) {
        let xml = new XMLHttpRequest();

        xml.onreadystatechange = function respuestaServidor() {
            console.log('respuesta recibida', xml.readyState)

            if (xml.readyState == 4) {
                callback(xml.status, xml.responseText);
            }
        }

        console.log('opening')

        // open(verbo, url, asincrono true/false)
        xml.open("PUT", url, true)
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.send(JSON.stringify(device));
    }

    public doDELETE(deviceId: any, url: string, callback: any) {
        let xml = new XMLHttpRequest();

        xml.onreadystatechange = function respuestaServidor() {
            console.log('respuesta recibida', xml.readyState)

            if (xml.readyState == 4) {
                callback(deviceId, xml.status, xml.responseText);
            }
        }

        console.log('opening')

        // open(verbo, url, asincrono true/false)
        xml.open("DELETE", url, true)

        xml.send();
    }
}