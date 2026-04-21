# PLAN DE IMPLEMENTACIÓN: Dashboard con 3 Vistas Separadas
## Para Claude Code - CoimpactoB

**Objetivo:** Reorganizar el dashboard actual en 3 vistas independientes según el rol del usuario:
1. **Dashboard de Gerencia** - Vista ejecutiva con métricas globales
2. **Dashboard de Empresas/Bancos** - Vista de cartera externa y due diligence
3. **Dashboard de Usuarios** - Vista personalizada por miembro ACAP

**Tiempo estimado:** 3 horas
**Archivos a crear/modificar:** ~15 archivos nuevos + 3 modificaciones

---

## FASE 0: CAMBIOS EN ARQUITECTURA PRINCIPAL

### 1. **Modificar `src/App.jsx`** (CAMBIO CLAVE)
- Agregar estado para `userRole` ('gerencia' | 'empresa' | 'usuario')
- Agregar selector de rol en interfaz (para testing)
- Pasar `userRole` al componente Platform

```javascript
const [userRole, setUserRole] = useState('usuario') // Simular rol
```

### 2. **Modificar `src/components/Platform.jsx`**
- El módulo "dashboard" ahora debe renderizar 3 vistas diferentes según `userRole`
- Remover la lógica anterior de renderizado único
- Agregar nav tabs para cambiar entre vistas (si estamos en modo testing)

---

## FASE 1: CREAR ESTRUCTURA DE CARPETAS

```
src/components/dashboards/
├── DashboardGerencia.jsx          ← Vista de gerencia (métricas globales)
├── DashboardEmpresasBancos.jsx    ← Vista de cartera externa
├── DashboardUsuarios.jsx           ← Vista personalizada por usuario
└── shared/
    ├── KPICard.jsx                 ← Componente reutilizable
    ├── MetricCard.jsx              ← Variante de métrica
    ├── ChartContainer.jsx          ← Contenedor para gráficos
    └── AlertBanner.jsx             ← Banners de alertas
```

---

## FASE 2: DASHBOARD DE GERENCIA
**Ubicación:** `src/components/dashboards/DashboardGerencia.jsx`

### Componentes a incluir:
1. **KPIs principales (4 cards en fila):**
   - Total Ahorro: $97.5M (↑ 34.2% vs 2024)
   - Total Préstamos: $21.8M (↑ 18.5% vs 2024)
   - Comunidades: 17 (↑ 6.2% nuevas)
   - Miembros: 246 (↑ 22.1% vs 2024)

2. **Alerta del Agente Analista IA:**
   - Banner amarillo con icono y mensaje
   - "El Agente Analista detecta que 'Kayetamana' tiene 98% de cumplimiento..."

3. **Evolución Ahorro y Crédito (LineChart):**
   - Dos líneas: Ahorro (naranja) y Crédito (azul)
   - Periodo: Enero - Diciembre 2025
   - Crecimiento: +54%

4. **Mapa de Impacto Territorial:**
   - Mostrar "No se pudo cargar el mapa" (placeholder)
   - 17 comunidades activas, 7 departamentos

5. **Top 5 ACAPs por Ahorro (BarChart horizontal):**
   - Izshimana: $18.2M
   - Masamana: $14.8M
   - Kayetamana: $12.1M
   - Yoduijoné: $9.6M
   - Jojoncito: $8.4M

---

## FASE 3: DASHBOARD DE EMPRESAS/BANCOS
**Ubicación:** `src/components/dashboards/DashboardEmpresasBancos.jsx`

### Componentes a incluir:
1. **KPIs (4 cards):**
   - Cartera Externa Total: $24.3M
   - % Cartera en Riesgo: 9.79% (⚠️ amarillo)
   - Índice de Mora: 9.79%
   - ROI Social Estimado: 3.2x (↑ 12%)

2. **Rating por Comunidad ACAP (DataTable):**
   - Columnas: Comunidad | Score IA | Miembros | Ahorro | % Mora | Pagos
   - 8 filas con datos de ACAPs
   - Color-coding: AAA (verde), AA, A, BBB

3. **Distribución de Cartera (PieChart):**
   - 100% Vigente (verde), En Riesgo (amarillo), Vencida (rojo)

4. **Benchmark Sectorial (2 métricas lado a lado):**
   - Credimpacto: 9.79% (naranja)
   - Promedio Microfinanciero: 14.5% (gris)

5. **Gobernanza de Datos:**
   - Placeholder con % de completitud

6. **Informe de Due Diligence (botón):**
   - Link a "Solicitar informe"

---

## FASE 4: DASHBOARD DE USUARIOS
**Ubicación:** `src/components/dashboards/DashboardUsuarios.jsx`

### Componentes a incluir:

1. **Header personalizado:**
   - "Hola, Ana Lucía 👋"
   - "Comunidad Izshimana · Putumayo"

2. **3 Cards principales en fila:**
   - Meta de Ahorro: 73% del ciclo ($730K de $1M COP meta)
     - CircleProgress visual
   - Mi Préstamo: "Al día" con detalles
     - Monto: $850K COP
     - Cuotas pagadas: 7 de 12
     - Próximo pago: 28 Abr 2026
     - Cuota: $85.5K COP
   - Mi Participación:
     - Reuniones asistidas: 18 de 20
     - Capacitaciones completadas: 5
     - Evaluaciones respondidas: 3

3. **Mi Ahorro por Ciclo (BarChart):**
   - 6 ciclos anteriores + Actual
   - Valores crecientes: $120K → $730K

4. **Mis Logros (3 badges):**
   - ✨ Ahorradora Consistente
   - ✓ Sin mora 12 meses
   - 🚀 Proyecto Aprobado

5. **Notificaciones:**
   - "Próxima reunión ACAP: 22 Abr, 10:00 AM"
   - Otras notificaciones recientes

---

## FASE 5: COMPONENTES COMPARTIDOS
**Ubicación:** `src/components/dashboards/shared/`

### KPICard.jsx
```javascript
// Props: icon, label, value, bg, trend, comparison
// Ejemplo: icon={PiggyBank}, label="Total Ahorro", value="$97.5M", trend="+34.2%"
```

### MetricCard.jsx
- Variante más simple de KPICard
- Sin icono, solo label + valor

### ChartContainer.jsx
- Wrapper para gráficos con título y leyenda

### AlertBanner.jsx
- Banner reutilizable para alertas de IA
- Props: type (info|warning|danger), title, message, icon

---

## FASE 6: MODIFICAR PLATFORM.jsx

En el switch de renderizado del módulo 'dashboard':

```javascript
case 'dashboard':
  if (!userRole) return <div>Cargando...</div>
  if (userRole === 'gerencia') return <DashboardGerencia {...sharedProps} />
  if (userRole === 'empresa') return <DashboardEmpresasBancos {...sharedProps} />
  if (userRole === 'usuario') return <DashboardUsuarios {...sharedProps} />
  return <DashboardGerencia {...sharedProps} /> // default
```

---

## FASE 7: DATOS DISPONIBLES EN mockData.js

Ya existen:
- ✅ `acaps` - 18 comunidades con datos completos
- ✅ `credits` - créditos internos y externos
- ✅ `members` - miembros individuales
- ✅ `monthlyTrends` - datos de enero a diciembre
- ✅ `zones` - 5 zonas territoriales
- ✅ `portfolioSummary` - resumen de cartera

No existen (hay que crearlos):
- ⚠️ `currentUser` - usuario logueado (usar mock para testing)
- ⚠️ `externalFinancingSources` - fuentes externas (BanColombia, USAID, etc.)
- ⚠️ `debtorsList` - lista de deudores para dashboard empresas

---

## CHECKLIST DE IMPLEMENTACIÓN

### Paso 1: Estructura (15 min)
- [ ] Crear carpeta `/src/components/dashboards/`
- [ ] Crear carpeta `/src/components/dashboards/shared/`
- [ ] Crear archivos vacíos de componentes

### Paso 2: Componentes Compartidos (15 min)
- [ ] KPICard.jsx
- [ ] MetricCard.jsx
- [ ] ChartContainer.jsx
- [ ] AlertBanner.jsx

### Paso 3: Dashboard de Gerencia (45 min)
- [ ] Layout principal (grid de 2 columnas)
- [ ] 4 KPI Cards principales
- [ ] AlertBanner de IA
- [ ] LineChart evolución ahorro/crédito
- [ ] Placeholder mapa
- [ ] BarChart top 5 ACAPs

### Paso 4: Dashboard de Empresas (45 min)
- [ ] 4 KPI Cards
- [ ] DataTable de ACAPs con ratings
- [ ] PieChart cartera
- [ ] Benchmark sectorial
- [ ] Gobernanza datos
- [ ] Botón due diligence

### Paso 5: Dashboard de Usuarios (45 min)
- [ ] Header personalizado
- [ ] 3 cards principales
- [ ] BarChart ciclos
- [ ] Badges de logros
- [ ] Notificaciones

### Paso 6: Integración (15 min)
- [ ] Modificar App.jsx con selector de rol
- [ ] Modificar Platform.jsx para renderizar 3 vistas
- [ ] Pasar userRole como prop
- [ ] Testing de cambios entre vistas

### Paso 7: Refinamiento (15 min)
- [ ] Ajustar estilos
- [ ] Validar responsive
- [ ] Testing de datos

---

## NOTAS IMPORTANTES

1. **Datos Mock:** Usa `mockData.js` existente. Los datos ya están ahí.
2. **Estilos:** Mantener la paleta actual (azul marino #1a3c6e, naranja #F97316)
3. **Responsive:** Asegurar que funcione en mobile/tablet
4. **Re-render:** Cada dashboard debe re-renderizar cuando cambia userRole
5. **Cartera:** Este módulo ya existe en el repo (CarteraModule.jsx), no duplicar

---

## DESPUÉS DE ESTO...

Una vez el diseño esté funcional:
1. Conectar a Azure Data Lake (próxima fase)
2. Reemplazar mockData con datos reales
3. Agregar filtros interactivos por mes/zona/ACAP
4. Sistema de permisos reales vs mock

---

**Autor:** Claude
**Fecha:** 21 Abril 2026
**Estado:** Listo para Claude Code