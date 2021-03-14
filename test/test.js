//Database code that we are testing
let db = require('../databaseQueries');

//Server code that we are testing
let server = require('../server')

//Set up Chai library 
let chai = require('chai');
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Set up Chai for testing web service
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

//Import the express module
const mysql = require('mysql');


//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "",
    database: "parasto",
    debug: false
});
//Wrapper for all database tests
describe('Database', () => {

    //Mocha test for getAllCustomers method in database module.
    describe('#getAllStories', () => {
        it('should return all of stories in the database', (done) => {
            //Mock response object for test
            let response = {};

            /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
            response.status = (errorCode) => {
                return {
                    json: (errorMessage) => {
                        console.log("Error code: " + errorCode + "; Error message: " + errorMessage);
                        assert.fail("Error code: " + errorCode + "; Error message: " + errorMessage);
                        done();
                    }
                }
            };

            //Add send function to mock object
            response.send = (result) => {
                //Convert result to JavaScript object
                let resObj = JSON.parse(result);

                //Check that an array of customers is returned
                resObj.should.be.a('array');

                //Check that appropriate properties are returned
                if (resObj.length > 1) {
                    resObj[0].should.have.property('StoryId');
                    resObj[0].should.have.property('StoryUsername');
                    resObj[0].should.have.property('StoryTime');
                    resObj[0].should.have.property('StoryDate');
                    resObj[0].should.have.property('StoryDescription');
                }

                //End of test
                done();
            }

            //Call function that we are testing
            db.loadAllStories(response);
        });
    });



    //Mocha test for getAllCustomers method in database module.
    describe('#addNewUser', () => {
        it('should add a new author to the database', (done) => {
            //Mock response object for test
            let response = {};

            /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
            response.status = (errorCode) => {
                return {
                    json: (errorMessage) => {
                        console.log("Error code: " + errorCode + "; Error message: " + errorMessage);
                        assert.fail("Error code: " + errorCode + "; Error message: " + errorMessage);
                        done();
                    }
                }
            };

            //Add send function to mock object. This checks whether function is behaving correctly
            response.send = () => {
                //Check that customer has been added to database
                let sql = "SELECT UserName FROM user WHERE UserName='" + userName + "'";
                connectionPool.query(sql, (err, result) => {
                    if (err) { //Check for errors
                        assert.fail(err); //Fail test if this does not work.
                        done(); //End test
                    } else {
                        //Check that customer has been added
                        expect(result.length).to.equal(1);

                        //Clean up database
                        sql = "DELETE FROM useraccount WHERE UserName='" + userName + "'";
                        connectionPool.query(sql, (err, result) => {
                            if (err) { //Check for errors
                                assert.fail(err); //Fail test if this does not work.
                                done(); //End test
                            } else {
                                // done(); //End test

                                //Clean up database
                                sql = "DELETE FROM user WHERE UserName='" + userName + "'";
                                connectionPool.query(sql, (err, result) => {
                                    if (err) { //Check for errors
                                        assert.fail(err); //Fail test if this does not work.
                                        done(); //End test
                                    } else {
                                        done(); //End test
                                    }
                                });


                            }
                        });





                    }
                });
            };

            //Create random customer details
            let userName = Math.random().toString(36).substring(2, 15);
            let userFullName = Math.random().toString(36).substring(2, 15);
            let userEmail = "test@email.com";
            let userPhone = "+23012345678";
            let userPassword = "testPassword";

            let newUser = { name: userFullName, username: userName, email: userEmail, password: userPassword, phone: userPhone };

            //Call function to add customer to database
            db.registerNewUser(newUser, response);
        });
    });




    //Mocha test for getAllCustomers method in database module.
    describe('#authenticate_User_Credentials', () => {
        it('should check for valid credentials in the database', (done) => {
            //Mock response object for test
            let response = {};

            /* When there is an error response.staus(ERROR_CODE).json(ERROR_MESSAGE) is called
               Mock object should fail test in this situation. */
            response.status = (errorCode) => {
                return {
                    json: (errorMessage) => {
                        console.log("Error code: " + errorCode + "; Error message: " + errorMessage);
                        assert.fail("Error code: " + errorCode + "; Error message: " + errorMessage);
                        done();
                    }
                }
            };

            //Add send function to mock object
            response.send = (result) => {
                //Convert result to JavaScript object
                //let resObj = JSON.parse(result);

                //Check that an array of customers is returned
                result.should.be.a('string');
                result.includes('granted!');

                //Check that appropriate properties are returned
                /*if (resObj.length > 1) {
                    resObj[0].should.have.property('StoryId');
                    resObj[0].should.have.property('StoryUsername');
                    resObj[0].should.have.property('StoryTime');
                    resObj[0].should.have.property('StoryDate');
                    resObj[0].should.have.property('StoryDescription');
                }*/

                //End of test
                done();
            }

            //Call function that we are testing

            //Create random customer details
            let Username = "test";
            let Password = "test";


            db.authenticateUser(Username, Password, response);
        });
    });



















});

//Wrapper for all web service tests
describe('Web Service', () => {

    //Test of GET request sent to /stories
    describe('/GET stories', () => {
        it('should GET all the stories', (done) => {
            chai.request(server)
                .get('/stories')
                .end((err, response) => {
                    //Check the status code
                    response.should.have.status(200);

                    //Convert returned JSON to JavaScript object
                    let resObj = JSON.parse(response.text);

                    //Check that an array of customers is returned
                    resObj.should.be.a('array');

                    //Check that appropriate properties are returned
                    if (resObj.length > 1) {
                        resObj[0].should.have.property('StoryId');
                        resObj[0].should.have.property('StoryUsername');
                        resObj[0].should.have.property('StoryTime');
                        resObj[0].should.have.property('StoryDate');
                        resObj[0].should.have.property('StoryDescription');
                    }

                    //End test
                    done();
                });
        });
    });

    /////////////////////////////////////////////////////////////////////////////////////


    //Test of GET request sent to /stories
    describe('/GET stories/*', () => {
        it('should GET  stories of a specific user', (done) => {
            chai.request(server)
                .get('/stories/test')
                .end((err, response) => {
                    //Check the status code
                    response.should.have.status(200);

                    //Convert returned JSON to JavaScript object
                    let resObj = JSON.parse(response.text);


                    //Check that an array of customers is returned
                    resObj.should.be.a('array');

                    //Check that appropriate properties are returned
                    if (resObj.length > 1) {
                        resObj[0].should.have.property('StoryId');
                        resObj[0].should.have.property('StoryUsername');
                        resObj[0].should.have.property('StoryTime');
                        resObj[0].should.have.property('StoryDate');
                        resObj[0].should.have.property('StoryDescription');
                    }

                    //End test
                    done();
                });
        });
    });


});