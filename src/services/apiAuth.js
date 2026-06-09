import api from './api'

export const authApi ={

  login(data){
    return api.post('/login', data)
  },

  register(data){
    return api.post('/register', data)
  },

  logout(){
    return api.post('/logout')
  },

  getUser(){
    return api.get('/me')
  }

}
