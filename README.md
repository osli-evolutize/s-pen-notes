# S Pen Notes
PWA de caderno manuscrito para tablets Samsung/S Pen, sem framework e sem backend.

## Recursos
- biblioteca com múltiplas anotações/cadernos
- múltiplas páginas por anotação
- escrita via Pointer Events com pressão da S Pen
- caneta, borracha, cores e espessura
- desfazer/refazer
- papel branco, pautado ou quadriculado
- salvamento automático em IndexedDB
- migração automática do documento da versão 1
- backup completo em JSON e restauração
- exportação da página para PNG\n- exportação do caderno inteiro para PDF (uma folha por página, gerado localmente e offline)
- funcionamento offline via Service Worker
- instalável como PWA

## GitHub Pages
https://osli-evolutize.github.io/s-pen-notes/

Os manuscritos permanecem no armazenamento local do navegador. Use **Backup** periodicamente para gerar um arquivo JSON capaz de restaurar todos os cadernos.
