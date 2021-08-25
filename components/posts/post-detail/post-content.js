import ReactMarkdown from "react-markdown";
import PostHeader from "./post-header";
import classes from "./post-content.module.css";
import Image from "next/image";


export default function PostContent(props) {
  const imagePath = `/images/posts/${props.post.slug}/${props.post.image}`;

  const customRenderers = {
    // img(image) {
    //   return (
    //     <Image
    //       src={`/images/posts/${props.post.slug}/${image.src}`}
    //       alt={image.alt}
    //       width={600}
    //       height={300}
    //     />
    //   );
    // },
    p(paragraph) {
      const { node } = paragraph;

      if (node.children[0].tagName === "img") {
        const image = node.children[0];

        return (
          <div className={classes.image}>
            <Image
              src={`/images/posts/${props.post.slug}/${image.properties.src}`}
              alt={image.alt}
              width={600}
              height={300}
            />
          </div>
        );
      }
      return <p>{paragraph.children}</p>;
    },
   
  };

  return (
    <article className={classes.content}>
      <PostHeader title={props.post.title} image={imagePath} />
      <ReactMarkdown components={customRenderers}>
        {props.post.content}
      </ReactMarkdown>
    </article>
  );
}
