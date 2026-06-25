async function renderPresupuestos() {
  document.getElementById("main-content").innerHTML = `
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-800">Presupuesto</h1>
      <p class="text-sm text-gray-400">Junio 2026 · seguimiento mensual</p>
    </div>

    <!-- CARD PRINCIPAL -->
    <div class="flex justify-between items-center p-5 border-b border-gray-50">
  <span class="text-sm font-medium text-gray-800">Presupuesto mensual</span>
  <input id="selector-mes-presupuesto" type="month" onchange="cargarPresupuestos()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
  <button onclick="abrirFormularioPresupuesto()" class="text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">✏️ Editar</button>
  <button onclick="eliminarPresupuestos('1')" class="text-xs bg-red-100 text-red-500 px-3 py-2 rounded-lg">🗑️ Eliminar</button>
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
  await cargarPresupuestos();
}

let presupuestoEditandoID = null;

async function cargarPresupuestos() {
  const resPresupuestos = await api.getPresupuestos();
  const resGastos = await api.getGastos();

  const presupuestos = resPresupuestos.data;
  const gastos = resGastos.data;

  // selec
  const select = document.getElementById("selector-mes-presupuesto");
const mesSeleccionado = select.value;
select.innerHTML = "";
for (let i = 0; i < presupuestos.length; i++) {
    select.innerHTML += `<option value="${presupuestos[i].mes}">${presupuestos[i].mes}</option>`;
}

if (mesSeleccionado) {
    select.value = mesSeleccionado;
} else {
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
    select.value = mesActual; 
}
  const mes = select.value;
      if (!mes) {
    document.getElementById("presupuesto-monto").textContent = "Sin presupuesto";
    document.getElementById("presupuesto-gastado").textContent = "Gastado: $0";
    document.getElementById("presupuesto-pct").textContent = "0% usado";
    document.getElementById("presupuesto-bar").style.width = "0%";
    document.getElementById("stat-presupuesto").textContent = "$0";
    document.getElementById("stat-gastado").textContent = "$0";
    document.getElementById("stat-disponible").textContent = "$0";
    document.querySelector('[onclick^="abrirFormularioPresupuesto"]').textContent = "+ Agregar";
    document.getElementById("lista-categorias").innerHTML = "<p class='text-sm text-gray-400'>No hay gastos este mes</p>";
    presupuestoEditandoID = null;
    
    return;
  }
  
  const presupuesto = presupuestos.find(p => p.mes === mes);
  if (!presupuesto) {
    document.getElementById("presupuesto-monto").textContent = "Sin presupuesto";
    document.getElementById("presupuesto-gastado").textContent = "Gastado: $0";
    document.getElementById("presupuesto-pct").textContent = "0% usado";
    document.getElementById("presupuesto-bar").textContent = "0%";
    document.getElementById("stat-presupuesto").textContent = "$0";
    document.getElementById("stat-gastado").textContent = "$0";
    document.getElementById("stat-disponible").textContent = "$0";
    document.querySelector('[onclick^="abrirFormularioPresupuesto"]').textContent = "+ Agregar";
    presupuestoEditandoID = null;
    await cargarGastosPorCategoria(mes);
    return;
    
  }

  const totalGastado = gastos.reduce((acc, g) => acc + g.monto, 0);
  const disponible = presupuesto.monto - totalGastado;
  const porcentaje = ((totalGastado / presupuesto.monto) * 100).toFixed(0);
  presupuestoEditandoID = presupuesto.id;

  //mostrar datos 
  document.getElementById("presupuesto-monto").textContent = `$${presupuesto.monto.toLocaleString()}`;
  document.getElementById("presupuesto-gastado").textContent = `Gastado: $${totalGastado.toLocaleString()}`;
  document.getElementById("presupuesto-pct").textContent = `${porcentaje}% usado`;
  document.getElementById("presupuesto-bar").style.width = `${porcentaje}%`;
  document.getElementById("stat-presupuesto").textContent = `$${presupuesto.monto.toLocaleString()}`;
  document.getElementById("stat-gastado").textContent = `$${totalGastado.toLocaleString()}`;
  document.getElementById("stat-disponible").textContent = `$${disponible.toLocaleString()}`;
  document.querySelector('[onclick^="eliminarPresupuestos"]').setAttribute('onclick', `eliminarPresupuestos('${presupuesto.id}')`);
  document.querySelector('[onclick^="abrirFormularioPresupuesto"]').textContent = "✏️ Editar";

  await cargarGastosPorCategoria(mes);
}

function mostrarFormularioPresupuesto() {
  presupuestoEditandoID = null;
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

  const presupuestoData = { monto, mes };
  if (presupuestoEditandoID) {
    await api.updatePresupuestos(presupuestoEditandoID, presupuestoData);
  } else {
    await api.createPresupuestos(presupuestoData);
  }
  ocultarFormularioPresupuesto();
  await cargarPresupuestos();
}

async function editarPresupuesto(id) {
  const res = await api.getPresupuestos();
  const presupuesto = res.data.find(p => p.id === id);
  presupuestoEditandoID = id;

  document.getElementById("input-monto-presupuesto").value = presupuesto.monto;
  document.getElementById("input-mes-presupuesto").value = presupuesto.mes;
  document.getElementById("formulario-presupuesto").classList.remove("hidden");
}

async function eliminarPresupuestos(id) {
  if (confirm("¿Eliminar presupuesto?")) {
    await api.deletePresupuestos(id);
    await cargarPresupuestos();
  }
}

function abrirFormularioPresupuesto() {
  if (presupuestoEditandoID) {
    editarPresupuesto(presupuestoEditandoID);
  } else {
    mostrarFormularioPresupuesto();
  }
}

//gastos por categoria 

async function cargarGastosPorCategoria(mes) {
  const resGastos = await api.getGastos();
  const resCategorias = await api.getCategorias();

  const gastos = resGastos.data;
  const categorias = resCategorias.data;

  const gastosDelMes = [];
  for (let i = 0; i < gastos.length; i++) {
    if (gastos[i].fecha.startsWith(mes)) {
      gastosDelMes.push(gastos[i]);
    }
  }

  let html = "";

  for (let i = 0; i < categorias.length; i++) {
    const cat = categorias[i];
    let totalCategoria = 0;

    for (let j = 0; j < gastosDelMes.length; j++) {
      if (gastosDelMes[j].categoriaId === Number(cat.id)) {
        totalCategoria += gastosDelMes[j].monto;
      }
    }

    if (totalCategoria > 0) {
      html += `
        <div class="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
          <div class="flex items-center gap-2">
            <span>${cat.icono}</span>
            <span class="text-sm text-gray-700">${cat.nombre}</span>
          </div>
          <span class="text-sm font-medium text-gray-800">$${totalCategoria.toLocaleString()}</span>
        </div>
      `;
    }
  }

  document.getElementById("lista-categorias").innerHTML = html || "<p class='text-sm text-gray-400'>No hay gastos este mes</p>";
}