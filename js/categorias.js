async function renderCategorias() {
  document.getElementById("main-content").innerHTML = `
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-800">Categorías</h1>
      <p class="text-sm text-gray-400">Administrá tus categorías de gastos</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100">

      <!-- HEADER -->
      <div class="flex justify-between items-center p-5 border-b border-gray-50">
        <span class="text-sm font-medium text-gray-800">Listado de categorías</span>
        <button onclick="mostrarFormularioCategoria()" class="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg">+ Agregar</button>
      </div>

      <!-- GRID DE CATEGORIAS -->
      <div id="grid-categorias" class="grid grid-cols-2 gap-3 p-5 md:grid-cols-4"></div>

      <!-- FORMULARIO INLINE -->
      <div id="formulario-categoria" class="hidden bg-gray-50 border-t border-gray-100 p-5">
        <p class="text-sm font-medium text-gray-800 mb-4" id="form-titulo-cat">Nueva categoría</p>
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Nombre</label>
            <input id="input-nombre-cat" type="text" placeholder="Ej: Educación" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Ícono (emoji)</label>
            <input id="input-icono-cat" type="text" placeholder="Ej: 📚" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Color</label>
            <input id="input-color-cat" type="color" value="#eef2ff" class="w-full h-9 border border-gray-200 rounded-lg px-1 py-1 cursor-pointer" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button onclick="ocultarFormularioCategoria()" class="text-xs bg-gray-100 text-gray-500 px-4 py-2 rounded-lg">Cancelar</button>
          <button onclick="guardarCategoria()" class="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg">Guardar</button>
        </div>
      </div>

    </div>
  `;

  
}

