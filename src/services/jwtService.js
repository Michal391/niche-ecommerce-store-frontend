const jwtService = {
    decodeJWT: (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
  
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    },
  
    getToken: () => {
      return localStorage.getItem('token');
    },
  
    setToken: (token) => {
      localStorage.setItem('token', token);
    },
  
    removeToken: () => {
      localStorage.removeItem('token');
    },
  
    getUserFromToken: () => {
      const token = jwtService.getToken();
      if (!token) return null;
      
      const decodedToken = jwtService.decodeJWT(token);
      console.log("decoded token:" + decodedToken)
      return decodedToken ? { id: decodedToken.id, email: decodedToken.email } : null;
    },
  
    isTokenExpired: (token) => {
      const decodedToken = jwtService.decodeJWT(token);
      if (!decodedToken) return true;
  
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    }
  };
  
  export default jwtService;
  