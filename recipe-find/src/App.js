import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./routes/authentication/Login";
import Register from "./routes/authentication/Register";
import HomePage from "./routes/home/HomePage";
import AddRecipes from "./routes/recipes/AddRecipes";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import SessionExpiredBox from "./components/session/SessionExpired";
import {logout} from "./slices/Auth";
import TokenService from "./services/TokenService";
import {refreshToken} from "./slices/Auth";
import axiosInstance from "./services/Api";
import CustomRoute from "./CustomRoutes";
// import ForgotPassword from "./components/password/ForgotPassword"
// import ResetPassword from "./components/password/ResetPassword";
// import AccountPage from "./routes/account/AccountPage";
import AdminDashboard from "./routes/admin/dashboard/AdminDashboard";


function App() {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const [sessionExpired, setSessionExpired] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        let sessionExpireTimeout;
        let tokenRefreshTimeout;

        if (isLoggedIn) {
            sessionExpireTimeout = setTimeout(() => {
                dispatch(logout());
                setSessionExpired(true);
            }, 3540000); // Logout after 59 mins


            tokenRefreshTimeout = setInterval(() => {
                refreshTokenAfter1Minute();
            }, 1800000); /// Refresh every 30 mins
        }

        return () => {
            clearTimeout(sessionExpireTimeout);
            clearTimeout(tokenRefreshTimeout);
        };
    }, [isLoggedIn, dispatch]);

    const refreshTokenAfter1Minute = () => {

        axiosInstance.post("/auth/refresh-token", {
            refreshToken: TokenService.getLocalRefreshToken(),
        })
            .then((response) => {
                const {accessToken} = response.data;
                dispatch(refreshToken(accessToken));
                TokenService.updateLocalAccessToken(accessToken);
            })
            .catch((error) => {

            });
    };


    return (
        <div className="App">
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    {/* public content */}
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/addRecipe" element={<AddRecipes/>}/>
                    {/* {!isLoggedIn && (
                        <>
                            <Route path="/forgot-password" element={<ForgotPassword/>}/>
                            <Route path="/reset-password/:token" element={<ResetPassword/>}/>
                        </>
                    )} */}

                    {/* CUSTOMER ONLY CONTENT MUST BE INTRODUCED */}

                    {/* ADMIN ONLY CONTENT  */}
                    <Route path='/admin' element={<CustomRoute roles={['ROLE_ADMIN']}/>}>
                        <Route path='dashboard' element={<AdminDashboard/>}>
                            {/* <Route path="procedures" element={<Procedures/>}/>
                            <Route path="add-procedure" element={<AddProcedure/>}/>
                            <Route path="edit-procedure/:id" element={<EditProcedure/>}/>
                            <Route path="medics" element={<AdminMedicList/>}/>
                            <Route path="medic-details/:id" element={<AdminMedicDetails/>}/>
                            <Route path="register-medic" element={<RegisterMedic/>}/> */}
                        </Route>
                    </Route>
                   
          
                    {/* user and admin
                    <Route exact path='/account' element={<CustomRoute roles={['ROLE_USER', 'ROLE_ADMIN']}/>}>
                        <Route exact path='/account' element={<AccountPage/>}/>
                    </Route>

                    {/* Random Routes  
                    <Route path="*" element={<Navigate to="/"/>}/> */}


                </Routes>
            </BrowserRouter>
            {sessionExpired && (
                <SessionExpiredBox
                    onLogout={() => {
                        dispatch(logout());
                        setSessionExpired(false);
                    }}
                />
            )}
        </div>
    );
}


export default App;