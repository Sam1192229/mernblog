import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    <div className="post mb-10 flex flex-row justify-center min-w-full gap-10">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img
            src={`http://localhost:4000/${cover}`}
            alt=""
            className=" w-96 h-auto border-2 border-white"
          />
        </Link>
      </div>
        <div className="texts flex flex-col gap-2 w-1/3">
          <Link to={`/post/${_id}`}>
            <h2 className="text-teal-800  font-serif text-3xl font-extrabold text-pretty drop-shadow-xl ">{title}</h2>
          </Link>
          <p className="info text-mono text-gray-800">
            {/* Conditional rendering to handle null or undefined author */}
            {author && <a className="author font-bold">{author.username.toUpperCase()}</a>}
            <br />
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary text-gray-800 font-small font-serif">{summary}</p>
        </div>
    </div>
  );
}





