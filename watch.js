const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { marked } = require('marked');

function build() {
    console.log('\n[Orquestador] Detectado cambio, construyendo sitio...');
    try {
        const configPath = path.join(__dirname, 'config', 'ejemplo.yaml');
        const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

        const templatePath = path.join(__dirname, config.pipeline.template);
        let template = fs.readFileSync(templatePath, 'utf8');

        let globalTitulo = 'Mi primer avance';
        let globalAutor = 'Víctor (VMz)';

        // Extraer variables globales de uno.md (o la primera fuente)
        const primeraFuente = path.join(__dirname, config.pipeline.fuentes[0]);
        if (fs.existsSync(primeraFuente)) {
            const content = fs.readFileSync(primeraFuente, 'utf8');
            const match = content.match(/---\n([\s\S]*?)\n---/);
            if (match) {
                const fm = yaml.load(match[1]);
                globalTitulo = fm.titulo || globalTitulo;
                globalAutor = fm.autor || globalAutor;
            }
        }

        let htmlContents = '';
        
        // Regex para capturar el bucle for del layout
        const loopRegex = /\{%\s*for\s+archivo\s+in\s+pipeline\.fuentes\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/;
        const loopMatch = template.match(loopRegex);
        const loopBodyTemplate = loopMatch ? loopMatch[1] : '';

        config.pipeline.fuentes.forEach(fuente => {
            const contentPath = path.join(__dirname, fuente);
            if (fs.existsSync(contentPath)) {
                const rawContent = fs.readFileSync(contentPath, 'utf8');
                
                const frontmatterRegex = /---\n([\s\S]*?)\n---/;
                const match = rawContent.match(frontmatterRegex);
                let markdown = rawContent;
                
                if (match) {
                    markdown = rawContent.replace(frontmatterRegex, '').trim();
                }

                // Convertir markdown a HTML
                const html = marked.parse(markdown).trim();
                
                if (loopBodyTemplate) {
                    htmlContents += loopBodyTemplate.replace('{{ archivo.content }}', html);
                } else {
                    htmlContents += `\n<section class="post">\n${html}\n</section>\n<hr>`;
                }
            }
        });

        // Reemplazos de variables globales
        template = template.replace('{{ titulo }}', globalTitulo);
        template = template.replace('{{ pipeline.nombre }}', config.pipeline.nombre);
        template = template.replace('{{ autor }}', globalAutor);
        
        // Reemplazo del bloque for con el contenido procesado
        if (loopMatch) {
            template = template.replace(loopRegex, htmlContents);
        }

        const outPath = path.join(__dirname, config.pipeline.salida);
        fs.writeFileSync(outPath, template);
        console.log('[Orquestador] ¡Construcción completada exitosamente! ->', config.pipeline.salida);
    } catch (error) {
        console.error('[Orquestador] Error durante la construcción:', error);
    }
}

// Ejecutar build inicial (que aplicará la eliminación de la línea que acabas de hacer en uno.md)
build();

// Iniciar modo observación
const chokidar = require('chokidar');
const watcher = chokidar.watch([
    path.join(__dirname, 'content'),
    path.join(__dirname, 'config'),
    path.join(__dirname, 'templates')
], {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true
});

watcher
  .on('add', build)
  .on('change', build)
  .on('unlink', build);

console.log('[Orquestador] 👁️  Modo Watch activado. Observando cambios en content/, config/ y templates/ ...');
