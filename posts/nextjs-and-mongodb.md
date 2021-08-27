---
title: Integrating MongoDB to NextJs
excerpt: Connecting a database like MongoDB is an essential feature for many web apps. NextJS makes it pretty easy to do it!
image: mongo.png
isFeatured: true
date: '2021-08-27'
---
If you are working on a fullstack project, sooner or later you probably will get into the situation where you need to connect your web app to a database. In this blog post I will use **MongoDB**. This is pretty straight forward non-SQL database, which you can easily use for free!

## How to get started?
Before we can dive into the actual code, you will firstly need to set up some things concerning MongoDB. Firstly, create an account [here](https://www.mongodb.com/de-de/cloud/atlas). We will be using MongoDB cloud atlas.

After completing your registration and setting up an organization, you mainly will need to set up to things. Go to **Database Access** and add a new user. Make sure, that this user has read and write access! Use **password** as the authentication method and note this password, because you will need it soon. 

![Create an user](user.png)


After setting up your user, go to **Network Access** and add your current IP-address in order to be able to establish a connection to your database. Alternatively, you can allow access from every IP-address.

![Add IP-address](network.png)


## How to set up my code?
Since this post is all about data fetching, the **getStaticProps** function is the perfect place for establishing a connection and fetching data. If you don't know about getStaticProps and the other options NextJS offers, visit [this site](https://nextjs.org/docs/basic-features/data-fetching).

Below you can find the whole code for connecting and fetching data from MongoDB. We will go through it step by step.


```js
export async function 
getStaticProps() {

  const client = 
  await 
  MongoClient.connect(
    "mongodb+srv://
    <username>:<username>
    @cluster0
    .pqdlimongodb.net/
    <dbname>?retryWrites
    =true&w=majority"
  );

  const db = 
  client.db();

  const yourCollection = 
  db.collection
  ("yourCollection");


  const yourData = 
  await yourCollection
  .find().toArray();

  client.close();

  return {
    props: data
  };
}
```

As you can see, I constructed the whole function to be asynchronous, which usually is a good idea when it comes to data fetching.