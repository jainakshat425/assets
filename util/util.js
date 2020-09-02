import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/**
 * Reduces one or more LDS errors into a string[] of error messages.
 * @param {FetchResponse|FetchResponse[]} errors
 * @return {String[]} Error messages
 */
export function reduceErrors(errors) {
    if (!Array.isArray(errors)) {
        errors = [errors];
    }

    return (
        errors
            // Remove null/undefined items
            .filter(error => !!error)
            // Extract an error message
            .map(error => {
                // UI API read errors
                if (Array.isArray(error.body)) {
                    return error.body.map(e => e.message);
                }
                // UI API DML, Apex and network errors
                else if (error.body && typeof error.body.message === 'string') {
                    return error.body.message;
                }
                // JS errors
                else if (typeof error.message === 'string') {
                    return error.message;
                }
                // Unknown error shape so try HTTP status text
                return error.statusText;
            })
            // Flatten
            .reduce((prev, curr) => prev.concat(curr), []) 
            // Remove empty strings
            .filter(message => !!message)
    );

    
}

/**
 * Display a success toast message
 * @param {LightningElement} component component displaying the message
 * @param {String} message message string
 */
export function showSuccessMessage(component, message) {
    showMessage(component, { title: "Success", message: message, messageType: 'success', mode: 'dismissable' });
}

/**
 * Display an info toast message
 * @param {LightningElement} component component displaying the message
 * @param {String} message message string
 */
export function showInfoMessage(component, message) {
    showMessage(component, { title: "Info", message: message, messageType: 'info', mode: 'dismissable' });
}

/**
 * Display a Warning toast message
 * @param {LightningElement} component component displaying the message
 * @param {String} message message string
 */
export function showWarningMessage(component, message) {
    showMessage(component, { title: "Warning", message: message, messageType: 'warning', mode: 'pester' });
}

/**
 * Display an error toast message
 * @param {LightningElement} component component displaying the message
 * @param {String} message message string
 */
export function showErrorMessage(component, message) {
    showMessage(component, { title: "Error", message: message, messageType: 'error', mode: 'pester' });
}

/**
 * Display an ajax type error message. takes in generic Exception object as input
 * @param {LightningElement} component component displaying the message
 * @param {Error} message message string
 */
export function showAjaxErrorMessage(component, error) {
    showMessage(component, {
        title: "Error",
        message: (error)?((error.message)?error.message:((error.body)?((error.body.message)?error.body.message:JSON.stringify(error)):JSON.stringify(error))):"Something went wrong!",
        messageType: 'error',
        mode: 'pester'
    });
}

/**
 * Display a toast message
 * 
 * @param {*} component firing component
 * @param {*} params message display options
 */
export function showMessage(component, { title, message, messageType, mode }) {

    component.dispatchEvent(new ShowToastEvent({
        mode,
        title,
        message,
        variant: messageType,
    }));
}