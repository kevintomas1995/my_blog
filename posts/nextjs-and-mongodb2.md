---
title: Sending and storing data to MongoDB
excerpt: The NextJS api routing system makes it very easy and convenient to send and store data to a backend. 
image: mongo.png
isFeatured: true
date: '2021-08-27'
---

In my [previous post](https://my-blog-alpha-navy.vercel.app/posts/nextjs-and-mongodb) I blogged about how you can set up MongoDB in order to establish a connection to your database within a NextJS-project and how to read data from your database. So if you missed, feel free to read that post first!

## Setting up your custom api route
Normally, when creating a new NextJS project via the command **npx create-next-app**, an api directory will be automatically created. Otherwise, you will have to create that directory in your **pages directory**. Inside that **api directory**, create a JavaScript-file (name it however you want to).

The code snippet below shows the whole procedure of setting your custom api route:

```js
import { MongoClient } 
from "mongodb";

export default 
async function 
handler(req, res) {

  if 
  (req.method 
  === "POST") {
  const data = 
  req.body;

  const client 
  = await 
  MongoClient.connect(
    "mongodb+srv://<user>
    :<password>
    @cluster0.pqdli.
    mongodb.net/<dbname>?
    retryWrites=true&w=majority"
  );

  const db = 
  client.db();

  const yourCollection = 
  db.collection("yourColl");

  const result = 
  await 
  yourCollection.insertOne(
    data);

  console.log(result);

  client.close();

  res.status(201).json({ 
    message: 
    "Data inserted successfully!" 
    });
  }
}
```

In a first step, you need to install the required dependencies via **npm i mongodb**. After doing so, import the MongoClient with:

```js
import { MongoClient } 
from "mongodb";
```

Afterwards, I created an asynchronous function called **handler** which takes two arguments: 1. req aka request and 2. res aka response. If you ever worked with for example node.js and express.js you will probably recognize these arguments. 

To put it very simplified: A request represents the incoming information and the response on the other hand contains the information, which will be sent back to the client.

As a first step inside the function, we check if the incoming request is from the type of **POST**. Only if this check comes out to be true, the code will continue
to proceed.  

```js
const data = 
    req.body;
```
We are expecting to have data attached to the incoming request. With the simple code above we get access to this data. 

The steps below should be familiar to you, if you followed this [tutorial](https://my-blog-alpha-navy.vercel.app/posts/nextjs-and-mongodb). We won't go into detail here. Just don't forget to insert your credentials there.

```js
const client 
  = await 
  MongoClient.connect(
    "mongodb+srv://<user>
    :<password>
    @cluster0.pqdli.
    mongodb.net/<dbname>?
    retryWrites=true&w=majority"
    );

  const db = 
  client.db();

  const yourCollection = 
  db.collection("yourColl");
```

The next step is **the** most important and only difference between reading and writing data to a MongoDB database. 

```js
  const result = 
  await 
  yourCollection
  .insertOne(
    data);
```

Instead of calling a **find** function on your collection, you call the **insert** or **insertOne** function. Like the name of the function implies, you insert data to your collection. The data, you put inside the parentheses is the data you got from the incoming request. That's actually it regarding your api route!

Of course, don't forget to shut down the connection.

And optionally, you can send back a response. In this example a status code of 201 and a message will be sent back.



```js
res.status(201).json({ 
  message: 
  "Data inserted 
  successfully!" 
  });
```

## Use the api in your React component
After setting your api route, we can go ahead and use this api route in our React components. 

For example, you could trigger this api route whenever a certain button in a form is clicked. The data from this form would then be sent to our database. We will play through this scenario in the following code snippets:

```js
async function 
clickHandler(enteredData) {
  const response = await 
  fetch(
    "/api/your-api-route", 
    {
    method: 
    "POST",
    body: 
    JSON.stringify(enteredData),
    headers: 
    {
      "Content-Type": 
      "application/json",
    },
  });

  const data = 
  await 
  response.json();

  console.log(
    data
    );
  }
```

Generally, you would insert this kind of function in a regular React component, just in front of the render or return function. Some React element should then point to our **clickHandler** function. In the example below a simple button will execute the function every time you press it.

```js
<button 
onClick =
{clickHandler}
 />
```

At some point you also need to define the **enteredData**, which is used as an argument in our **clickHandler** function. For example, you could bind some user input to this data. But this is not the focus of this blog post. 

Let's instead dive in to the **clickHandler** function!

```js
const response = 
await 
  fetch(
    "/api/your-api-route", 
```

Since our **clickHandler** function is asynchronous we can again use the await keyword in the body of the function. In this post I used the fetch api, which comes with React out of the box. This code will also work with any other libraries like axios or whatever you like. 

As a first argument of the fetch function, you need to pass the route. And this is exactly the route, which we defined earlier. 

**NOTE**: You **MUST** replace "your-api-route" with the name of your javascript-file in the api directory! This is essential!

```js
{
  method: 
  "POST",
  body: 
  JSON.
  stringify(enteredData),
  headers: 
  {
    "Content-Type": 
    "application/json",
  },
});
```
As a second argument you pass some more information, which specify the request we make with this api call. We are using the POST method since we want to write data. Additionally we need to pass the data as an argument to the body of the request. Our code on the server relies on data being passed to the body. We also convert it the data to the json format, so that we can easily handle the data on the server. In the headers we lastly define the type of the content (this is nothing special releated to NextJS or MongoDB).

```js
const data = 
  await 
  response.json();

  console.log(
    data
    );
```
In a last step you can store the print out the response, which is totally optional is that specific case here. If you can recall,  in this case this would be the message: "Data inserted successfully!". That's simply the response we defined in our api

## Conclusion
In this post you learned how to set up your own custom api and how to call it in a regular React component. This is a really useful and powerful skill to know when it comes to building fullstack NextJS web apps. I hope you enjoyed this post and have a nice day!