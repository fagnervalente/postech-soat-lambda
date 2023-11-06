// Import all functions from autenticator.js
const lambda = require('../../../src/handlers/autenticator.js'); 
// Import dynamodb from aws-sdk 
const dynamodb = require('aws-sdk/clients/dynamodb');

jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'), // import and retain the original functionalities
    sign: jest.fn().mockReturnValue("token"), // overwrite sign
}));
 
// This includes all tests for autenticatorHandler() 
describe('Test autenticatorHandler', () => { 
    let getSpy; 
 
    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => { 
        // Mock dynamodb get and put methods 
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'get');
    }); 
 
    // Clean up mocks 
    afterAll(() => { 
        getSpy.mockRestore(); 
    }); 
 
    // This test invokes autenticatorHandler() and compare the result  
    it('should get item by id', async () => { 
        const item = { id: '123', name: 'name1' }; 
 
        // Return the specified value whenever the spied get function is called 
        getSpy.mockReturnValue({ 
            promise: () => Promise.resolve({ Item: item }) 
        }); 
 
        const event = { 
            httpMethod: 'GET', 
            pathParameters: { 
                cpf: '123' 
            } 
        } 
 
        // Invoke autenticatorHandler() 
        const result = await lambda.autenticatorHandler(event); 
 
        // Compare the result with the expected result 
        expect(JSON.parse(result.body).auth).toBeTruthy();
    }); 
}); 
 