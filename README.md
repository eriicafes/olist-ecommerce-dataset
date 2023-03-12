# Olist Ecommerce Dataset

### This repository consists of an express server and a react web app.

## Server

The server is an nodejs server built using express. To run the server application:

```bash
cd server
```

Create a local mongodb database and provide the database connection uri in an .env file:

```bash
MONGO_URI=#database connection string here
```

The database connection defaults to `mongodb://localhost:27017/olist-ecommerce-dataset` if none is provided.

Optionally provide a port to run server (the default is 5000).

```bash
PORT=# port here
```

Run application using the command below:

```bash
npm run dev # for live reload and local development
# or
npm start
```

## Client

The client is a react application built using vite. To run the client application:

```bash
cd client
```

Provide api base url using a .env file.

```bash
VITE_API_BASE=#api base url here
```

The api base url defaults to `http://localhost:5000` same as default port with server application.

Run application using the command below:

```bash
npm run dev
```
