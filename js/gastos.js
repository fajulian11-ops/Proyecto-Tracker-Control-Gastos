async function renderGastos() {
  document.getElementById("main-content").innerHTML = `
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-800">Gastos</h1>
      <p class="text-sm text-gray-400">Junio 2026 · todos los gastos</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100">

      <!-- HEADER DE TABLA -->
      <div class="flex justify-between items-center p-5 border-b border-gray-50">
        <span class="text-sm font-medium text-gray-800">Listado de gastos</span>
        <button onclick="mostrarFormulario()" class="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg">+ Agregar</button>
      </div>

      <!-- TABLA DE GASTOS -->
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-gray-400 border-b border-gray-100">
            <th class="text-left p-3 font-normal">Descripción</th>
            <th class="text-left p-3 font-normal">Categoría</th>
            <th class="text-left p-3 font-normal">Fecha</th>
            <th class="text-right p-3 font-normal">Monto</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody id="tbody-gastos"></tbody>
      </table>

      <!-- FORMULARIO GASTOS NUEVO -->
      <div id="formulario-gasto" class="hidden bg-gray-50 border-t border-gray-100 p-5">
        <p class="text-sm font-medium text-gray-800 mb-4" id="form-titulo">Nuevo gasto</p>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Descripción</label>
            <input id="input-descripcion" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Monto</label>
            <input id="input-monto" type="number" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Fecha</label>
            <input id="input-fecha" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Categoría</label>
            <select id="input-categoria" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400">
              <option value="">Seleccionar...</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button onclick="ocultarFormulario()" class="text-xs bg-gray-100 text-gray-500 px-4 py-2 rounded-lg">Cancelar</button>
          <button onclick="guardarGasto()" class="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg">Guardar</button>
        </div>
      </div>

    </div>
  `;

  await cargarGastos();
}

let gastoEditandoId = null;

async function cargarGastos() {
  const resGastos = await api.getGastos();
  const resCategorias = await api.getCategorias();

  const gastos = resGastos.data;
  const categorias = resCategorias.data;

  // Llenar select de categorías
  const select = document.getElementById("input-categoria");
  select.innerHTML = "<option value=''>Seleccionar...</option>";
  for (let i = 0; i < categorias.length; i++) {
    select.innerHTML += `<option value="${categorias[i].id}">${categorias[i].nombre}</option>`;
  }

  // Llenar tabla
  const tbody = document.getElementById("tbody-gastos");
  tbody.innerHTML = "";

  for (let i = 0; i < gastos.length; i++) {
    const gasto = gastos[i];
    let nombreCategoria = "-";

    for (let j = 0; j < categorias.length; j++) {
      if (categorias[j].id === gasto.categoriaId) {
        nombreCategoria = categorias[j].nombre;
        break;
      }
    }

    tbody.innerHTML += `
      <tr class="border-b border-gray-50">
        <td class="p-3 text-gray-700">${gasto.descripcion}</td>
        <td class="p-3"><span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">${nombreCategoria}</span></td>
        <td class="p-3 text-gray-400">${gasto.fecha}</td>
        <td class="p-3 text-right text-red-500 font-medium">-$${gasto.monto.toLocaleString("es-AR")}</td>
        <td class="p-3">
          <div class="flex gap-2 justify-end">
            <button onclick="editarGasto(${gasto.id})" class="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs">✏️</button>
            <button onclick="eliminarGasto(${gasto.id})" class="bg-red-50 text-red-500 px-2 py-1 rounded-lg text-xs">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }
}

function mostrarFormulario() {
  gastoEditandoId = null;
  document.getElementById("form-titulo").textContent = "Nuevo gasto";
  document.getElementById("input-descripcion").value = "";
  document.getElementById("input-monto").value = "";
  document.getElementById("input-fecha").value = "";
  document.getElementById("input-categoria").value = "";
  document.getElementById("formulario-gasto").classList.remove("hidden");
}

function ocultarFormulario() {
  document.getElementById("formulario-gasto").classList.add("hidden");
}

async function guardarGasto() {
  const descripcion = document.getElementById("input-descripcion").value;
  const monto = Number(document.getElementById("input-monto").value);
  const fecha = document.getElementById("input-fecha").value;
  const categoriaId = Number(document.getElementById("input-categoria").value);

  if (!descripcion || !monto || !fecha || !categoriaId) {
    alert("Completá todos los campos");
    return;
  }

  const gasto = { descripcion, monto, fecha, categoriaId };

  if (gastoEditandoId) {
    await api.updateGasto(gastoEditandoId, gasto);
  } else {
    await api.createGasto(gasto);
  }

  ocultarFormulario();
  await cargarGastos();
}

async function editarGasto(id) {
  const res = await api.getGastos();
  const gasto = res.data.find(function(g) { return g.id === id; });

  gastoEditandoId = id;
  document.getElementById("form-titulo").textContent = "Editar gasto";
  document.getElementById("input-descripcion").value = gasto.descripcion;
  document.getElementById("input-monto").value = gasto.monto;
  document.getElementById("input-fecha").value = gasto.fecha;
  document.getElementById("input-categoria").value = gasto.categoriaId;
  document.getElementById("formulario-gasto").classList.remove("hidden");
}

async function eliminarGasto(id) {
  if (confirm("¿Eliminar gasto?")) {
    await api.deleteGasto(id);
    await cargarGastos();
  }
}