import { useState } from "react";

import { useGetQuery, usePostMutation } from "./api/apiSlice";
import { GET_POSTS, ADD_POSTS } from "./api/endpoints";
import { POST } from "./api/tagTypes";

function App() {
  const [title, setTitle] = useState("");

  const { data: posts = [] } = useGetQuery({
    endpoint: GET_POSTS,
    tags: [POST],
  });

  const [addPostMutation] = usePostMutation();

  const addPost = async () => {
    try {
      const res = await addPostMutation({
        endpoint: ADD_POSTS,
        payload: {
          title,
          body: "test",
          userId: 1,
        },
        tags: [POST],
      });
      console.log({ res });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <ul>
        {posts.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
      <br /> <br />
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <br /> <br />
      <button onClick={addPost}>Add Post</button>
    </div>
  );
}

export default App;
