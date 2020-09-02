import {
	LightningElement,
	track,
	api
} from "lwc";
import {
	NavigationMixin
} from "lightning/navigation";
import doInitDocumentInformation from "@salesforce/apex/DocumentUploadModalController.doInitDocumentInformation";
import deleteContentDocument from "@salesforce/apex/DocumentUploadModalController.deleteContentDocument";
import addNewDocument from "@salesforce/apex/DocumentUploadModalController.addNewDocument";
import saveDocumentInformation from "@salesforce/apex/DocumentUploadModalController.saveDocumentInformation";
import getDocumentDownloadableURL from "@salesforce/apex/DocumentUploadModalController.getContentDistributionForFile";
import deleteDocumentCategory from "@salesforce/apex/DocumentUploadModalController.deleteDocumentCategory";
import {
	showAjaxErrorMessage,
	showSuccessMessage,
	showErrorMessage
} from "c/util";

export default class DocumentUploadModal extends NavigationMixin(LightningElement) {
	@api recordId;

	@track columnConfiguration = [];
	@track documents = [];
	@track retainValues = false;
	@track showSpinner = false;
	@track docId;
	@track fileId;
	@track isFileDelete;
	@track showDeleteConfirm = false;

	loadColumns() {
		this.columnConfiguration.push({
			sortable: false,
			heading: "",
			fieldApiName: "",
			style: "width:32px"
		});
		this.columnConfiguration.push({
			sortable: false,
			heading: "Document Name",
			fieldApiName: "Name"
		});
		this.columnConfiguration.push({
			sortable: false,
			heading: "Upload Document",
			fieldApiName: 'UploadDocument'
		});
		this.columnConfiguration.push({
			sortable: false,
			heading: "Uploaded Document",
			fieldApiName: "ContentDocumentLinks"
		});
	}

	@api
	get haveDocuments() {
		return (
			this.documents &&
			this.documents.length > 0
		);
	}

	connectedCallback() {
		this.loadColumns();
		this.doInit();
	}

	doInit() {
		this.showSpinner = true;
		doInitDocumentInformation({ recordId: this.recordId })
		.then((result) => {

			if( this.retainValues && result && this.documents ) {

				let length = this.documents.length < result.length ? this.documents.length : result.length;

				for (let i = 0; i < length; i++) {
					result[i].Name = this.documents[i].Name;
				}
			}
			this.documents = result;
		})
		.catch((error) => {
			console.log(JSON.stringify(error));
			showAjaxErrorMessage(this, error);
		})
		.finally(() => setTimeout(() => (this.showSpinner = false), 0));
	}

	handleUploadFinished(event) {
		this.retainValues = true;
		this.doInit();
	}

	confirmDeleteFile(event) {
		this.isFileDelete = event.target.dataset.type === "file";
		this.fileId = event.target.dataset.fileid;
		this.docId = event.target.dataset.docid;
		this.showDeleteConfirm = true;
	}

	handleDeleteCancel() {
		this.fileId = undefined;
		this.docId = undefined;
		this.showDeleteConfirm = false;
	}

	deleteFile(event) {
	    if (this.fileId) {
	        this.showSpinner = true;
	        //this.showDeleteConfirm = false;
	        deleteContentDocument({
	                fileId: this.fileId
			})
			.then((response) => {
				this.retainValues = true;
				this.doInit();
			})
			.catch((error) => {
				console.log(JSON.stringify(error));
				showAjaxErrorMessage(this, error);
			})
			.finally(() => {
				this.showSpinner = false;
				this.showDeleteConfirm = false;
			});
	    }
	}

	deleteDocumentCategory() {
		if(this.docId) {
			this.showSpinner = true;
			//this.showDeleteConfirm = false;
			deleteDocumentCategory({
				docId: this.docId
			})
			.then((response) => {
				this.documents = this.documents.filter(
					(item) => item.Id != this.docId
				);
				this.retainValues = true;
				this.doInit();
			})
			.catch((error) => {
				console.log(JSON.stringify(error));
				showAjaxErrorMessage(this, error);
			})
			.finally(() => {
				this.showSpinner = false;
				this.showDeleteConfirm = false;
			});
		}
	}

	handleInputChange(event) {
		let docId = event.target.dataset.docid;
		let document = this.documents.find((document) => document.Id == docId);
		
		if (event.target.name == "Name") {
			document.Name = event.target.value;
		} 
	}

	handleSave() {
		if (this.documents && this.documents.length > 0) {
			let valid = false;
			valid = [...this.template.querySelectorAll("lightning-input")].reduce((validSoFar, input) => {
				input.reportValidity();
				return validSoFar && input.checkValidity();
			}, true);

			if ( this.documents.some( (doc) => !doc.ContentDocumentLinks ) ) {
				showErrorMessage( this, "Please provide the documents for all the categories" );
				valid = false;
			}

			if (!valid) {
				return;
			}
		}

		let dataObj = [];
		this.documents.forEach((document) => {
			dataObj.push({
				sObjectType: "DocumentWrapper__c",
				Id: document.Id,
				Name: document.Name
			});
		});

		this.showSpinner = true;
		saveDocumentInformation({
			documentsJSON: JSON.stringify(dataObj),
			recordId: this.recordId
		})
		.then((response) => {
			this.doInit();
			showSuccessMessage(this, "Document Information Saved.");
		})
		.catch((error) => {
			console.log(JSON.stringify(error));
			showAjaxErrorMessage(this, error);
		})
		.finally(() => {
			this.showSpinner = false;
			this.closeDocumentModal();
		});
	}

	closeDocumentModal(event) {
		this.dispatchEvent(new CustomEvent("close"));
	}

	handlePreviewFile(event) {
		this.showSpinner = true;
		getDocumentDownloadableURL({
			contentDocumentId: event.target.dataset.fileid
		})
		.then((response) => {
			window.location.href = response.ContentDownloadUrl;
		})
		.catch((error) => {
			showAjaxErrorMessage(this, error);
			console.log(JSON.stringify(error));
		})
		.finally(() => (this.showSpinner = false));
	}

	handleAddRow() {
		this.showSpinner = true;
		addNewDocument({
			recordId: this.recordId
		})
		.then((data) => {
			this.retainValues = true;
			this.doInit();
		})
		.catch((error) => {
			console.error("addNewDocument error: ", JSON.stringify(error));
			showAjaxErrorMessage(this, error);
		})
		.finally(() => {
			this.showSpinner = false;
		});
	}
}