/**
 * @author Akshat Jain
 * @email akshat.jain@mtxb2b.com
 * @desc This class contains utility methods to fetch picklist and record types
 */
public with sharing class PicklistUtility {
    
    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc To fetch picklist values
     */
    @AuraEnabled
    public static List<SelectOptionWrapper> fetchPicklist(String objectName, String fieldName){
        List<SelectOptionWrapper> opts = new List<SelectOptionWrapper>();
        
        Schema.SObjectType s = Schema.getGlobalDescribe().get(objectName) ;
        Schema.DescribeSObjectResult r = s.getDescribe() ;
        Map<String,Schema.SObjectField> fields = r.fields.getMap() ;
        Schema.DescribeFieldResult fieldResult = fields.get(fieldName).getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        
        for( Schema.PicklistEntry pickListVal : ple){
            opts.add( new SelectOptionWrapper( pickListVal.getValue(), pickListVal.getLabel())  );
        }    
        
        return opts;
    }

    /**
     * @author Akshat Jain
     * @email akshat.jain@mtxb2b.com
     * @desc To fetch all record type names in picklist
     */
    @AuraEnabled
    public static List<SelectOptionWrapper> fetchRecordTypes(String objectName){
        try{
            List<SelectOptionWrapper> recordTypeList = new List<SelectOptionWrapper>();
            for(RecordType recordType : [Select Id,Name,SobjectType From RecordType WHERE SobjectType =: objectName]){
                recordTypeList.add(new SelectOptionWrapper( recordType.Id,recordType.Name ) );
            }
            return recordTypeList;
        }catch(Exception e){
            throw new AurahandledException(e.getMessage());
        }
    }

    public class SelectOptionWrapper{
        @AuraEnabled public string value;
        @AuraEnabled public string label;
        
        public SelectOptionWrapper(string value, string label){
            this.value = value;
            this.label = label;
        }
    }
}