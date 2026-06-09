async function renderPresupuestos() {
  document.getElementById("main-content").innerHTML = `
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-800">Presupuesto</h1>
      <p class="text-sm text-gray-400">Junio 2026 · seguimiento mensual</p>
    </div>

    <!-- CARD PRINCIPAL -->
    <div class="bg-white rounded-2xl border border-gray-100 mb-4">
      <div class="flex justify-between items-center p-5 border-b border-gray-50">
        <span class="text-sm font-medium text-gray-800">Presupuesto mensual</span>
        <button onclick="mostrarFormularioPresupuesto()" class="text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">✏️ Editar</button>
      </div>

      <div class="p-5">
        <div class="text-4xl font-medium text-gray-800 mb-1" id="presupuesto-monto">Cargando...</div>
        <div class="text-sm text-gray-400 mb-6">Presupuesto mensual</div>

        <div class="mb-6">
          <div class="flex justify-between text-xs text-gray-400 mb-2">
            <span id="presupuesto-gastado">Gastado: $0</span>
            <span id="presupuesto-pct">0% usado</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div id="presupuesto-bar" class="h-2 bg-indigo-600 rounded-full" style="width:0%"></div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="text-xs text-gray-400 mb-1">Presupuesto</div>
            <div class="text-base font-medium text-gray-800" id="stat-presupuesto">$0</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="text-xs text-gray-400 mb-1">Gastado</div>
            <div class="text-base font-medium text-red-500" id="stat-gastado">$0</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="text-xs text-gray-400 mb-1">Disponible</div>
            <div class="text-base font-medium text-green-600" id="stat-disponible">$0</div>
          </div>
        </div>
      </div>

      <!-- FORMULARIO PRESUPUESTO -->
      <div id="formulario-presupuesto" class="hidden bg-gray-50 border-t border-gray-100 p-5">
        <p class="text-sm font-medium text-gray-800 mb-4">Editar presupuesto</p>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Monto mensual</label>
            <input id="input-monto-presupuesto" type="number" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Mes</label>
            <input id="input-mes-presupuesto" type="month" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button onclick="ocultarFormularioPresupuesto()" class="text-xs bg-gray-100 text-gray-500 px-4 py-2 rounded-lg">Cancelar</button>
          <button onclick="guardarPresupuesto()" class="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg">Guardar</button>
        </div>
      </div>
    </div>

    <!-- CARD GASTOS POR CATEGORÍA -->
    <div class="bg-white rounded-2xl border border-gray-100">
      <div class="flex justify-between items-center p-5 border-b border-gray-50">
        <span class="text-sm font-medium text-gray-800">Gastos por categoría</span>
      </div>
      <div id="lista-categorias" class="p-5"></div>
    </div>
  `;

  await cargarPresupuesto();
}

let presupuestoId = null;

async function cargarPresupuesto() {
  const resGastos = await api.getGastos();
  const resCategorias = await api.getCategorias();
  const resPresupuestos = await api.getPresupuestos();

  const gastos = resGastos.data;
  const categorias = resCategorias.data;
  const presupuesto = resPresupuestos.data[0];

  if (!presupuesto) {
    document.getElementById("presupuesto-monto").textContent = "Sin presupuesto";
    return;
  }

  presupuestoId = presupuesto.id;

  // Total gastado
  let totalGastos = 0;
  for (let i = 0; i < gastos.length; i++) {
    totalGastos += gastos[i].monto;
  }

  const disponible = presupuesto.monto - totalGastos;
  const pct = Math.round((totalGastos / presupuesto.monto) * 100);

  // Mostrar valores
  document.getElementById("presupuesto-monto").textContent = "$" + presupuesto.monto.toLocaleString("es-AR");
  document.getElementById("presupuesto-gastado").textContent = "Gastado: $" + totalGastos.toLocaleString("es-AR");
  document.getElementById("presupuesto-pct").textContent = pct + "% usado";
  document.getElementById("presupuesto-bar").style.width = pct + "%";
  document.getElementById("stat-presupuesto").textContent = "$" + presupuesto.monto.toLocaleString("es-AR");
  document.getElementById("stat-gastado").textContent = "$" + totalGastos.toLocaleString("es-AR");
  document.getElementById("stat-disponible").textContent = "$" + disponible.toLocaleString("es-AR");

  // Gastos por categoría
  const porCategoria = {};
  for (let i = 0; i < gastos.length; i++) {
    const g = gastos[i];
    if (!porCategoria[g.categoriaId]) {
      porCategoria[g.categoriaId] = 0;
    }   
    porCategoria[g.categoriaId] += g.monto;
  }

  const lista = document.getElementById("lista-categorias");
  lista.innerHTML = "";

  for (let i = 0; i < categorias.length; i++) {
    const cat = categorias[i];
    const monto = porCategoria[cat.id] || 0;
    const catPct = totalGastos > 0 ? Math.round((monto / totalGastos) * 100) : 0;

  

    lista.innerHTML += `
  <div class="flex items-center gap-3 mb-4">
    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style="background:${cat.color};">${cat.icono}</div>
    <div class="flex-1">
      <div class="text-xs font-medium text-gray-800 mb-1">${cat.nombre}</div>
      <div class="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-1 rounded-full" style="width:${catPct}%;background:${cat.color};filter:brightness(0.7);"></div>
      </div>
    </div>
    <div class="text-xs text-gray-400 whitespace-nowrap">${monto === 0 ? "Sin gastos" : "$" + monto.toLocaleString("es-AR") + " · " + catPct + "%"}</div>
  </div>
`;
  }
}

function mostrarFormularioPresupuesto() {
  document.getElementById("input-monto-presupuesto").value = "";
  document.getElementById("input-mes-presupuesto").value = "";
  document.getElementById("formulario-presupuesto").classList.remove("hidden");
}

function ocultarFormularioPresupuesto() {
  document.getElementById("formulario-presupuesto").classList.add("hidden");
}

async function guardarPresupuesto() {
  const monto = Number(document.getElementById("input-monto-presupuesto").value);
  const mes = document.getElementById("input-mes-presupuesto").value;

  if (!monto || !mes) {
    alert("Completá todos los campos");
    return;
  }

  const presupuesto = { monto, mes };

  if (presupuestoId) {
    await api.updatePresupuesto(presupuestoId, presupuesto);
  } else {
    await api.createPresupuesto(presupuesto);
  }

  ocultarFormularioPresupuesto();
  await cargarPresupuesto();
}