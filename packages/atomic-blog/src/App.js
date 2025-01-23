import { memo, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { usePosts, PostProvider } from "./PostContext";
import Test from "./Test";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

//createContext(<objectX>) objectX is inmutable for the rest of its lifetime
//createContext returns a component-like in this case PostContext
//PostContext.Provider is the flutter like Provider component

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false);

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  return (
    <PostProvider>
      {/* It would be better to group states in
      topic related  Providers, for instance, one that is
      post related and another for the query and its setter*/}
      <section>
        <button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className="btn-fake-dark-mode"
        >
          {isFakeDark ? "☀️" : "🌙"}
        </button>

        <Header />
        <Main />
        <Archive />
        <Footer />
      </section>
    </PostProvider>
  );
}

function Header() {
  const x = usePosts();
  const { posts, searchQuery, onClearPosts, setSearchQuery } = x;
  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results posts={posts} />
        <SearchPosts
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const x = usePosts();
  const { searchQuery, setSearchQuery } = x;

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const x = usePosts();
  const { posts } = x;

  return <p>🚀 {posts.length} atomic posts found</p>;
}

const Main = memo(function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
});

function Posts() {
  const x = usePosts();
  const { posts } = x;

  return (
    <section>
      <List posts={posts} />
    </section>
  );
}

function FormAddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const x = usePosts();
  const { onAddPost } = x;

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const x = usePosts();
  const { posts } = x;
console.log("papapappa")
  return (
    <>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      {/* <Test></Test> */}
    </>
  );
}

const Archive = memo(function Archive() {
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts, onAddPost] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;

//COntect API: usePosts() global state to the entire app
//Just like a flutter provider
//In fact it used a element called the same
//1. PROVIDER
//2. VALUE
//3. CONSUMERS

//And almost like what happens in FLutter
//When the value changes
//the children of the corresponding provider
//acordingly rerender

//Types of state:

//Local -- Global
//Remote -- UI

//Remote: Api loaded --> fetched asynchronously, may require refetching
//UI: Theme, list, form data, etc --> handled synchronouly

//1.Local Component
//2.Parent Component
//3. The contextAPI is best suited for global   UI state

//4. (Alternative) 3rd party libreries
//Redux, React Query, SWE, Zustand. etc

//5. URL
//6. Browser: local storage, session storage, etc
