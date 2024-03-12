import axios from "axios";
import TokenService from "../services/TokenService";

let RequestInstance = axios.create({
    mode:'cors',
    headers: {
        Authorization : `Bearer ${TokenService.getLocalAccessToken()}`
    }
})

export default RequestInstance;