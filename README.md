<h2>Envitera-api</h2>
Final Project Pengembangan Aplikasi Berbasis Web ITERA


<h2>HTTP requests</h2>
All API requests are made by sending a secure HTTPS request using one of the following methods, depending on the action being taken:

- `POST` Create a resource
- `PUT` Update a resource
- `GET` Get a resource or list of resources
- `DELETE` Delete a resource

<h2>HTTP Response Codes</h2>
Each response will be returned with one of the following HTTP status codes:

- `200 OK` The request was successful
- `400 Bad Request` There was a problem with the request (security, malformed, data validation, etc.)
- `401 Unauthorized` The supplied API credentials are invalid
- `403 Forbidden` The credentials provided do not have permission to access the requested resource
- `404 Not found` An attempt was made to access a resource that does not exist in the API
- `405 Method not allowed` The resource being accessed doesn't support the method specified (GET, POST, etc.).
- `500 Server Error` An error on the server An error on the server occurred.

<h2>Resources</h2>

each route which access is `private` required a `token` string in header.

**Users**

| Route | Description | Access |
| --- | --- | --- |
| `POST api/users/register` | Register new user | Public |
| `POST api/users/login` | Login User and return a token | Public |
| `GET api/users/current` | Return user current payload | Private |

**Profiles**

| Route | Description | Access |
| --- | --- | --- |
| `GET api/profile` | Get current user profile | Private |
| `GET api/profile/handle/:handle` |Get a profile by handle | Public |
| `GET api/profile/user/:user_id` | Get profile by user id | Public |
| `GET api/profile/all` | Get all profile | Public |
| `POST api/profile` | Create current user profile | Private |
| `GET api/profile/user/:user_id` | Get profile by user id | Public |



