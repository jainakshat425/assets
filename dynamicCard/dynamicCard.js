/**
 * @author Akshat Jain
 * @email akshat.jain@mtxb2b.com
 * @desc This components allows UI CRUD operations on card.
 */
import { LightningElement, track, api } from 'lwc';

export default class DynamicCard extends LightningElement {

    @api heading = 'Records';
    @api subHeading = 'Please add record details below';
    @api addButtonLabel = 'ADD RECORD';
    @api cardHeader = 'Record';

    @track
    currentRecord;
    @track
    records = [];

    handleClick(event) {
        const key = event.target.dataset.key;
        let rec;

        switch (event.currentTarget.name) {

            case 'addCard':
                if( this.currentRecord ) {
                    this.currentRecord.isEdit = false;
                    this.currentRecord.isSaved = true;
                }
                // TODO: Modify/Add/Remove Field_1__c, Field__2__c according to schema
                rec = {
                    Field_1__c: '',
                    Field_2__c: '',
                    Field_3__c: '',
                    Field_4__c: '',
                    key: this.generateKey(6),
                    isEdit: true, 
                    isSaved: false
                };
                this.currentRecord = rec;
                this.records.push( rec );
                break;

            case 'saveCard':
                rec = this.records.find(item => item.key === key);
                rec.isEdit = false;
                rec.isSaved = true;
                this.currentRecord = null;
                break;

            case 'deleteCard':
                let index = this.records.findIndex(item => item.key === key);
                this.records.splice(index, 1);

                if( this.currentRecord.key === key ) {
                    this.currentRecord = null;
                }
                break;

            case 'editCard':
                this.records.forEach(item => {
                    if( item.key === key ) {
                        item.isEdit = true;
                        this.currentRecord = item;
                    } else {
                        item.isEdit = false;
                    }
                });
                break;

            default:
                break;
        }
    }

    handleCloseEditModal(event) {
        const key = event.currentTarget.dataset.key;

        let rec = this.records.find(item => item.key === key);
        let index = this.records.findIndex(item => item.key === key);

        if (rec.isSaved) {
            rec.isEdit = false;
        } else {
            this.records.splice(index, 1);
        }
        this.currentRecord = null;
    }

    generateKey(length) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    handleChange( event ) {
        this.currentRecord[event.target.name] = event.target.value;
    }
}