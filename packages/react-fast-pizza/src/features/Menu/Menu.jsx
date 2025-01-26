import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  const menu = useLoaderData(); //fetches the data as the render takes place
  //"simultaneously"
  //the component displays completely once the data is completely fetched

  return <ul>
    {
      menu.map(pizza => {
        return <MenuItem pizza={pizza} key={pizza.id}/>
      })
    }
  </ul>
}

async function loader(){
  const menu = await getMenu()
  return menu
}

export default Menu;
export {loader}
