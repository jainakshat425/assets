/**
 * @author Akshat Jain
 * @email akshat.jain@mtxb2b.com
 * @desc This class is controller class for DueDilligence
 */
public with sharing class DueDiligenceController {
    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc Get due diligence records based on record ID
     */
    @AuraEnabled
    public static List<DueDiligenceWrapper> getDueDiligenceRecords(String idField){
        List<Due_Diligence__c> dueDiligenceList = new List<Due_Diligence__c>();
        if(idField!=null || idField!=''){
            // TODO: Replace Application__c with the sObject API Name
            Schema.DescribeSObjectResult recordIdPrefix = Application__c.sObjectType.getDescribe();

            // TODO: Id field can be compared with different type of sObject Ids
            // and accordingly due diligence for that sObject can be queried
            if( idField.substring(0, 3) == recordIdPrefix.getKeyPrefix() ){
                dueDiligenceList = [SELECT Id, Due_Diligence_Name__c, Responsible_Party__c, Reference_Link__c, Help_Text__c,
                                            Notes__c, Status__c, Completed_Date__c, LastModifiedBy.Name
                                    FROM Due_Diligence__c 
                                    WHERE Application__c = :idField  ORDER BY Sequence__c ASC];
            } 
            
        }
        
        List<DueDiligenceWrapper> dueDiligenceWrapperList = new List<DueDiligenceWrapper>();
        for(Due_Diligence__c dueDiligence : dueDiligenceList){
            DueDiligenceWrapper wrapper = new DueDiligenceWrapper();
            wrapper.id = dueDiligence.Id;
            wrapper.dueDiligenceName = dueDiligence.Due_Diligence_Name__c;
            wrapper.responsibleParty = dueDiligence.Responsible_Party__c;
            wrapper.status = dueDiligence.Status__c;
            wrapper.lastModifiedByName = dueDiligence.LastModifiedBy.Name;
            wrapper.lastModifiedById = dueDiligence.LastModifiedBy.Id;
            wrapper.notes = dueDiligence.Notes__c;
            wrapper.helpText = dueDiligence.Help_Text__c;
            wrapper.referenceLink = dueDiligence.Reference_Link__c;
            wrapper.completedDate = dueDiligence.Completed_Date__c;
            dueDiligenceWrapperList.add(wrapper);  
        }
        return dueDiligenceWrapperList;
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc To update due diligence records
     */
    @AuraEnabled
    public static void updateDueDiligenceRecords(String jsonMap){
        List<DueDiligenceWrapper> wrapperList = (List<DueDiligenceWrapper>) JSON.deserialize(jsonMap, List<DueDiligenceWrapper>.class);
        List<Due_Diligence__c> dueDiligenceList = new List<Due_Diligence__c>();
        
        for(DueDiligenceWrapper wrapper : wrapperList){
            
            Due_Diligence__c dueDiligence = new Due_Diligence__c();
            dueDiligence.Id = wrapper.Id;
            dueDiligence.Status__c = wrapper.status;
            dueDiligence.Notes__c = wrapper.notes;
            dueDiligence.Completed_Date__c = (dueDiligence.Status__c == 'Completed' || dueDiligence.Status__c == 'Not Applicable') ? 
                                            Date.today() : 
                                            null;
            dueDiligenceList.add(dueDiligence);
        }
        update dueDiligenceList;
    }

    public class DueDiligenceWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String dueDiligenceName;
        @AuraEnabled public String responsibleParty;
        @AuraEnabled public String status;
        @AuraEnabled public String lastModifiedByName;
        @AuraEnabled public String lastModifiedById;
        @AuraEnabled public String notes;
        @AuraEnabled public String helpText;
        @AuraEnabled public String referenceLink;
        @AuraEnabled public Date completedDate;
    }
}