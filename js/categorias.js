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

  await cargarCategorias();
}

let categoriaEditandoId = null;

async function cargarCategorias() {
  const resGastos = await api.getGastos();
  const resCategorias = await api.getCategorias();

  const gastos = resGastos.data;
  const categorias = resCategorias.data;

  const grid = document.getElementById("grid-categorias");
  grid.innerHTML = "";

  for (let i = 0; i < categorias.length; i++) {
    const cat = categorias[i];

    // Contar gastos de esta categoría
    let cantidadGastos = 0;
    for (let j = 0; j < gastos.length; j++) {
      if (gastos[j].categoriaId === cat.id) {
        cantidadGastos++;
      }
    }

    grid.innerHTML += `
      <div class="rounded-xl p-4 relative" style="background:${cat.color};">
        <div class="absolute top-2 right-2 flex gap-1">
          <button onclick="editarCategoria(${cat.id})" class="bg-white bg-opacity-80 border-none rounded-md px-1 py-1 text-xs cursor-pointer">✏️</button>
          <button onclick="eliminarCategoria(${cat.id})" class="bg-white bg-opacity-80 border-none rounded-md px-1 py-1 text-xs cursor-pointer">🗑️</button>
        </div>
        <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg mb-2">${cat.icono}</div>
        <div class="text-sm font-medium text-gray-800">${cat.nombre}</div>
        <div class="text-xs text-gray-400 mt-1">${cantidadGastos} ${cantidadGastos === 1 ? "gasto" : "gastos"}</div>
      </div>
    `;
  }
}

function mostrarFormularioCategoria() {
  categoriaEditandoId = null;
  document.getElementById("form-titulo-cat").textContent = "Nueva categoría";
  document.getElementById("input-nombre-cat").value = "";
  document.getElementById("input-icono-cat").value = "";
  document.getElementById("input-color-cat").value = "#eef2ff";
  document.getElementById("formulario-categoria").classList.remove("hidden");
}

function ocultarFormularioCategoria() {
  document.getElementById("formulario-categoria").classList.add("hidden");
}

async function guardarCategoria() {
  const nombre = document.getElementById("input-nombre-cat").value;
  const icono = document.getElementById("input-icono-cat").value;
  const color = document.getElementById("input-color-cat").value;

  if (!nombre || !icono) {
    alert("Completá todos los campos");
    return;
  }

  const categoria = { nombre, icono, color };

  if (categoriaEditandoId) {
    await api.updateCategoria(categoriaEditandoId, categoria);
  } else {
    await api.createCategoria(categoria);
  }

  ocultarFormularioCategoria();
  await cargarCategorias();
}

async function editarCategoria(id) {
  const res = await api.getCategorias();
  const cat = res.data.find(function(c) { return c.id === id; });

  categoriaEditandoId = id;
  document.getElementById("form-titulo-cat").textContent = "Editar categoría";
  document.getElementById("input-nombre-cat").value = cat.nombre;
  document.getElementById("input-icono-cat").value = cat.icono;
  document.getElementById("input-color-cat").value = cat.color;
  document.getElementById("formulario-categoria").classList.remove("hidden");
}

async function eliminarCategoria(id) {
  if (confirm("¿Eliminar categoría?")) {
    await api.deleteCategoria(id);
    await cargarCategorias();
  }
}