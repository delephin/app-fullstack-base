class HtmlFramework {

    /**
     * Will add a cell to a Html Table to show the data related to a device.
     * @param table the HTML Table that will contain the new cell.
     * @param device the device that will be related to the cell.
     */
    public addDeviceRow(table: HTMLTableElement, device: Device) {
        const tr = table.insertRow();

        const deviceId = device.id;

        // setting row id as the device id
        tr.setAttribute('id', String(deviceId));

        // adding cell for name
        this.addCell(device.name, tr);

        // adding cell for description
        this.addCell(device.description, tr);

        // adding cell for state
        let stateValue = device.state / 100;

        console.log("adding row: " + JSON.stringify(device));
        let stateContent;
        if (device.state_type_description === "On-Off" || device.state_type === 1) {
            if (device.state == 1) {
                stateContent = "<div class=\"switch\"> <label> Off <input disabled type=\"checkbox\" checked> <span class=\"lever\"></span>On </label> </div>"
            } else {
                stateContent = "<div class=\"switch\"> <label> Off <input disabled type=\"checkbox\"> <span class=\"lever\"></span>On </label> </div>"
            }
        } else {
            if (device.state == 1) {
                stateContent = "<p class=\"range-field\"><input disabled class=\"range\" type=\"range\" style=\"width:50%\" min=\"0\" max=\"1\" step =\"0.10\" value=\"" + stateValue + "\"/></p>"
            } else {
                stateContent = "<input disabled class=\"input-field range\" style=\"width:50%\" type=\"range\" min=\"0\" max=\"1\" step =\"0.10\" value=\"" + stateValue + "\" onchange=\"console.log('range: '+this.value)\"/>"
            }
        }
        this.addCell(stateContent, tr);
        // console.log(stateContent)

        // adding cell for state
        this.addCell(device.type_description, tr);

        // adding cell for actions, inserting icons for delete and edit
        this.addCellWithActionsButtons(deviceId, tr);

    }

    /**
     * Will add to a Html Table row a cell with content defined by innerHtml.
     * @param innerHtml the cells content.
     * @param row the Html row that will contain the new cell.
     */
    public addCell(innerHtml: any, row: HTMLTableRowElement) {
        const cell = row.insertCell();
        cell.innerHTML = innerHtml;
    }

    /**
     * Will add a cell with two buttons to an Html Table row.
     * One of the buttons will trigger a modal to edit the related device.
     * The other button will delete the element from the table and the database.
     * @param deviceId Device id that will be used to form the element id.
     * @param row HTML table row that will contain the new cell.
     */
    public addCellWithActionsButtons(deviceId: any, row: HTMLTableRowElement) {
        const cell = row.insertCell();

        // add edit button
        cell.innerHTML = "<button class=\"btn\" id=\"edit-btn-" + deviceId + "\" onclick=\"myMain.editDevice(" + deviceId + ")\"><i class=\"material-icons\">edit</i></button>";

        // add delete button
        cell.innerHTML += "<button style=\"margin-left:2px\" class=\"btn\" id=\"delete-btn-" + deviceId + "\" onclick=\"myMain.deleteDevice(" + deviceId + ")\"><i class=\"material-icons\">delete</i></button>";
    }


    /**
     * Will delete the element with the rowId from the parent table.
     * @param document Html document that contains all the elements.
     * @param rowId Id of the row that'll be deleted.
     */
    public deleteDeviceRow(document: any, rowId: any) {
        const row = document.getElementById(rowId);
        row.parentNode.removeChild(row);
    }

    /**
     * Will add the appropriate element to represent the state of a device
     * based on the stateType selected.
     * @param document Html document.
     * @param selectedStateTypeId StateType selected from combo box. Indicates which kind of element will 
     *  better represent the device's state.
     */
    public addNewDeviceState(document, selectedStateTypeId: number) {
        console.log('selectedStateType: ' + selectedStateTypeId);
        const selectElement = document.getElementById("new-device-state-div");

        let innertHtml = "<label for=\"new-device-state\">State</label>"

        if (selectedStateTypeId == 1) {
            innertHtml += "<div class=\"switch\"> <label> Off <input id=\"new-device-state\" type=\"checkbox\"> <span class=\"lever\"></span>On </label> </div>";
        } else {
            innertHtml += "<p class=\"range-field\"> <input id=\"new-device-state\" type=\"range\" min=\"0\" max=\"1\" step =\"0.10\" class=\"range\"> </p>";
        }

        selectElement.innerHTML = innertHtml;
    }

    /**
     * Will get an element value based on the elementId and the html document.
     * @param document Html document.
     * @param elementId Id of the element that will be retrieved.
     * @returns the value of the element identified by elementId.
     */
    public getElementValueById(document, elementId) {
        return document.getElementById(elementId).value;
    }

    /**
     * Will get the selected option from a Html Select.
     * @param document Html document.
     * @param elementId Id of the select that will be retrieved.
     * @returns The selected option of the Html Select identified by elementId.
     */
    public getSelectedItemFromSelect(document, elementId) {
        const selectElement = document.getElementById(elementId);
        return selectElement.options[selectElement.selectedIndex];
    }

    /**
     * Will set a value in the html element identified by elementId.
     * @param document Html document.
     * @param elementId Id of the html element that will be modified.
     * @param value Value that will be set in the html element.
     */
    public setElementValueById(document, elementId, value) {
        document.getElementById(elementId).value = value;
    }
}