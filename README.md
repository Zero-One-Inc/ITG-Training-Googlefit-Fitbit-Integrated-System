

# ITG Training

## Task 3: Google Fit and Fitbit Health Data Integration with API Usages, Authentication, and Revoking Connection

### Objective:

The objective of this task is to Create a robust and secure integration between Google Fit and Fitbit, allowing users to seamlessly sync and access their health data across both platforms. The integration should be implemented using APIs, focusing on proper authentication mechanisms, data privacy, and the ability for users to revoke the connection at any time.

### Tools used:
- **Postman:**  
  For building and using APIs.
- **Back-end:**   
  Node JS, Express JS.
- **Database:**  
  MongoDB. Mongoose(ORM).
- **Packages:**
	- **Babel**:  
	For running JS code in ES6 JS.  
	`npm i @babel/node @babel/core @babel/preset-env`
	- **Jest**:  
	For unit testing.  
	`npm i jest`
	- **Winston**:  
	For building a logging system.  
	`npm i winston`
	- **Nodemone**:  
	To rerun the code on every change in the code.  
	`npm i nodemone`
	- **config and Dotenv**:  
	For store and retrieve env. variables.  
	`npm i dotenv config`
	- **Axios**:  
	For making http/https requests.  
	`npm i axios`
	- **Bcrypt**:  
	For hashing password  
	`npm i bcrypt`
	- **Express and Express Session**:  
	For installing express framework to build our web app. And express-session for creating sessions.  
	`npm i express express-session`
	- **Joi and Joi-ObjectId**:  
	For validating request inputs.  
	`npm i joi joi-objectid`
	- **Mongoose**:  
	It is Object Relational Models (ORM) for writing MongoDB validation, casting and business logic boilerplate.  
	`npm i mongoose`
	- **Passport and Passport-Google-OAuth-20**:  
	For Authentication and retrieve tokens and refresh tokens.  
	`npm i passport passport-google-oauth20`

### System Architecture Overview
- **Backend Server:**  
	 The server handles authentication, data retrieval, and data synchronization between Google Fit, Fitbit, and the user's account.
- **Google Fit and Fitbit APIs:**  
	 The APIs provided by Google Fit and Fitbit allow access to user health and fitness data.
### Integration Flow:
- **User Authentication**:
	- Users can register to my app and log in.
	- Users have to choose between Google Fit and Fitbit accounts to connect with.
	- The User Interface redirects the user to the backend server for authentication.
- **Backend Server Authentication**:
	- The backend server initiates the Google Fit or Fitbit authentication process using OAuth 2.0 + PKCE.
	- 	The use of PKCE is to prevent authorization code interception attacks because of the lack of security on the client side (mobile or desktop).
	- The user grants permission to access their health data.
	- For more information about [PKCE by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636)
	- For more information about [Fitbit Authorization using OAuth20+PKCE](https://dev.fitbit.com/build/reference/web-api/developer-guide/authorization/)

- **Access Token and Refresh Token Retrieval**:
	- Upon successful authentication, the backend server receives access and refresh tokens for Google Fit or Fitbit APIs.
- **Data Retrieval and Synchronization**:
	- The backend server uses the obtained access tokens to request health data from APIs that the user has connected with.
	- The server processes and synchronizes the data, ensuring data consistency and mapping these data as a unified data format for both platforms.
- **Data Response**:
	- The backend server sends the processed health data back to the User Interface.
	- The data format by date “YYYY-MM-dd” and each date has a set of Health fields, each Health field should have a string value of integer or float number. Integers and floats should have two precision numbers. As mentioned before. 
### Data Flow:
- **Google Fit Data Types:**  
	- To read more about [Google Fit Data types](https://developers.google.com/fit/datatypes).
- **Fitbit Data Types:**  
	- To read more about [Fitbit data types](https://dev.fitbit.com/build/reference/web-api/).
- **API Request**:
	- The backend server requests user health data from the Google Fit or Fitbit APIs using the access token.
	- For more about [Google Fit End-Points](https://developers.google.com/fit/rest/v1/reference).
- **Data Processing**:
	- The server processes the retrieved data, performing necessary data transformations and mappings.
### Security Measures:
- **Secure Communication**:
	- Implement HTTPS for all communication between the User Interface, backend server, and APIs to ensure data integrity and confidentiality.
	- One of the popular SSLs: [OpenSSL](https://www.openssl.org/)
- **OAuth 2.0**:
	- Use OAuth 2.0 for user authentication and access token retrieval from Google Fit and Fitbit apps, enabling secure authorization without sharing user credentials.
	- For more information about [REST API | Google Fit | Google for Developers](https://developers.google.com/fit/rest/v1/get-started)
	- Also, [Fitbit | Web API](https://dev.fitbit.com/build/reference/web-api/)
- **Access Token Management**:
	- Store access tokens securely on the backend server and implement token expiration handling and refresh token mechanisms.
### Authentication and Revoking Connection:
- **Authentication**:
	- Users authenticate through OAuth 2.0 flow, and the backend server stores the access tokens for future data retrieval.
	- Authentication using [Passport.js with PKCE ](https://medium.com/passportjs/pkce-support-for-oauth-2-0-e3a77013b278)
	- Authentication using [GoogleAPIs](https://developers.google.com/identity/protocols/oauth2/native-app)
	- Authentication in [Fitbit](https://dev.fitbit.com/build/reference/web-api/authorization/)
- **Revoking Connection**:
	- Users can revoke the connection to their Google Fit and Fitbit accounts through the User Interface.
	- Upon revoking, the backend server should delete the stored access tokens and cease accessing the user's health data. Registration

- **Postman:**  
	Provided a collection of all the APIs, which are:
	- **User Authentication End-Points**:
	  - Login:
		  - URL: "http://localhost:3000/auth/user/login"
		  - Method: POST
		  - Request Body:
			  ```json
			  {
				  "email": "email",
				  "password": "password"
			  }
			  ```
		  - Response:  
			  200 => success  
			  400 => Bad request  
			  404 => User doesn't exist.  
			  500 => Server-side error  
	  - Register:
		  - URL: "http://localhost:3000/auth/user/register"
		  - Method: POST
		  - Request Body:
			  ```json
			  {
				  "firstName": "name",
				  "lastName": "name",
				  "email": "email",
				  "password": "password"
			  }
			  ```
		  - Response:  
			  200 => success  
			  400 => Bad request  
			  500 => Server-side error  
	  - Logout:
		  - URL: "http://localhost:3000/auth/user"
		  - Method: DELETE
		  - Request Header:
			  ``` json
			  {
				"USER_TOKEN": "Bearer <token>",
				"USER_REFRESH_TOKEN": "Bearer <token>"
				}
			  ```
		  - Response:  
			  200 => success  
			  500 => Server-side error  
	  - Delete:
		  - URL: "http://localhost:3000/auth/user/logout:userID"
		  - Method: DELETE
		  - Request Header:
			  ``` json
				{
				"USER_TOKEN": "Bearer <token>",
				"USER_REFRESH_TOKEN": "Bearer <token>"
				}
			  ```
				   
		  - Response:  
			  200 => success  
			  500 => Server-side error  
  - **Google Authentication End-Points:**
	  - Create Google Fit Credentials:
		  - URLs:  
			  "http://localhost:3000/auth/google",  
			  "http://localhost:3000/auth/google/callback"  
		  - Method: GET
		  - Approach:
			  - It will redirect the user to a sign-in page to log in to his Google account
			  - If the user accepts the terms, then he will be connected and Google credentials will be stored. 
	  - Revoke Google Fit Connection:
		  -  URLs:  
			  "http://localhost:3000/auth/google"  
		  - Method: DELETE
		  - Approach:
			  - It will delete Google credentials for that user. 
  - **Fitbit Authentication End-Points:**
	  - Create Fitbit Credentials:
		  - URLs:  
			  "http://localhost:3000/auth/fitbit",  
			  "http://localhost:3000/auth/fitbit/callback"  
		  - Method: GET
		  - Approach:
			  - It will redirect the user to a sign-in page to log in to his Fitbit account
			  - If the user accepts the terms, then he will be connected and Fitbit credentials will be stored. 
	  - Revoke Fitbit Connection:
		  -  URLs:  
			  "http://localhost:3000/auth/fitbit"  
		  - Method: DELETE
		  - Approach:
			  - It will delete Fitbit credentials for that user. 
  - **Google Fit Data End-Points:**
	  - Get Aggregated Data:
		  - URL: "http://localhost:3000/google/aggregate"
		  - Method: POST
		  - Request Header:
			  ``` json
				{
				"USER_TOKEN": "Bearer <token>",
				"USER_REFRESH_TOKEN": "Bearer <token>"
				}
			  ```
		  - Request body:
			  ``` json
			  {
				  "userID": "<ObjectID: ID>",
				  "dataTypes": "<Array of Strings: data types name>",
				  "groupByTime": "<String: one of the following (day, week, month)>",
				  "startTime": "<String: format 'yyyy-mm-dd' => The starting date to fetch data.>",
				  "endTime": "<String: format 'yyyy-mm-dd' => The last date to fetch data.>"
			  }
			  ```
		  - Response: 
			  200 => success  
			  ``` json
			  {
				"2023-08-06": [
					{"activity": "0.00"},
					{"bmr": "-1"},
					{"caloriesBurned": "2172.57"},
					{"cyclingPedalingCadence": "-1"},
					{"cyclingPedalingCumulative": "-1"},
					{"heartPoints": "22.00"},
					//...
					],
					"2023-08-07": [
					{"activity": "7.00"},
					{"bmr": "-1"},
					{"caloriesBurned": "2058.18"},
					{"cyclingPedalingCadence": "-1"},
					{"cyclingPedalingCumulative": "-1"},
					{"heartPoints": "8.00"},
					//...
				], 
			  }
			   ```
			  400 => bad request  
			  401 => Unauthorized access  
			  500 => Server-side error  
  - For more information about [Postman](https://www.postman.com/)
# Missings: 
- Didn't Implement unit testing.
- Didn't finish implementing all data retrieval for Google Fit and Fitbit.
- Didn't implement unit testing.
- Didn't implement SSL.
