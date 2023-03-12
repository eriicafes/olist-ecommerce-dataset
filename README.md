# Olits Ecommerce Dataset

### This repository consists of an express server and a react js client application.

## Server

The server is an nodejs server buitl with express. To run the server application:

```bash
cd server
```

Create a local mongodb database and provide the database connection uri in an .env file:

```bash
MONGO_URI=#database connection string here
```

The database connection defaults to `mongodb://localhost:27017/olist-ecommerce-dataset` if none is provided.

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
