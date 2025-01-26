import { Outlet, useNavigation } from "react-router-dom";
import CartOverview from "../features/Cart/CartOverview";
import Header from "./Header";
import Loader from "./Loader";

export default function AppLayout() {
  const navigation = useNavigation(); //global navigation state
  //will return 'loading' when any router page is in the loading state
  const isLoading = navigation.state === "loading";
  // console.log(isLoading, navigation)
  
  return (
    <div className="layout">
      {isLoading && <Loader/>}
        <>
          <Header />
          <main>
            <Outlet />
          </main>

          <CartOverview />
        </>
      
    </div>
  );
}
