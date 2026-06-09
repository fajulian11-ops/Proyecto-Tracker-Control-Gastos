const BASE_URL = "http://localhost:3000";

const api = {
  // GASTOS
  getGastos: function() {return axios.get(`${BASE_URL}/gastos`)},
  createGastos:function(data){return axios.post(`${BASE_URL}/gastos`,data)},
  updateGastos:function(id,data){return axios.put(`${BASE_URL}/gastos/${id}`,data)},
  deleteGastos:function(id){return axios.delete(`${BASE_URL}/gastos/${id}`)},


  // CATEGORIAS
  getCategorias:function (){return axios.get(`${BASE_URL}/categorias`)},
  createCategorias:function(data){return axios.post(`${BASE_URL}/categorias`,data)},
  updateCategorias:function(id,data){return axios.put(`${BASE_URL}/categorias/${id}`,data)},
  deleteCategorias:function(id){return axios.delete(`${BASE_URL}/categorias/${id}`)},
  // PRESUPUESTOS
  getPresupuestos:function(){return axios.get(`${BASE_URL}/presupuestos`)},
  createPresupuestos:function(data){return axios.post(`${BASE_URL}/presupuestos`,data)},
  updatePresupuestos:function(id,data){return axios.put(`${BASE_URL}/presupuestos/${id}`,data)},
  deletePresupuestos:function(id){return axios.delete(`${BASE_URL}/presupuestos/${id}`)},
  
};