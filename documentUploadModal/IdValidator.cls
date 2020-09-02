/**
 * @author Akshat Jain
 * @email akshat.jain@mtxb2b.com
 * @desc Validate Salesforce ID
 */
public class IdValidator {

    /**
     * Check whether a String is a valid Salesforce ID
     * @param  stringValue	The ID as a String to test.
     * @param  sObjectType  The type of the sObject to compare against.
     * @return Returns true if the ID is valid, false otherwise.
     */
    public static Boolean isValid(String stringValue, Schema.SObjectType sObjectType) {
        Id sObjectId;
        
        if( stringValue instanceof Id ) {
            sObjectId = (Id)stringValue;
        }
        
        return !( sObjectId == null || sObjectId.getSObjectType() != sObjectType );
    }
}