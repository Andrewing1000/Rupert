import { faker } from "@faker-js/faker";
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  const handleAddPost = useCallback(function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }, []);

  const handleClearPosts = useCallback(function handleClearPosts() {
    setPosts([]);
  }, []);

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery,
    };
  }, [searchedPosts, searchQuery, handleAddPost, handleClearPosts]);


  //Not rapping the handler functions with the 
  // useCallback woulnt trigger an infinite loop here.
  // Since the useMemo is only run one 
  //and does not trigger a rerender at any point, the
  // recreation of the handlers does not occour

  return (
    <PostContext.Provider value={
      // {
      //   posts: searchedPosts,
      //   onAddPost: handleAddPost,
      //   onClearPosts: handleClearPosts,
      //   searchQuery: searchQuery,
      //   setSearchQuery: setSearchQuery,
      // } //this would make the context rebuild its value
      //every time it rerenders, leading to further
      //wasted rerenders to all of its consumers
      //even if there was no actual change in the data
      value
    }>
      {children}
      {/* Passing consumers as elemets leverages
      the optimization technique that decouples rederization
      between parent and children. This way, only children 
      that actually consume this context are actually rendered
      even though the rest are also children of this element*/}
    </PostContext.Provider>
  );
}

function usePosts() {
  return useContext(PostContext);
}

export { PostProvider, PostContext, usePosts };

//Render: component call + DOM generation
//Then comes the reconciliation
//Finally its the commit phase that triggers the
//actual DOM updates
//Then the layoutEffects are executed
//The browser repaints
//Normal useEffects are executed
