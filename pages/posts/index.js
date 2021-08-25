import AllPosts from "../../components/posts/all-posts";
import { getAllPosts } from "../../lib/posts-util";
import Head from "next/head";
import { Fragment } from "react";

export default function AllPostsPage(props) {
  return (
    <Fragment>
      <Head>
        <title>All posts</title>
        <meta
          name="description"
          content="A list of all posts, which are related to React, NextJS and JavaScript"
        />
      </Head>
      <AllPosts posts={props.posts} />
    </Fragment>
  );
}

export function getStaticProps() {
  const allPosts = getAllPosts();

  return {
    props: {
      posts: allPosts,
    },
  };
}
