import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import indexpic from '../assets/indexp2.avif';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [redirect2, setRedirect2] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/post/' + id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:4000/post/', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  async function deletePost() {
    const response = await fetch(`http://localhost:4000/post/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect2(true);
    }
  }

  if (redirect2) {
    return <Navigate to={'/'} />
  }
  if (redirect) {
    return <Navigate to={'/'} />
  }
 
  return (
    <div className="w-3/5 mx-auto mt-8 p-6 bg-white rounded-lg shadow-md" style={{
      backgroundImage: `url(${indexpic})`, // Replace with your image path
      backgroundSize: 'cover', // Cover the entire form area
      backgroundPosition: 'center', // Center the image
    }}>
      <form onSubmit={updatePost} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={ev => setSummary(ev.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          type="file"
          onChange={ev => setFiles(ev.target.files)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <Editor value={content} onChange={setContent} />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Update Post
        </button>
        <button
          type="button"
          onClick={deletePost}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
