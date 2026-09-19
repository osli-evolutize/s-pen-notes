# S Pen Notes

PWA de anotações manuscritas para tablets Samsung/S Pen, sem framework e sem backend.

## Recursos do MVP
- escrita por Pointer Events com pressão da caneta
- rejeição de toque durante uso da S Pen
- caneta e borracha por traço
- desfazer/refazer
- várias páginas
- fundo branco, pautado ou quadriculado
- título e salvamento automático no IndexedDB
- exportação da página para PNG
- funcionamento offline via Service Worker
- instalável como PWA

## Rodar localmente
Service Worker e PWA precisam de HTTP/HTTPS. Na pasta do projeto, use por exemplo:

    python -m http.server 8080

Depois abra `http://localhost:8080`.

Para testar no tablet, hospede em HTTPS (por exemplo GitHub Pages) ou use um servidor acessível na rede local. Os manuscritos ficam armazenados somente no dispositivo/navegador.

## Estrutura
- `index.html`: interface
- `styles.css`: layout responsivo
- `app.js`: desenho, páginas, IndexedDB e exportação
- `manifest.webmanifest`: PWA
- `sw.js`: cache offline
