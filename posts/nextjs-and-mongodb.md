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




```js
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://kevin:XkWJANgOTkACuIMGTzIIokbszqAo@cluster0.pqdli.mongodb.net/meetings?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // .find() findet by default alle einträge in der jeweiligen collection
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        // das hier ist die id, die von mongodb automatisch erstellt wird und die man konvertieren muss noch
        id: meetup._id.toString(),
        // description braucht man hier nicht, weil das nicht ausgegeben wird auf dieser Seite
      })),
    },
    revalidate: 1,
  };
}
```

