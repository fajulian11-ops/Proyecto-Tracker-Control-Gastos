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
  await cargarPresupuestos();
}
async function cargarPresupuestos(){
  const mes= new Date().toISOString().slice(0,7);

  //pido los datos a la appi 

  const resPresupuestos = await axios.get("http://localhost:3000/presupuestos");
  const resGastos = await axios.get("http://localhost:3000/gastos");

  const presupuesto = resPresupuestos.data.find(p => p.mes === mes);
  const gastos = resGastos.data;
  if (!presupuesto){
    document.getElementById("presupuesto-monto").textContent= "Sin presupuesto";
  return;
  }
  const totalGastado = gastos.reduce((acc ,g) =>acc+ g.monto,0);
  const disponible = presupuesto.limite - totalGastado;

  //calculo de cuanto porcentaje del presupuesto de uso 
  const porcentaje = Math.min(Math.round(totalGastado / presupuesto.limite*100),100);

  document.getElementById("presupuesto-monto").textContent=`$${presupuesto.limite.toLocaleString()}`;
  document.getElementById("presupuesto-gastado").textContent = `Gastado: $${totalGastado.toLocaleString()}`;
  document.getElementById("presupuesto-pct").textContent = `${porcentaje}% usado`;
  document.getElementById("presupuesto-bar").style.width = `${porcentaje}%`;
  document.getElementById("stat-presupuesto").textContent = `$${presupuesto.limite.toLocaleString()}`;
  document.getElementById("stat-gastado").textContent = `$${totalGastado.toLocaleString()}`;

document.getElementById("stat-disponible").textContent = `$${disponible.toLocaleString()}`;
}

//presupuesto mensual BOTON
function mostrarFormularioPresupuesto(){
  document.getElementById("formulario-presupuesto").classList.remove("hidden");
}
function ocultarFormularioPresupuesto(){
  document.getElementById("formulario-presupuesto").classList.add("hidden");
}

//boton guardar presupuesto (enviarlos a la api)
async function guardarPresupuesto(){
const monto= document.getElementById("input-monto-presupuesto").value;
const mes= document.getElementById("input-mes-presupuesto").value;
const resPresupuestos =await axios.get("http://localhost:3000/presupuestos");
const presupuesto = resPresupuestos.data.find(p => p.mes === mes);
if (presupuesto) {
    await axios.patch(`http://localhost:3000/presupuestos/${presupuesto.id}`, { limite: Number(monto), mes });
  } else {
    await axios.post("http://localhost:3000/presupuestos", { limite: Number(monto), mes });
  }
  // .patch (edita) .post (crea)
  ocultarFormularioPresupuesto();
  await cargarPresupuestos();
}