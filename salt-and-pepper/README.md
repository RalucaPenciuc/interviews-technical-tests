# salt-pepper-internship

NodeJs Challenge, Game of Thrones Theme.

A few technical specifications:
- used Express, for server;
- used Nodemon, to "live-update" the server;
- used Morgan, to log details about the requests sent;
- used MongoDB and Mongoose, to keep the data in a database;
- used Postman, to test the API;
- functional endpoints: list all characters and CRUD operations for Character model;

Basic idea: Client make requests to server using a specific URL for each request. The server receive the request, handles it, and send back to client the response. The response is always a JSON object. Its content can be the asked data, if the URL used is correct, or the message of the error, if not. The server has defined routes and a port (3000), in order to decide if the URL used by the client is correct or not. Edge cases: incomplete/invalid URL => "Invalid url";

Small issues:
- pretty ugly id given to each data, you have to copy and paste the URL from the JSON containing all characters (can't write it manually)
