import { LightningElement, api, track, wire } from 'lwc';
import updateRecord from '@salesforce/apex/Leads.updateRecord';
import updateWholeRecord from '@salesforce/apex/Leads.updateWholeRecord';
import getAccountData from '@salesforce/apex/Leads.getAccountRecords';
import getLeadData from '@salesforce/apex/Leads.getLeadRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class MarkLeadInterested extends NavigationMixin (LightningElement) {

    @track duedateTemplate = true;
    @track meetingTemplate = false;




    @track BTFvalue='';
    @track PTvalue='';
    @track Lvalue='';
    @track CAvalue='';
    @track MLvalue = '';
    @track DDvalue;
    @track ICOvalue = '';
    @track EDvalue;
    @track SDvalue;


    @api recordId = '';

    get buyongtimeframeoptions() {
        return [
            { label: 'Immediate', value: 'Immediate' },
            { label: 'Within 3 months', value: 'Within 3 months' },
            { label: 'Within 6 months', value: 'Within 6 months' },
            { label: 'More than 6 months', value: 'More than 6 months' },
        ];
    }

    get propertytypeoptions() {
        return [
            { label: 'House', value: 'House' },
            { label: 'Apartment', value: 'Apartment' },
            { label: 'Condo', value: 'Condo' },
            { label: 'Other', value: 'Other' },
        ];
    }

    get locationoptions() {
        return [
            { label: 'Downtown', value: 'Downtown' },
            { label: 'Suburb', value: 'Suburb' },
            { label: 'Countryside', value:  'Countryside' },
            { label: 'Other', value: 'Other' },
        ];
    }

    get callactionoptions() {
        return [
            { label: 'Call immediately', value: 'Call immediately' },
            { label: 'Call within 24 hours', value: 'Call within 24 hours' },
            { label: 'Call within 48 hours', value: 'Call within 48 hours' },
            { label: 'Meeting', value: 'Meeting' },
        ];
    }

    get meetinglocationoptions() {
        return [
            { label: 'Office', value: 'Office' },
            { label: 'Coffee Shop', value: 'Coffee Shop' },
            { label: 'Client location', value: 'Client location' },
            { label: 'Other', value: 'Other' },
        ];
    }

    get icofficeoptions() {
        return [
            { label: 'IC Office 1', value: 'IC Office 1' },
            { label: 'IC Office 2', value: 'IC Office 2' },
            { label: 'IC Office 3', value: 'IC Office 3' },
            { label: 'Other', value: 'Other' },
        ];
    }

    handleChangeBTF(event) {
        this.BTFvalue = event.detail.value;
    }

    handleChangePT(event) {
        this.PTvalue = event.detail.value;
    }

    handleChangeL(event) {
        this.Lvalue = event.detail.value;
    }

    handleChangeCA(event) {
        this.CAvalue = event.detail.value;

        if (this.CAvalue == 'Meeting') {
            this.duedateTemplate = false;
            this.meetingTemplate = true;
        } else {
            this.duedateTemplate = true;
            this.meetingTemplate = false;
        }
    }

    handleChangeML(event) {
        this.MLvalue = event.detail.value;
    }

    handleChangeDD(event) {
        this.DDvalue = event.target.value;
    }

    handleChangeICO(event) {
        this.ICOvalue = event.target.value;
    }
    handleChangeSD(event) {
        this.SDvalue = event.target.value;
    }

    handleChangeED(event) {
         this.EDvalue = event.target.value;
    }







    handleClickMoveToProspect(event) {
        updateRecord({ leadId: this.recordId, BuyingTimeFrame: this.BTFvalue, PropertyType: this.PTvalue, Location: this.Lvalue, CallAction: this.CAvalue, Duedate: this.DDvalue })
            .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Success",
                    message: "Lead updated successfully",
                    variant: "success"
                }));
            })
            .catch((error) => {
             
            });
        
        
        // ----------------------------------------------------------------------------------------c/createLead


        updateWholeRecord({ leadId: this.recordId, BuyingTimeFrame: this.BTFvalue, PropertyType: this.PTvalue, Location: this.Lvalue, CallAction: this.CAvalue, MeetingLocation: this.MLvalue, Icoffice: this.ICOvalue, Startdate: this.SDvalue, Enddate: this.EDvalue })
            .then((result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Success",
                    message: "Lead updated successfully",
                    variant: "success"
                }));
                this.Clearfields();
            })
            .catch((error) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Error",
                    message: error.body.message,
                    variant: "error"
                }));
            });
    
    
        //----------------------------------------------------------------------------------------------c/createLead
        
        
        this[NavigationMixin.Navigate]({
          type: "standard__objectPage",
          attributes: {
            actionName: "home",
            objectApiName: "Account"
          }
        });
       

    }

    handleClickCancel() {
       this.Clearfields()
    }



     Clearfields(){
     this.BTFvalue='';
     this.PTvalue='';
     this.Lvalue='';
     this.CAvalue='';
     this.MLvalue='';  
     this.DDvalue = '';
     this.ICOvalue = '';
     this.EDvalue ='';
     this.SDvalue='';
        }


    
    
    
    @track showworsttemp = true;
    @track StoreACCData = [];
    @track StorLeadData = [];
    @track matchedData = []; // Store matched account data here.

    @wire(getAccountData)
    wiredAccountData({ error, data }) {
        if (data) {
            this.StoreACCData = data;
            this.compareNames(); // Call the comparison function after getting data.
        } else if (error) {
            this.StoreACCData = error;
        }
    }

    getleaddata() {
        getLeadData({ LeadId: this.recordId })
            .then((result) => {
                this.StorLeadData = result;
                this.compareNames(); // Call the comparison function after getting data.
            })
            .catch((error) => {
                this.StorLeadData = error;
            });
    }

    compareNames() {
        this.matchedData = []; // Reset the matched data.

        if (this.StoreACCData && this.StorLeadData) {
            const leadName = this.StorLeadData.Name;

            this.StoreACCData.forEach(account => {
                if (account.Name === leadName) {
                    this.matchedData.push(account);
                }
            });
        }
    }
    

    
}
