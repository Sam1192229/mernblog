import Post from "../components/Post";
import {useEffect, useState} from "react";
import indexpic from '../assets/indexp2.avif';

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/post')
    .then(response => {
      response.json()
      .then(posts => {
        // console.log(posts);
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div className="flex flex-col pt-20 gap-10"
    style={{
      backgroundImage: `url(${indexpic})`, // Replace with your image path
      backgroundSize: 'cover', // Cover the entire form area
      backgroundPosition: 'center', // Center the image
    }}
    >
      {posts.length > 0 && posts.map(post => (
       
        <Post {...post}  key={post.id} />
      ))}
    </div>
  );
}
