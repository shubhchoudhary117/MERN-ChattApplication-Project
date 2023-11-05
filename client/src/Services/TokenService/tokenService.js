

class tokenService{
    static setToken=(token)=>{
        localStorage.setItem("token",token)
    }

    static getToken=()=>{
        let token= localStorage.getItem("token")
        return token;
    }

    static removeToken=()=>{
        localStorage.removeItem("token")
    }
}

export default tokenService;