# DevTinder APIs

AuthRouter

- POST /singup
- POST /login
- POST /logout

ProfileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

ConnectionRequestRouter

- POST /request/send//interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter

- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the profiles of other users on platform

status: ignore, interested, accepted, rejected
