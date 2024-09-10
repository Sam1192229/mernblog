import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../components/Editor";
import indexpic from '../assets/indexp2.avif';


export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div className="w-3/5 mx-auto mt-8 mb-16"
   
    >
      <form onSubmit={createNewPost} className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
       style={{
        backgroundImage: `url(${indexpic})`, // Replace with your image path
        backgroundSize: 'cover', // Cover the entire form area
        backgroundPosition: 'center', // Center the image
      }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter title"
            value={title}
            onChange={ev => setTitle(ev.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="summary">
            Summary
          </label>
          <input
            type="text"
            id="summary"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter summary"
            value={summary}
            onChange={ev => setSummary(ev.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Cover Image
          </label>
          <input
            type="file"
            id="file"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={ev => setFiles(ev.target.files)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Content
          </label>
          <Editor value={content} onChange={setContent} />
  
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="border-2 border-gray-500 p-2 rounded-lg text-gray-200 transition ease-in-out delay-150 bg-gray-800 hover:-translate-y-1 hover:scale-110 hover:bg-teal-500 duration-300 hover:text-white"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}

