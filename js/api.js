const BASE_URL = "http://localhost:3000";

const api = {
  // GASTOS
  getGastos: function() {axios.get(`${BASE_URL}/gastos`)},
  createGastos:function(data){axios.post(`${BASE_URL}/gastos`),data},
  updateGastos:function(id,data){axios.put(`${BASE_URL}/gastos/${id}`,data)},
  deleteGastos:function(id){axios.delete(`${BASE_URL}/gastos/${id}`)},


  // CATEGORIAS
  getCategorias:function (){axios.get(`${BASE_URL}/categorias`)},
  createCategorias:function(data){axios.post(`${BASE_URL}/categorias`,data)},
  updateCategorias:function(id,data){axios.put(`${BASE_URL}/categorias/${id}`,data)},
  deleteCategorias:function(id){axios.delete(`${BASE_URL}/categorias/${id}`)},
  // PRESUPUESTOS
  getPresupuesto:function(){axios.get(`${BASE_URL}/presupuesto`)},
  createPresupuesto:function(data){axios.post(`${BASE_URL}/presupuesto`,data)},
  updatePresupuesto:function(id,data){axios.put(`${BASE_URL}/presupuesto/${id}`,data)},
  deletePresupuesto:function(id){axios.delete(`${BASE_URL}/presupuesto/${id}`)},
  
};