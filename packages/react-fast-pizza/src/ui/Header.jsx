import { Link } from "react-router-dom";
import SearchOrder from "../features/Order/SearchOrder";

export default function Header(){
    return <header>
        <SearchOrder/>
        <Link to="/">Fast React Pizza Co.</Link>
    </header>
}