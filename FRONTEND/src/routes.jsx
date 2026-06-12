import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./features/auths/pages/login";
import Register from "./features/auths/pages/register";
import Feeds from "./features/posts/pages/feeds";
import CreatePost from "./features/posts/pages/createPost";
export const routes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="feeds" element={<Feeds />} />
                <Route path="createPost" element={<CreatePost />} />
            </Routes>
        </BrowserRouter>
    );
};