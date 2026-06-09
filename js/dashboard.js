function renderDashboard() {
  document.getElementById("main-content").innerHTML = `
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-800">Dashboard</h1>
      <p class="text-sm text-gray-400">Junio 2026 · resumen del mes</p>
    </div>

    <!-- TARJETAS -->
    <div class="grid grid-cols-2 gap-4 mb-6">

      <div class="bg-indigo-600 rounded-2xl p-5 text-white col-span-2 md:col-span-1">
        <p class="text-xs opacity-75 mb-1">Balance disponible</p>
        <p class="text-3xl font-medium mb-4" id="balance">$0</p>
        <div class="flex gap-8">
          <div>
            <p class="text-xs opacity-65 mb-1">Ingresos</p>
            <p class="text-sm font-medium text-green-300" id="ingresos">$0</p>
          </div>
          <div>
            <p class="text-xs opacity-65 mb-1">Gastos</p>
            <p class="text-sm font-medium text-red-300" id="total-gastos">$0</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center gap-3">
        <p class="text-xs text-gray-400">Presupuesto usado</p>
        <div class="relative w-24 h-24">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="36" fill="none" stroke="#f0f0ec" stroke-width="10"/>
            <circle id="donut-circle" cx="48" cy="48" r="36" fill="none" stroke="#4f46e5" stroke-width="10"
              stroke-dasharray="226.2" stroke-dashoffset="226.2" stroke-linecap="round"
              transform="rotate(-90 48 48)"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-lg font-medium text-gray-800" id="donut-pct">0%</span>
            <span class="text-xs text-gray-400">usado</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs text-gray-400">Total gastado</span>
          <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
          </div>
        </div>
        <p class="text-xl font-medium text-gray-800 mb-1" id="stat-gastos">$0</p>
        <div class="h-1 bg-gray-100 rounded-full mt-3"><div id="bar-gastos" class="h-1 bg-indigo-600 rounded-full" style="width:0%"></div></div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-5">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs text-gray-400">Mayor categoría</span>
          <div class="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
        <p class="text-xl font-medium text-gray-800 mb-1" id="stat-categoria">-</p>
        <span class="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full" id="stat-categoria-pct"></span>
      </div>

    </div>

    <!-- TABLA ULTIMOS GASTOS -->
    <div class="bg-white rounded-2xl border border-gray-100 p-5">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm font-medium text-gray-800">Últimos gastos</span>
        <button onclick="navigate('gastos')" class="text-xs text-indigo-600">Ver todos →</button>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-gray-400 border-b border-gray-100">
            <th class="text-left pb-2 font-normal">Descripción</th>
            <th class="text-left pb-2 font-normal">Categoría</th>
            <th class="text-left pb-2 font-normal">Fecha</th>
            <th class="text-right pb-2 font-normal">Monto</th>
          </tr>
        </thead>
        <tbody id="tabla-gastos"></tbody>
      </table>
    </div>
  `;

  cargarDashboard();
}

    async function cargarDashboard() {
  try {
    const [resGastos, resCategorias, resPresupuestos] = await Promise.all([
      api.getGastos(),
      api.getCategorias(),
      api.getPresupuestos()
    ]);

    const gastos = resGastos.data;
    const categorias = resCategorias.data;
    const presupuesto = resPresupuestos.data[0]?.monto || 0;

    const totalGastos = gastos.reduce(function(acc, g) { return acc + g.monto; }, 0);
    const balance = presupuesto - totalGastos;
    const pct = presupuesto > 0 ? Math.round((totalGastos / presupuesto) * 100) : 0;

    // Balance card
    document.getElementById("balance").textContent = "$" + balance.toLocaleString("es-AR");
    document.getElementById("ingresos").textContent = "$" + presupuesto.toLocaleString("es-AR");
    document.getElementById("total-gastos").textContent = "-$" + totalGastos.toLocaleString("es-AR");
    document.getElementById("stat-gastos").textContent = "$" + totalGastos.toLocaleString("es-AR");

    // Donut
    const offset = 226.2 - (pct / 100) * 226.2;
    document.getElementById("donut-circle").style.strokeDashoffset = offset;
    document.getElementById("donut-pct").textContent = pct + "%";
    document.getElementById("bar-gastos").style.width = pct + "%";

    // Mayor categoría
    const porCategoria = {};
    gastos.forEach(function(g) {
      porCategoria[g.categoriaId] = (porCategoria[g.categoriaId] || 0) + g.monto;
    });
    const mayorId = Object.keys(porCategoria).reduce(function(a, b) {
      return porCategoria[a] > porCategoria[b] ? a : b;
    }, null);
    if (mayorId) {
      const cat = categorias.find(function(c) { return c.id == mayorId; });
      const catPct = Math.round((porCategoria[mayorId] / totalGastos) * 100);
      document.getElementById("stat-categoria").textContent = "$" + porCategoria[mayorId].toLocaleString("es-AR");
      document.getElementById("stat-categoria-pct").textContent = (cat ? cat.nombre : "") + " · " + catPct + "%";
    }

    // Tabla
    const tbody = document.getElementById("tabla-gastos");
    tbody.innerHTML = gastos.slice(-5).reverse().map(function(g) {
      const cat = categorias.find(function(c) { return c.id === g.categoriaId; });
      return `
        <tr class="border-b border-gray-50 last:border-0">
          <td class="py-3 text-gray-700">${g.descripcion}</td>
          <td class="py-3"><span class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">${cat ? cat.nombre : "-"}</span></td>
          <td class="py-3 text-gray-400">${g.fecha}</td>
          <td class="py-3 text-right text-red-500 font-medium">-$${g.monto.toLocaleString("es-AR")}</td>
        </tr>
      `;
    }).join("");

  } catch(error) {
    console.error("Error cargando dashboard:", error);
  }
}