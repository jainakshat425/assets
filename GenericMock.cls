/**
 * @author Akshat Jain
 * @email akshat.jain@mtxb2b.com
 * @desc This is a generic class to get mock data in test classes
 */
@isTest
public without sharing class GenericMock implements HttpCalloutMock {
     
    private Map<String,String> headers;
    private String body;
    private String status;
    private Integer statusCode;

    public GenericMock( Map<String,String> headers, String body, String status, Integer statusCode ) {
        this.headers = headers;
        this.body = body;
        this.status = status;
        this.statusCode = statusCode;
    }

    public HTTPResponse respond(HTTPrequest request) {

        HttpResponse response = new HttpResponse();

        for (String key : this.headers.keySet()) {
            response.setHeader( key, this.headers.get( key ) );
        }

        response.setStatus( this.status );
        response.setBody( this.body );
        response.setStatusCode( this.statusCode );
        
        return response;
    }
}
      