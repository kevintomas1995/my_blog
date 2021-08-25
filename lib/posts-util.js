import fs from "fs";
import path from "path";

import matter from "gray-matter";

// hier gibt man an, dass er in dem posts ordner suchen soll
const postsDir = path.join(process.cwd(), "posts");

export function getPostsFiles() {
  return fs.readdirSync(postsDir);
}

export function getPostData(postIdentifier) {
  // nimmt die Dateinendung weg, damit wir das als slug nutzen können
  const postSlug = postIdentifier.replace(/\.md$/, "");

  const filePath = path.join(postsDir, `${postSlug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // matter gibt einem die Metadaten und den content (wie im markdownfile strukturiert) zurück
  const { data, content } = matter(fileContent);

  const postData = {
    slug: postSlug,
    ...data,
    content,
  };

  return postData;
}

//hier gehen wir alle blogeinträge druch
export function getAllPosts() {
  const postFiles = getPostsFiles();

  const allPosts = postFiles.map((postFile) => {
    return getPostData(postFile);
  });

  const sortedPosts = allPosts.sort((postA, postB) =>
    postA.date > postB.date ? -1 : 1
  );

  return sortedPosts;
}

export function getFeaturedPosts() {
  const allPosts = getAllPosts();

  const featuredPosts = allPosts.filter((post) => post.isFeatured);

  return featuredPosts;
}
