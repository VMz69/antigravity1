# 🚀 Guía Maestra: Automatización y Orquestación en Antigravity

Este documento es una bitácora técnica y guía de replicación para el sistema de **Generación de Documentación Técnica** desarrollado por **Víctor (VMz-Dev)**.

---

## 📋 Tabla de Contenidos
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Arquitectura de Desacoplamiento](#arquitectura-de-desacoplamiento)
3. [El Triángulo de Poder (MD, YAML, HTML)](#el-triángulo-de-poder)
4. [El Orquestador: ¿Cómo y por qué funciona?](#el-orquestador)
5. [Configuración de Agentes (Automatización)](#automatización)
6. [Guía de Replicación Paso a Paso](#guía-de-replicación)
7. [Dudas Técnicas Resueltas (FAQ)](#faq)

---

## 🧠 Resumen del Proyecto <a name="resumen-del-proyecto"></a>
Este sistema utiliza **Infraestructura como Código (IaC)** para automatizar la creación de sitios web. En lugar de editar el HTML manualmente, el desarrollador gestiona el contenido en archivos Markdown y permite que un **Orquestador** ensamble el producto final.

* **Categoría:** Automatización de Desarrollo Web.
* **Entorno:** Google Antigravity (Agentic IDE).
* **Paradigma:** Generación de Sitios Estáticos (SSG) en tiempo de construcción (Build-time).

---

## 🏗 Arquitectura de Desacoplamiento <a name="arquitectura-de-desacoplamiento"></a>
El éxito de este flujo radica en separar el proyecto en tres capas que no dependen entre sí:
* **Capa de Contenido:** Solo datos puros (archivos `.md`).
* **Capa de Lógica:** Reglas de ensamblaje (archivo `.yaml`).
* **Capa de Presentación:** El diseño visual (archivo `.html` de plantilla).

---

## 📐 El Triángulo de Poder <a name="el-triángulo-de-poder"></a>

| Componente | Formato | Rol en el Sistema |
| :--- | :--- | :--- |
| **Contenido** | `.md` | Actúan como "piezas de LEGO" o componentes (Header, Main, Footer). |
| **Mapa** | `.yaml` | Es la "receta" que indica qué piezas usar y en qué orden. |
| **Molde** | `.html` | Estructura base con marcadores `{{ }}` donde se inyectará la información. |

---

## ⚙️ El Orquestador <a name="el-orquestador"></a>
El **Orquestador** es el agente de IA dentro de Antigravity que realiza el trabajo sucio.

### ¿Cómo funciona el Pre-procesado?
El HTML estándar **no entiende** instrucciones como `{{ content }}` o bucles `{% for %}`. El Orquestador funciona como un traductor:
1.  Escanea el molde (Template).
2.  Busca los marcadores de posición entre llaves.
3.  **Busca y Reemplaza:** Sustituye las llaves por el texto real de los MD.
4.  **Generación Física:** Crea un nuevo archivo `index.html` en la carpeta `/public` que el navegador sí puede leer.

---

## 🤖 Automatización <a name="automatización"></a>
### Directorio `.antigravity/`
**CRÍTICO:** Esta carpeta oculta contiene el estado del IDE y la memoria del Orquestador. **No debe borrarse**, o el sistema perderá la sincronización de los archivos.

### Archivo `AGENTS.md`
Es el manual de operaciones. Aquí se definen reglas como:
* "Observar cambios en tiempo real en la carpeta `/content`".
* "Regenerar el sitio automáticamente al guardar (Watch Mode)".

---

## 🛠 Guía de Replicación Paso a Paso <a name="guía-de-replicación"></a>

1.  **Crear Estructura:** Carpetas `content/`, `config/`, `templates/` y `public/`.
2.  **Preparar MDs:** Escribir el contenido en `content/uno.md`.
3.  **Configurar YAML:** En `config/ejemplo.yaml`, listar los archivos fuente.
4.  **Diseñar el Molde:** En `templates/layout.html`, colocar `{{ content }}` dentro del cuerpo.
5.  **Activar el Agente:** En el chat de Antigravity, decir: *"Lee AGENTS.md y activa el modo de observación permanente"*.

---

## ❓ Dudas Técnicas Resueltas (FAQ) <a name="faq"></a>

**P: ¿Si tengo 50 MDs tengo que editarlos todos para cambiar el diseño?**
R: No. Solo editas el archivo en `templates/layout.html` y el orquestador actualiza los 50 resultados en milisegundos.

**P: ¿Por qué no se actualizaba solo al principio?**
R: Porque el agente necesita un "permiso de ejecución" inicial para activar el motor de monitoreo de archivos (Watchdog).

**P: ¿Puedo usar los MD como componentes?**
R: Sí. Puedes tener un MD para el encabezado y otro para el cuerpo, y ordenarlos cronológicamente o por jerarquía en el YAML.

---
*Documentación generada para el aprendizaje de Antigravity - Abril 2026*