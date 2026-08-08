import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./features/auths/pages/login";
import Register from "./features/auths/pages/register";
import Feeds from "./features/posts/pages/feeds";
import CreatePost from "./features/posts/pages/createPost";
import Account from "./features/posts/pages/account";
import Home from "./features/posts/pages/home";
import ProtectedRoute from "./features/auths/components/protectedRoute";

export const routes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="home" element={<Home/>}/>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="feeds" element={<ProtectedRoute><Feeds /></ProtectedRoute>} />
                <Route path="createPost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
};

