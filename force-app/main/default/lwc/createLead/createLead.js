import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CreateLeadRecord from '@salesforce/apex/Leads.CreateLeads';
import SearchLeadsRecord from '@salesforce/apex/Leads.SearchLeadsInData';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

export default class CreateLead extends NavigationMixin(LightningElement) {

    @track CreateRecordTemplate = false;
    @track ShowDetaisOfCreatedRecords = true;
    @track FilterScreenThree = false;



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


    // record Create btn
  async  handleCreateLeadButton() {
    await  CreateLeadRecord({FirstName: this.firstname , LastName: this.lastname, Mobile: this.mobile, Email: this.email, Category: this.category, LeadSource: this.leadsource, MediaType: this.mediatype})
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

    // record cancle btn
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


    // Screen two Started--------------------------------------------------------------------------------

    connectedCallback(){
        this.OnSearchInLeadData();
        this.showsearchbar = true;
    }


    @track searchbarvalue = '';
    @track StoreSearchedLeadData = [];
    @track CheckboxValue;

    @track oncheckedNewBusiness;
    @track oncheckedExistingCustomer;
    @track oncheckedPartnerReferral;


     OnSearchBarValueChange(event){
         this.searchbarvalue = event.target.value;
         this.OnSearchInLeadData();     
     }
    
    
     OnSearchInLeadData(){
          SearchLeadsRecord({ searchinit:this.searchbarvalue })
                .then((result) => {
                    this.StoreSearchedLeadData = result;
                }).catch((error) => {
                    this.StoreSearchedLeadData = error;
                });
        }
        
    
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
    
    
    
    
    
    
    
    
    
    
    oncheckboxchange(event) {
        this.CheckboxValue = event.target.value;
     }
    
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


    // third filter page stated here-----------------------------------------------------------


    onClickOfCloseIcon() {
        this.FilterScreenThree = false;
        this.ShowDetaisOfCreatedRecords = true;
    }
   

    onClickResetButton() {
     this.oncheckedNewBusiness = false;
     this.oncheckedExistingCustomer = false;
     this.oncheckedPartnerReferral = false;
    }



    @track storebusinessvalue = '';
   
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


    
    //  fourth screen started here ------------------------------------------------------------









  

  




}

