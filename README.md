# OTP Authentication App

This is a simple Node.js application that demonstrates how to implement authentication requiring a One-Time Password (OTP) every time a user logs in. It uses Express for the server, JWT for session handling, bcrypt for password hashing, and Nodemailer for sending OTPs via email.

## Features

- User registration with password hashing
- User login with OTP verification
- OTP sent via email
- JWT token issued upon successful OTP verification

## Prerequisites

- Node.js
- npm (Node Package Manager)
- A Gmail account for sending OTP emails

## Installation

1. Clone the repository:
    ```bash
    git clone [https://github.com/Tani1964/auth-with-otp.git](https://github.com/Tani1964/auth-with-otp.git)
    cd auth-with-otp
    ```

2. Install the required packages:
    ```bash
    npm install
    ```

3. Configure Nodemailer:
    - Enable "Less secure app access" on your Gmail account or use an app-specific password if you have Two-Factor Authentication (2FA) enabled.
    - Update the Nodemailer configuration in `server.js` with your Gmail account credentials.

## Usage

1. Start the server:
    ```bash
    node server.js
    ```

2. Test the endpoints using Postman or a similar tool.

### Endpoints

#### Register

- **URL**: `/register`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "username": "test",
        "password": "password123",
        "email": "user-email@example.com"
    }
    ```

#### Login

- **URL**: `/login`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "username": "test",
        "password": "password123"
    }
    ```

#### Verify OTP

- **URL**: `/verify`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "username": "test",
        "otp": "123456"
    }
    ```

### Example Workflow

1. **Register** a new user:
    - Send a `POST` request to `/register` with the required JSON body.

2. **Login** with the registered user:
    - Send a `POST` request to `/login` with the required JSON body.
    - An OTP will be sent to the registered email address.

3. **Verify OTP**:
    - Send a `POST` request to `/verify` with the required JSON body, including the OTP received via email.
    - Upon successful OTP verification, a JWT token will be issued.

## Error Handling

- Proper error messages are returned for invalid requests, including invalid username, password, or OTP.

## Notes

- This is a basic implementation and should not be used in production without further enhancements and security measures.
- Ensure you handle sensitive information securely, especially email credentials.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
