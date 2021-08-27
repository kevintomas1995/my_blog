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
      "Data inserted" 
      });
  }
}
```

In a first step, you need to install the required dependencies via **npm i mongodb**. After doing so, import the MongoClient with:

```js
import { MongoClient } 
from "mongodb";
```

Afterwards, I created an asynchronous function called **handler** which takes two arguments: 1. req aka request and 2. res aka response. If you ever worked with for example node.js and express.js you will probably recognize

