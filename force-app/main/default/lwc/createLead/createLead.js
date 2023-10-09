import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createLeadRecord from '@salesforce/apex/Leads.CreateLeads';

export default class CreateLead extends LightningElement {
    @track firstname = '';
    @track lastname = '';
    @track mobile = '';
    @track email = '';
    @track category = '';
    @track leadsource = '';
    @track mediatype = '';

    get categoryOptions() {
        return [
            { label: 'New Business', value: 'New Business' },
            { label: 'Existing Customer', value: 'Existing Customer' },
            { label: 'Partner Referral', value: 'Partner Referral' },
            { label: 'Marketing Campaign', value: 'Marketing Campaign' },
            { label: 'Employee Referral', value: 'Employee Referral' },
            { label: 'Other', value: 'Other' },
        ];
    }

    get leadsourceOptions() {
        return [
            { label: 'Web', value: 'Web' },
            { label: 'Phone Inquiry', value: 'Phone Inquiry' },
            { label: 'Partner Referral', value: 'Partner Referral' },
            { label: 'Finished', value: 'Finished' },
            { label: 'Purchased List', value: 'Purchased List' },
            { label: 'Other', value: 'Other' },
        ];
    }

    get mediatypeOptions() {
        return [
            { label: 'Email', value: 'Email' },
            { label: 'Phone Call', value: 'Phone Call' },
            { label: 'Social Media', value: 'Social Media' },
            { label: 'Website', value: 'Website' },
            { label: 'Online Advertisement', value: 'Online Advertisement' },
            { label: 'Television', value: 'Television' },
            { label: 'Event Sponsorship', value: 'Event Sponsorship' },
            { label: 'Other', value: 'Other' },
        ];
    }

    onInputChange(event) {
        const fieldName = event.target.name;
        const value = event.target.value;
        this[fieldName] = value;
    }

    handleCreateLeadButton() {
        createLeadRecord({
            FirstName: this.firstname,
            LastName: this.lastname,
            Mobile: this.mobile,
            Email: this.email,
            Category: this.category,
            LeadSource: this.leadsource,
            MediaType: this.mediatype
        })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Record Created",
                    message: "Record Created Successfully",
                    variant: "success"
                }));
                this.clearFields();
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Error In Record Creation",
                    message: "Error Occurred While Record Creation: " + error.body.message,
                    variant: "error"
                }));
            });
    }

    clearFields() {
        this.firstname = '';
        this.lastname = '';
        this.mobile = '';
        this.email = '';
        this.category = '';
        this.leadsource = '';
        this.mediatype = '';
    }
}
