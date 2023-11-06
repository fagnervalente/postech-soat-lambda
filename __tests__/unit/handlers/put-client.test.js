// Import all functions from put-client.js
const lambda = require('../../../src/handlers/put-client.js'); 
// Import dynamodb from aws-sdk 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
 
// This includes all tests for putClientHandler() 
describe('Test putClientHandler', function () { 
    let putSpy; 
 
    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => { 
        // Mock dynamodb get and put methods 
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put'); 
    }); 
 
    // Clean up mocks 
    afterAll(() => { 
        putSpy.mockRestore(); 
    }); 
 
    // This test invokes putClientHandler() and compare the result  
    it('should add id to the table', async () => { 
        const returnedItem = { id: '123', name: 'name1' }; 
 
        // Return the specified value whenever the spied put function is called 
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve(returnedItem) 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: '{"id": "123","name": "name1"}' 
        }; 
     
        // Invoke putClientHandler() 
        const result = await lambda.putClientHandler(event); 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(returnedItem) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
 