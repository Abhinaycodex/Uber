# Project Title

User Registration System

## Description

This project is a User Registration System that allows users to register by providing their full name, email, and password. The application validates the input, hashes the password for security, and generates a token for user authentication.

## Project Structure

```
backend
├── controllers
│   └── usercontroller.js       # Handles user registration logic
├── models
│   └── user.model.js           # Defines user model and database operations
├── services
│   └── user.service.js         # Contains user management services
├── routes
│   └── index.js                # Sets up application routes
├── package.json                 # npm configuration file
├── .env                         # Environment variables
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the backend directory and add the necessary environment variables (e.g., database connection strings, secret keys).

## Usage

To start the application, run:
```
npm start
```

## API Endpoints

- **POST /register**: Register a new user. Requires `fullname`, `email`, and `password` in the request body.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

# Backend API Documentation

## Endpoints

### POST /users/register

This endpoint is used to register a new user.

#### Request

- **URL**: `/users/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

#### Response

- **Success** (201):
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "password": "hashed_password",
      "socketid": null
    },
    "token": "jwt_token"
  }
  ```

- **Validation Error** (400):
  ```json
  {
    "errors": [
      {
        "msg": "First name is too short",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "Last name is too short",
        "param": "fullname.lastname",
        "location": "body"
      },
      {
        "msg": "Invalid email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password is too short",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

- **Missing Fields Error** (400):
  ```json
  {
    "errors": [
      {
        "msg": "Please provide all the required fields"
      }
    ]
  }
  ```

### POST /users/login

This endpoint is used to log in a user.

#### Request

- **URL**: `/users/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

#### Response

- **Success** (200):
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```

- **Validation Error** (400):
  ```json
  {
    "errors": [
      {
        "msg": "Invalid email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password is too short",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

- **Authentication Error** (401):
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### GET /users/profile

This endpoint is used to get the profile of the logged-in user.

#### Request

- **URL**: `/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

#### Response

- **Success** (200):
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```

- **Authentication Error** (401):
  ```json
  {
    "message": "Not authorized to access this route"
  }
  ```

### GET /users/logout

This endpoint is used to log out the user.

#### Request

- **URL**: `/users/logout`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

#### Response

- **Success** (200):
  ```json
  {
    "message": "User logged out successfully"
  }
  ```

- **Authentication Error** (401):
  ```json
  {
    "message": "Not authorized to access this route"
  }
  ```

### POST /captains/register

This endpoint is used to register a new captain.

#### Request

- **URL**: `/captains/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "password123",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
  ```

#### Response

- **Success** (201):
  ```json
  {
    "token": "jwt_token",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```

- **Validation Error** (400):
  ```json
  {
    "errors": [
      {
        "msg": "Invalid email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "First name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 characters long",
        "param": "password",
        "location": "body"
      },
      {
        "msg": "Color must be at least 3 characters long",
        "param": "vehicle.color",
        "location": "body"
      },
      {
        "msg": "Plate must be at least 3 characters long",
        "param": "vehicle.plate",
        "location": "body"
      },
      {
        "msg": "Capacity must be at least 1",
        "param": "vehicle.capacity",
        "location": "body"
      },
      {
        "msg": "Invalid vehicle type",
        "param": "vehicle.vehicleType",
        "location": "body"
      }
    ]
  }
  ```

- **Authentication Error** (401):
  ```json
  {
    "message": "Captain already exists"
  }
  ```

### POST /captains/login

This endpoint is used to log in a captain.

#### Request

- **URL**: `/captains/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

#### Response

- **Success** (200):
  ```json
  {
    "token": "jwt_token",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```

- **Validation Error** (400):
  ```json
  {
    "errors": [
      {
        "msg": "Invalid email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 characters long",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

- **Authentication Error** (401):
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### GET /captains/profile

This endpoint is used to get the profile of the logged-in captain.

#### Request

- **URL**: `/captains/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

#### Response

- **Success** (200):
  ```json
  {
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```

- **Authentication Error** (401):
  ```json
  {
    "message": "Not authorized to access this route"
  }
  ```

### GET /captains/logout

This endpoint is used to log out the captain.

#### Request

- **URL**: `/captains/logout`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

#### Response

- **Success** (200):
  ```json
  {
    "message": "Captain logged out successfully"
  }
  ```

- **Authentication Error** (401):
  ```json
  {
    "message": "Not authorized to access this route"
  }
  ```

## How to Use

1. Make a request to the appropriate endpoint with the required data in the request body.
2. Ensure that the `Content-Type` header is set to `application/json` for POST requests.
3. Use the `Authorization: Bearer <token>` header for protected routes.
4. The response will contain the relevant data or error messages.

## Required Data

- **User Registration**:
  - `fullname.firstname`: A string with a minimum length of 3 characters.
  - `fullname.lastname`: A string with a minimum length of 3 characters.
  - `email`: A valid email address.
  - `password`: A string with a minimum length of 6 characters.

- **Captain Registration**:
  - `fullname.firstname`: A string with a minimum length of 3 characters.
  - `fullname.lastname`: A string with a minimum length of 3 characters.
  - `email`: A valid email address.
  - `password`: A string with a minimum length of 6 characters.
  - `vehicle.color`: A string with a minimum length of 3 characters.
  - `vehicle.plate`: A string with a minimum length of 3 characters.
  - `vehicle.capacity`: An integer with a minimum value of 1.
  - `vehicle.vehicleType`: A string that must be one of `['car', 'motorcycle', 'auto']`.

## Authentication

- **Token**: The token is generated upon successful login or registration and must be included in the `Authorization` header for protected routes.
- **Logout**: The token is blacklisted upon logout to prevent further use.

## Error Handling

- **Validation Errors**: Returned with a 400 status code and an array of error messages.
- **Authentication Errors**: Returned with a 401 status code and an error message.

## Models

- **User Model**: Defines the schema for user data.
- **Captain Model**: Defines the schema for captain data.
- **Blacklist Token Model**: Stores blacklisted tokens to prevent reuse.

## Middleware

- **Auth Middleware**: Verifies the token and attaches the user or captain object to the request.

## Controllers

- **User Controller**: Handles user registration, login, profile retrieval, and logout.
- **Captain Controller**: Handles captain registration, login, profile retrieval, and logout.

## Services

- **User Service**: Contains business logic for user-related operations.
- **Captain Service**: Contains business logic for captain-related operations.