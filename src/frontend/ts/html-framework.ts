enum DeviceType {
    Iluminacion = 0,
    Abertura = 1
}

enum StateType {
    OnOff = 0,
    Range = 1
}

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
        this.addCell(this.generateStateCellHtml(device), tr);

        // adding cell for state
        this.addCell(DeviceType[device.type], tr);

        // adding cell for actions, inserting icons for delete and edit
        this.addCellWithActionsButtons(deviceId, tr.insertCell());

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
     * Will edit the cell's html with content defined by innerHtml.
     * @param innerHtml the cells content.
     * @param cell the Html cell that will contain the new content.
     */
    public editCell(innerHtml: any, cell: HTMLTableCellElement) {
        cell.innerHTML = innerHtml;
    }

    public generateStateCellHtml(device) {
        let stateContent;
        if (device.state == 0) {
            stateContent = "<div class=\"switch\"> <label> Off <input disabled type=\"checkbox\"> <span class=\"lever\"></span>On </label> </div>"
        } else if (device.state == 1) {
            stateContent = "<div class=\"switch\"> <label> Off <input disabled type=\"checkbox\" checked> <span class=\"lever\"></span>On </label> </div>"
        } else {
            let stateValue = device.state / 100;

            if (device.state == 0) {
                stateContent = "<p class=\"range-field\"><input disabled class=\"range\" type=\"range\" style=\"width:50%\" min=\"0\" max=\"1\" step =\"0.10\" value=\"" + stateValue + "\"/></p>"
            } else {
                stateContent = "<input disabled class=\"input-field range\" style=\"width:50%\" type=\"range\" min=\"0\" max=\"1\" step =\"0.10\" value=\"" + stateValue + "\" />"
            }
        }
        return stateContent;
    }

    /**
     * Will add a cell with two buttons to an Html Table row.
     * One of the buttons will trigger a modal to edit the related device.
     * The other button will delete the element from the table and the database.
     * @param deviceId Device id that will be used to form the element id.
     * @param row HTML table row that will contain the new cell.
     */
    public addCellWithActionsButtons(deviceId: any, cell: HTMLTableCellElement) {
        // add edit button
        cell.innerHTML = "<button data-target=\"editDeviceModal\" class=\"btn modal-trigger\" id=\"edit-btn-" + deviceId + "\" onclick=\"myMain.loadEditModal(" + deviceId + ")\"><i class=\"material-icons\">edit</i></button>";

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
     * Will edit the element with the rowId from the parent table.
     * @param document Html document that contains all the elements.
     * @param rowId Id of the row that'll be deleted.
     */
    public editDeviceRow(document: any, device: Device) {
        const row: HTMLTableRowElement = document.getElementById(device.id);

        let table: HTMLTableElement = document.getElementById('devices-table');

        row.cells[0].innerHTML = device.name
        row.cells[1].innerHTML = device.description
        row.cells[2].innerHTML = this.generateStateCellHtml(device)
        row.cells[3].innerHTML = DeviceType[device.type]
        this.addCellWithActionsButtons(device.id, row.cells[4])
    }

    /**
     * Will add the appropriate element to represent the state of a device
     * based on the stateType selected.
     * @param document Html document.
     * @param selectedStateTypeId StateType selected from combo box. Indicates which kind of element will 
     *  better represent the device's state.
     */
    public chageModalDeviceState(document, parentId, inputId, selectedStateTypeId: number, value: any) {
        const selectElement = document.getElementById(parentId);

        let innertHtml = "<label for=\"" + inputId + "\">State</label>"

        if (selectedStateTypeId == 0) {
            innertHtml += "<div class=\"switch\"> <label> Off <input id=\"" + inputId + "\" type=\"checkbox\"";
            if (!value) {
                innertHtml += " value=\"" + value + "\"";
            }
            innertHtml += "> <span class=\"lever\"></span>On </label> </div>";
        } else {
            innertHtml += "<p class=\"range-field\"> <input id=\"" + inputId + "\" type=\"range\" min=\"0\" max=\"1\" step =\"0.10\" class=\"range\"";
            if (!value) {
                innertHtml += " value=\"" + value + "\"";
            }
            innertHtml += "> </p>";
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

    /**
     * Will select an option the html element identified by elementId.
     * @param document Html document.
     * @param selectId Id of the html element that will be modified.
     * @param optionIndex Index of the option that will be selected.
     */
    public selectOptionFromElementById(document: any, selectId, optionIndex) {
        let selectElement: HTMLSelectElement = document.getElementById(selectId);

        selectElement.options.selectedIndex = optionIndex;
        selectElement.options[optionIndex].focus;
    }

    /**
     * Will fill the html structure with
     * the device information.
     * @param document Html Document.
     * @param device that will be edited.
     */
    public drawEditModal(document: Document, device: Device) {
        let el = document.getElementById("edit-modal-content");

        let modal = "<h4>Edit Device</h4>"
        modal += "<input hidden id='edit-device-id' value=" + device.id + ">"
        modal += "<form id=\"edit-device\" class=\"col s12\">"
        modal += "    <div class=\"row\">"
        modal += "        <div class=\"col s3\">"
        modal += "            <label for=\"edit-device-name\">Name</label>"
        modal += "            <input id=\"edit-device-name\" type=\"text\" class=\"validate\" value=\"" + device.name + "\" >"
        modal += "        </div>"
        modal += "        <div class=\"col s4\">"
        modal += "            <label class=\"active\" for=\"edit-device-description\">Description</label>"
        modal += "            <input id=\"edit-device-description\" type=\"text\" class=\"validate\" value=\"" + device.description + "\" >"
        modal += "        </div>"
        modal += "        <div class=\"col s2\">"
        modal += "            <label for=\"edit-device-type\">Type</label>"
        modal += "            <select id=\"edit-device-type\">"
        if (device.type == 0) {
            modal += "                <option selected value=\"0\">Iluminación</option>"
            modal += "                <option value=\"1\">Abertura</option>"
        } else {
            modal += "                <option value=\"0\">Iluminación</option>"
            modal += "                <option selected value=\"1\">Abertura</option>"
        }
        modal += "            </select>"
        modal += "        </div>"
        modal += "        <div class=\"col s1\">"
        modal += "            <label>State Type</label>"
        modal += "            <select id=\"edit-device-state-type\""
        modal += "                onchange=\"myMain.changeDeviceState(this.options[this.selectedIndex].value, " + device.state + ")\">"
        if (device.state == 0 || device.state == 1) {
            modal += "                <option selected value=\"0\">On-Off</option>"
            modal += "                <option value=\"1\">Range</option>"
        } else {
            modal += "                <option value=\"0\">On-Off</option>"
            modal += "                <option selected value=\"1\">Range</option>"
        }
        modal += "            </select>"
        modal += "        </div>"
        modal += "        <div class=\"col s2\" id=\"edit-device-state-div\">"
        modal += "            <label for=\"edit-device-state\">State</label>"
        if (device.state == 0 || device.state == 1) {
            modal += "<div class=\"switch\"> <label> Off <input id=\"edit-device-state\" type=\"checkbox\" " + ((device.state == 1) ? "checked" : "") + "> <span class=\"lever\"></span>On </label> </div>";
        } else {
            modal += "<p class=\"range-field\"> <input id=\"edit-device-state\" type=\"range\" min=\"0\" max=\"1\" step =\"0.10\" class=\"range\" value=\"" + device.state / 100 + "\"> </p>";
        }
        modal += "        </div>"
        modal += "    </div>"
        modal += "</form>"

        el.innerHTML = modal
    }
}