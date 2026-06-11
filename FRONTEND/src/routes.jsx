import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./features/auths/pages/login";
import Register from "./features/auths/pages/register";
import Feeds from "./features/posts/pages/feeds";
export const routes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="feeds" element={<Feeds />} />
            </Routes>
        </BrowserRouter>
    );
};