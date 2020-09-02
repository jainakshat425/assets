/**
 * @author Akshat Jain
 * @email akshat.jain@mtxb2b.com
 * @desc This component shows due diligence of a particular application/work order
 */
import {
    LightningElement,
    track,
    api
} from 'lwc';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import getDueDiligenceRecords from '@salesforce/apex/DueDiligenceController.getDueDiligenceRecords';
import updateDueDiligenceRecords from '@salesforce/apex/DueDiligenceController.updateDueDiligenceRecords';
import fetchPicklist from '@salesforce/apex/PicklistUtility.fetchPicklist';
import {
    showAjaxErrorMessage
} from 'c/util';
import { showSuccessMessage } from 'util/util';


export default class DueDilligence extends LightningElement {
    @api container;
    @api recordId;

    @track data = [];
    @track urlValue;
    @track openVModal = false;
    @track showEdit = true;
    @track showNotes = false;
    @track dataMapToUpdate = new Map();
    @track isTableEmpty = false;

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc This method Cancel click
     */
    handleCancelClick() {
        this.showEdit = true;
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc This method handles edit click
     */
    handleEditClick() {
        this.showEdit = false;
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc This method handles save of due diligence to database
     */
    handleSaveClick(event) {
        this.showEdit = true;
        updateDueDiligenceRecords({
                jsonMap: JSON.stringify(this.data)
            })
            .then(result => {
                showSuccessMessage( this, 'Status Updated' );
               
                this.refreshTableData();
            })
            .catch(error => {
                console.log("error occured>> " + JSON.stringify(error));
                showAjaxErrorMessage(this, error);
            });
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc This method handles due diligence status change
     */
    handleChange(event) {
        var indexClicked = event.currentTarget.getAttribute("data-index");
        if (event.target.name == 'status') {
            this.data[indexClicked].status = event.detail.value;
        } else if (event.target.name == 'notes') {
            this.data[indexClicked].notes = event.target.value;
        }
    }

    connectedCallback() {
        // TODO: Show/hide fields according to Container type
        if (this.container == 'Inspection') {
            this.showNotes = true;
        }

        fetchPicklist({
            objectName: 'Due_Diligence__c',
            fieldName: 'Status__c'
        })
        .then(result => {
            this.statusOptions = result;
        })
        .catch(error => {
            console.log('errorrr picklist>' + JSON.stringify(error));
            showAjaxErrorMessage(this, error);
        });
        this.loadColumns();
        this.refreshTableData();
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc This method loads columns
     */
    loadColumns() {
        this.columnConfiguration = [];

        this.columnConfiguration.push({
            heading: 'DUE DILLIGENCE',
            fieldApiName: 'Due_Diligence_Name__c"',
            style: 'width:40%;'
        });
        this.columnConfiguration.push({
            heading: 'RESPONSIBLE PARTY',
            fieldApiName: 'Responsible_Party__c',
            style: 'width:15%;'
        });
        this.columnConfiguration.push({
            heading: 'STATUS',
            fieldApiName: 'Status__c',
            style: 'width:15%;'
        });
        if (this.showNotes) {
            this.columnConfiguration.push({
                heading: 'NOTES',
                fieldApiName: 'Notes__c',
                style: 'width:15%;'
            });
        }
        this.columnConfiguration.push({
            heading: 'COMPLETED DATE',
            fieldApiName: 'Completed_Date__c',
            style: 'width:15%;'
        });
        this.columnConfiguration.push({
            heading: 'COMPLETED BY',
            fieldApiName: 'LastModifiedBy.Name',
            style: 'width:15%;'
        });
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc This method refresh data
     */
    refreshTableData() {
        console.log('refreshTableDataCalled>>' + this.recordId);
        this.data = [];
        getDueDiligenceRecords({
                idField: this.recordId
            })
            .then(result => {
                this.data = result;
                let i;
                for (i = 0; i < result.length; i++) {
                    if (this.data[i].status == 'Assigned' || this.data[i].status == 'In Progress' || this.data[i].status == '' || this.data[i].status == null) {
                        this.data[i].lastModifiedByName = '';
                    }
                }
                console.log('data' + JSON.stringify(this.data));
                this.isTableEmpty = result.length === 0 ? true : false;
            })
            .catch(error => {
                console.log("error occured>> " + JSON.stringify(error));
                showAjaxErrorMessage(this, error);
            });
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc This method opens reference link if avaialble to new tab
     */
    handleOpenReferenceLink(event) {
        this.urlValue = event.currentTarget.getAttribute('data-url');
        window.open(this.urlValue, '_blank');
    }
}