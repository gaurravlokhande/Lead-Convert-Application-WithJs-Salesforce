import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CreateLeadRecord from '@salesforce/apex/Leads.CreateLeads';
import SearchLeadsRecord from '@salesforce/apex/Leads.SearchLeadsInData';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

export default class CreateLead extends NavigationMixin(LightningElement) {

    connectedCallback(){
        this.OnSearchInLeadData();
        this.showsearchbar = true;
    }


    // templates
    @track CreateRecordTemplate = false;
    @track ShowDetaisOfCreatedRecords = true;
    @track FilterScreenThree = false;

    @track dockedfrombottom = false;
    @track isCallNotPickedModalOpen = false;
    

    // for S1
    @track firstname = '';
    @track lastname = '';
    @track mobile = '';
    @track email = '';
    @track category = '';
    @track leadsource = '';
    @track mediatype = '';
    @track StatusValue = '';

    // For S2
    @track StoreSearchedLeadData = [];
    @track searchbarvalue = '';
    @track CheckboxValue;
    @track RadiosortValue;

    // For S3
    @track oncheckedNewBusiness;
    @track oncheckedExistingCustomer;
    @track oncheckedPartnerReferral;
    @track storebusinessvalue = '';





    // Screen 1 Field Options
    get StatusOptions() {
         return [
             { label: 'Online', value: 'Online' },
             { label: 'SMS', value: 'SMS' },
             { label: 'Printer', value: 'Printer' },
        ];
    }
    
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
    get LeadsourceOptions() {
        return [
            { label: 'Web', value: 'Web' },
            { label: 'Phone Inquiry', value: 'Phone Inquiry' },
            { label: 'Partner Referral', value: 'Partner Referral' },
            { label: 'Finished', value: 'Finished' },
            { label: 'Purchased List', value: 'Purchased List' },
            { label: 'Other', value: 'Other' },
        ];
    }
    get MediatypeOptions() {
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
    
    // Screen 2 Sort Radio Options
     get radioSortOptions() {
        return [
            { label: 'Newest to Oldest', value: 'Newest to Oldest' },
            { label: 'Oldest to Newest', value: 'Oldest to Newest' },
            { label: 'Property Type', value: 'Property Type' },
            { label: 'Lead Status', value: 'Lead Status' },
            { label: 'Project Name', value: 'Project Name' },
            { label: 'Location', value: 'Location' },
             { label: 'Media Type', value: 'Media Type' },
            
        ];
    }
      


    // Screen 1 Create Record Method
    async  CreateLeadRecordFunction() {
      await CreateLeadRecord({FirstName: this.firstname , LastName: this.lastname, Mobile: this.mobile, Email: this.email, Category: this.category, LeadSource: this.leadsource, MediaType: this.mediatype, status:this.StatusValue})
            .then((result) => {
            this.dispatchEvent(new ShowToastEvent({
                title: "Record Created",
                message: result,
                variant: "success"
            }));
                this.CancleRecordCreation();
                this.CreateRecordTemplate = false;
                this.ShowDetaisOfCreatedRecords = true;
                this.OnSearchInLeadData();
                return refreshApex(this.StoreSearchedLeadData); 
               
                
            }).catch((error) => {
            this.dispatchEvent(new ShowToastEvent({
                title: "Error In record Creation",
                message: error.body.message,
                variant: "error"
            }));
        });
    }

    // Screen 2 Search method
    OnSearchInLeadData(){
          SearchLeadsRecord({ searchinit:this.searchbarvalue })
                .then((result) => {
                    this.StoreSearchedLeadData = result;
                }).catch((error) => {
                    this.StoreSearchedLeadData = error;
                });
        }
        

    // Record Page Navigation Screen 2 
      onclickFirstAndLastName(event) {

        const recordId = event.currentTarget.dataset.id;

        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                actionName: "view",
                recordId: recordId,
                objectApiName: "Lead"
            }
        });
        
    }


    
    
    //Screen 1 Fields
    onFirstName(event) {
        this.firstname = event.target.value;
    }
    
    onLastName(event) {
        this.lastname = event.target.value;
    }

    onMobile(event) {
        this.mobile = event.target.value;
    }
    
    onEmail(event) {
        this.email = event.target.value;
    }

    onCategory(event) {
        this.category = event.target.value;
    }

    onLeadsource(event) {
        this.leadsource = event.target.value;
    }

    onMediatype(event) {
        this.mediatype = event.target.value;
    }

    onStatuschange(event) {
        this.StatusValue = event.target.value;
    }

    //Screen 2 Fields
    OnSearchBarValueChange(event){
         this.searchbarvalue = event.target.value;
         this.OnSearchInLeadData();     
    }
    
    //Screen 3 Fields
    oncheckboxchange(event) {
        this.CheckboxValue = event.target.value;
    }



    //Screen 1 Buttons
    handleCreateLeadButton() {
        this.CreateLeadRecordFunction();
    }

    handleCancleButton() {
      this.CancleRecordCreation();
    }

    CancleRecordCreation() {
         this.firstname = '';
         this.lastname = '';
         this.mobile = '';
         this.email = '';
         this.category = '';
         this.leadsource = '';
         this.mediatype = '';
    }

     //Screen 2 Buttons
    onSelectAllButton() {
               
    }
       
    onNewSuspectButton() {
         this.ShowDetaisOfCreatedRecords = false;
         this.CreateRecordTemplate = true;
    }
    
    onClickOfFilterIcon() {
        this.FilterScreenThree = true;
        this.ShowDetaisOfCreatedRecords = false;
    }

    onclickofSortFromBottom() {
        this.dockedfrombottom = true;
    }

    onSelectRadioSortbyValue(event) {
        this.RadiosortValue = event.target.value;

        this.dockedfrombottom = false;
        this.ShowDetaisOfCreatedRecords = true;

        if (this.RadiosortValue === 'Lead Status') {
            this.searchbarvalue = 'Existing Customer';
            this.OnSearchInLeadData(); 
        }
    }

    onclickOfCallIcon() {
        this.isCallNotPickedModalOpen = true;
    }

    onClickCloseCallNotPicked() {
        this.isCallNotPickedModalOpen = false;
    }

    // Screen 3 Buttons
    onClickOfCloseIcon() {
        this.FilterScreenThree = false;
        this.ShowDetaisOfCreatedRecords = true;
    }
   
    onClickResetButton() {
     this.oncheckedNewBusiness = false;
     this.oncheckedExistingCustomer = false;
     this.oncheckedPartnerReferral = false;
    }

    oncheckedNewBusiness() {
        this.storebusinessvalue = true;
    }
   
    onClickFilterButton() {
    this.FilterScreenThree = false;
    this.ShowDetaisOfCreatedRecords = true;

    if (this.storebusinessvalue != null) {
        this.searchbarvalue = 'New Business';
        this.OnSearchInLeadData(); 
        }
    }
  

  

}

