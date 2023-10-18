import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CreateLeadRecord from '@salesforce/apex/Leads.CreateLeads';
import SearchLeadsRecord from '@salesforce/apex/Leads.SearchLeadsInData';
import insertCallNote from '@salesforce/apex/Leads.updateLeadsDescription';
import RejectReason from '@salesforce/apex/Leads.SelectRejectionReason';
import updateintrestedlead from '@salesforce/apex/Leads.MarkLeadAsIntrested';
import updateintrestedleadOverload from '@salesforce/apex/Leads.MarkLeadAsIntrestedtwo';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import wpicons from '@salesforce/resourceUrl/wpicon';
import uparrowicon from '@salesforce/resourceUrl/uparrowicon';

export default class CreateLead extends NavigationMixin(LightningElement) {

        @api recordId;





    connectedCallback(){
        this.OnSearchInLeadData();
        this.showsearchbar = true;
    }

    wpicon = wpicons;
    arrowicon = uparrowicon;


    // templates
    @track CreateRecordTemplate = false;
    @track ShowDetaisOfCreatedRecords = true;
    @track FilterScreenThree = false;
    @track ShowRecordsInColumn = false;
    @track ShowRejectReason = false;
    @track MarkLeadAsIntrestedTemplate = false;

    
    // S2 templates
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
    @track RadiosortValue;;
    @track CallNotes = '';
    @track StoreCallNote = '';
    @track CallId = '';

    // For S3
    @track NewBusinessCheckBox = false;
    @track ExistingCustomerCheckbox = false;
    @track Partnerreferralcheckbox = false;
    @track searchbarvalue = '';


    //S4
    @track RejectionCategory;
    @track RejectionReason;

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
    
     get RejectionCategoryOptions() {
        return [
            { label: 'Budget', value: 'Budget' },
            { label: 'Expired', value: 'Expired' },
        ];
     } 
    
     get RejectionReasonOptions() {
        return [
            { label: 'Low Budget', value: 'Low Budget' },
            { label: 'Expired', value: 'Expired' },
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
                this.refreshApexdata();
                this.OnSearchInLeadData();
                  
            }).catch((error) => {
            this.dispatchEvent(new ShowToastEvent({
                title: "Error In record Creation",
                message: error.body.message,
                variant: "error"
            }));
        });
    }


    refreshApexdata() {
       return refreshApex(this.StoreSearchedLeadData);  
    }


    // Screen 2 Search method
    OnSearchInLeadData(){
          SearchLeadsRecord({ searchinit:this.searchbarvalue })
                .then((result) => {
                    this.StoreSearchedLeadData = result;
                    this.refreshApexdata();
                }).catch((error) => {
                    this.StoreSearchedLeadData = error;
                });
    }
  
   

    oninsertCallNote(event) {

         this.CallId = event.currentTarget.dataset.Id

        insertCallNote({ leadId: CallId ,callNote: this.CallNotes })
        .then((result) => {
            this.StoreCallNote = result;
        }).catch((error) => {
            this.StoreCallNote = error;
        });
    }
   


//CallId
    async OnRejectReason() {
        await RejectReason({ LeadIdss: this.recordId, SelectCategory: this.RejectionCategory, RejectionReason: this.RejectionReason })
        .then((result) => {
           this.dispatchEvent(new ShowToastEvent({
               title: "reason Update Sucessfully",
               message: "message",
               variant: "success"
           }));
        }).catch((error) => {
           this.dispatchEvent(new ShowToastEvent({
               title: "reason Update failed",
               message: "message",
               variant: "error"
           }));
        });
    }


    @track storefirstnamelastnamevalue = '';


    // Record Page Navigation Screen 2 
      onclickFirstAndLastName(event) {

        this.storefirstnamelastnamevalue = event.target.value;


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
        this.email = event.target.value.toLowerCase();
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

    onChangeCallNotes(event) {
        this.CallNotes = event.targt.value;
        this.oninsertCallNote();
    }
    
    //Screen 3 Fields
    oncheckboxchange(event) {
        this.CheckboxValue = event.target.Checked;
    }


    // Screen 4 Fields
    onchangeRejectionCategory(event) {
        this.RejectionCategory = event.target.value;
    }

    onchangeRejectionReason(event) {
        this.RejectionReason = event.target.value;
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
        this.StatusValue = '';
    }

    //Screen 2 Buttons
    
    OnClickOfLeadId() {
        this.ShowRecordsInColumn = true;
        this.ShowDetaisOfCreatedRecords = false;
     }
    
    onSelectAllButton() {
        this.CheckboxValue = true;
    }
    ondblclickonSelectAllButton(){
         this.CheckboxValue = false;
    }
       
    onNewSuspectButton() {
        this.ShowDetaisOfCreatedRecords = false;
        this.CreateRecordTemplate = true;
        this.dockedfrombottom = false;
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

        if (this.RadiosortValue === 'Newest to Oldest') {
        this.searchbarvalue = 'Partner Referral'
            this.OnSearchInLeadData();
            this.RadiosortValue = null;
            this.searchbarvalue = null;
        }
      
    }

    onclickOfCallIcon() {
        this.isCallNotPickedModalOpen = true;
    }

    onClickCloseCallNotPicked() {
        this.isCallNotPickedModalOpen = false;
    }

    onSubmitCallNotes() {
        if (this.StoreCallNote.data) {
            this.dispatchEvent(new ShowToastEvent({
                title: "Feedback Submited Sucessfully",
                message: "message",
                variant: "success"
            }));

            this.isCallNotPickedModalOpen = false;
            this.ShowDetaisOfCreatedRecords = true;

        } else {
            this.dispatchEvent(new ShowToastEvent({
                title: "error happen while submitting record",
                message: "message",
                variant: "error"
            }));
        }
            

    }

    onClickOfNoteIcon() {
        this.ShowDetaisOfCreatedRecords = false;
        this.MarkLeadAsIntrestedTemplate = true;          
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

   
    handleCheckboxChange(event) {
        const checkboxName = event.target.label;
        const isChecked = event.target.checked;
        this.checkboxName = checkboxName;
        this.isChecked = isChecked;
    }

    onClickFilterButton() {
        this.FilterScreenThree = false;
        this.ShowDetaisOfCreatedRecords = true;

        if (this.checkboxName === 'New Business') {
            this.NewBusinessCheckBox = this.isChecked;
            this.searchbarvalue = 'New Business';
            this.OnSearchInLeadData();
            this.NewBusinessCheckBox = false;
            this.searchbarvalue = null;
        } else if (this.checkboxName === 'Existing Customer') {
            this.ExistingCustomerCheckbox = this.isChecked;
            this.searchbarvalue = 'Existing Customer';
            this.OnSearchInLeadData();
            this.searchbarvalue = null;
            this.ExistingCustomerCheckbox = false;
        } else if (this.checkboxName === 'Partner Referral') {
            this.Partnerreferralcheckbox = this.isChecked;
            this.searchbarvalue = 'Partner Referral';
            this.OnSearchInLeadData();
            this.Partnerreferralcheckbox = false;
            this.searchbarvalue = null;
        }
    }

    //Screen 4 Buttons
    onclickintrestedbtn() {
        this.ShowRecordsInColumn = false;
        this.ShowDetaisOfCreatedRecords = true;
    }

    onclickofrejectbtn() {
        this.ShowRejectReason = true;
    }

    handleUpdateReasonButton() {
        this.ShowRejectReason = false;
        this.OnRejectReason();
    }




    // Screen 5 buttons

    get Buyingtimeframeoptions() {
    return [
        { label: 'Immediate', value: 'immediate' },
        { label: 'Within 3 months', value: '3months' },
        { label: 'Within 6 months', value: '6months' },
        { label: 'More than 6 months', value: 'more6months' },
    ];
    }

    get Budgetoptions() {
    return [
        { label: 'Less than $50,000', value: '<50000' },
        { label: '$50,000 - $100,000', value: '50000-100000' },
        { label: '$100,000 - $200,000', value: '100000-200000' },
        { label: 'More than $200,000', value: '>200000' },
    ];
    }

    get PropertyTypeoptions() {
    return [
        { label: 'House', value: 'house' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Condo', value: 'condo' },
    ];
    }

    get Locationoptions() {
    return [
        { label: 'Downtown', value: 'downtown' },
        { label: 'Suburb', value: 'suburb' },
        { label: 'Countryside', value: 'countryside' },
    ];
    }

    get CallActionoptions() {
    return [
        { label: 'Call immediately', value: 'immediate' },
        { label: 'Call within 24 hours', value: '24hours' },
        { label: 'Call within 48 hours', value: '48hours' },
        { label: 'Meeting', value: 'Meeting' },
    ];
    }

    get MeetingLocationoptions() {
    return [
        { label: 'Office', value: 'office' },
        { label: 'Coffee Shop', value: 'coffee-shop' },
        { label: "Client's location", value: 'client-location' },
        { label: 'Other', value: 'other' },
    ];
    }

    get IcOfficeoptions() {
    return [
        { label: 'IC Office 1', value: 'office1' },
        { label: 'IC Office 2', value: 'office2' },
        { label: 'IC Office 3', value: 'office3' },
    ];
    }




    @track ShowDueDate = true;

    @track CallActionequalsMeeting = false;

    @track StoreBuyingtimeframevalue = '';
    @track StoreBudgetValue = '';
    @track StorePropertytypeValue = '';
    @track StoreLocationValue = '';
    @track StoreCallActionValue = '';
    @track StoreMeetingLocationValue = '';
    @track StoreIcOfficeValue = '';
    @track StoreDuedatevalue = '';
     @track startDate = '2020-09-12T18:13:41Z';
    @track endDate = '2020-09-12T18:13:41Z';


    handleChangeBuyingtimeframevalue(event) {
        this.StoreBuyingtimeframevalue = event.target.value;
    }

    handleChangeBudgetValue(event) {
      this.StoreBudgetValue = event.target.value;
    }

    handleChangePropertytypeValue(event) {
       this.StorePropertytypeValue = event.target.value;
    }

    handleChangeLocationValue(event) {
       this.StoreLocationValue = event.target.value;
    }

    handleChangeCallActionValue(event) {
        this.StoreCallActionValue = event.target.value;
        
        if (this.StoreCallActionValue === 'Meeting') {
            this.ShowDueDate = false;
            this.CallActionequalsMeeting = true;
        } else if (this.StoreCallActionValue !== 'Meeting') {
            this.CallActionequalsMeeting = false;
        }
    }

    handleChangeMeetingLocationValue(event){
       this.StoreMeetingLocationValue = event.target.value;
    }

    handleChangeIcOfficeValue(event) {
        this.StoreIcOfficeValue = event.target.value;
    }

    handleChangeOfDueDate(event) {
        this.StoreDuedatevalue = event.target.value;
    }
  
    handleStartDate(event) {
        this.startDate = event.target.value;
    }

    handleEndDate(event) {
           this.endDate = event.target.value;
    }


    // Method 1 To Update Lead
     IntrestedLeadMethod() {
       updateintrestedlead({
            LeadIdInput: this.recordId,
            BuyingTimeFrame: this.StoreBuyingtimeframevalue,
            Budget: this.StoreBudgetValue,
            PropertyType: this.StorePropertytypeValue,
            Location: this.StoreLocationValue,
            CallAction: this.StoreCallActionValue,
            MeetingLocation: this.StoreMeetingLocationValue,
            IcOffice: this.StoreIcOfficeValue,
            StartDate: this.startDate,
            EndDate: this.endDate,
        })
         .then((result) => {
             this.dispatchEvent(
                new ShowToastEvent({
                    title: "Lead Moved to Prospect",
                    message: "Lead was updated successfully.",
                    variant: "success"
                })
            );
         }).catch((error) => {
             this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error occurred",
                    message: "There was an error updating the lead.",
                    variant: "error"
                })
            );
         });
    }


    // Method 2 To Update Lead
     IntrestedLeadMethodTwo() {
      updateintrestedleadOverload({
            LeadIdInput: this.recordId,
            BuyingTimeFrame: this.StoreBuyingtimeframevalue,
            Budget: this.StoreBudgetValue,
            PropertyType: this.StorePropertytypeValue,
            Location: this.StoreLocationValue,
            CallAction: this.StoreCallActionValue,
            DueDAte: this.StoreDuedatevalue,
      })
         .then((result) => {
             this.dispatchEvent(
                new ShowToastEvent({
                    title: "Lead Moved to Prospect",
                    message: "Lead was updated successfully.",
                    variant: "success"
                })
            );
         }).catch((error) => {
             this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error occurred",
                    message: "There was an error updating the lead.",
                    variant: "error"
                })
            );
         });
         
    }


    handleMoveToPropspectLead() {
        this.IntrestedLeadMethod();
        this.IntrestedLeadMethodTwo();
    }s
    
    handleCancleLeadIntrested() {
    this.StoreBuyingtimeframevalue = '';
    this.StoreBudgetValue = '';
    this.StorePropertytypeValue = '';
    this.StoreLocationValue = '';
    this.StoreCallActionValue = '';
    this.StoreMeetingLocationValue = '';
    this.StoreIcOfficeValue = '';
    }



    //---------------------------------------FOR TESTING PURPOSE----------------------------------------------------
    
    @track OnShowRecordEditForm = false;

    onclickofcalenderbutton() {
        this.OnShowRecordEditForm = true;
    }
    handleClick(event) {
        this.CallId = event.currentTarget.dataset.Id
        const callIdcontainer = this.CallId;

        console.log(callIdcontainer);
    }
    
   
    //

 
}

