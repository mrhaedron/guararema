# Luís Carlos — passeio em primeira pessoa

Protótipo 3D inspirado nas 15 fotos fornecidas do bairro de Luís Carlos, Guararema/SP. Inclui praça de paralelepípedos, casarões, estação, três vagões, palmeiras, trilhos, passagem de nível, estrada de terra, carros e vegetação. A disposição é aproximada; não é um levantamento topográfico. Os objetos são procedurais e as fotos não são usadas como texturas.

## Executar

Na pasta do projeto:

```sh
python3 -m http.server 8080
```

Abra http://localhost:8080. Clique em **Começar o passeio**. WASD move, mouse olha, Shift corre, Esc pausa. Requer computador com mouse e WebGL. Existem colisões com edifícios, plataforma, carros e vagões. O protótipo oferece somente navegação livre em primeira pessoa; as missões serão definidas posteriormente.

## Compilar o núcleo Rust para WASM

Instale Rust com rustup e execute:

```sh
./build-wasm.sh
```

Recarregue o navegador. O indicador passa a mostrar **RUST + WEBASSEMBLY**. O módulo Rust controla normalização de movimento, velocidade e limites do mundo; JavaScript controla WebGL, geometria, eventos, interface e colisões locais. A prévia funciona com um fallback JavaScript quando `public/core.wasm` ainda não foi compilado. Este ambiente não tinha Rust e o download do compilador falhou; a compilação Rust permanece pendente.

```sh
cargo test
```

Sem bibliotecas externas ou downloads para executar a prévia. `game.js` contém a cena e o renderizador; `src/lib.rs`, o núcleo Rust. Próximos passos possíveis: migrar renderização para wgpu/Bevy, usar modelos detalhados, ampliar a malha de ruas e adicionar áudio.

## Publicar na hospedagem

Após compilar, execute `node tests/wasm.cjs` e `./scripts/package-site.sh`.
Envie **o conteúdo de `dist/`** para o diretório remoto que corresponde a
`https://www.stellarhaedron.com/ai/guararema/`, preservando `public/core.wasm`.
Todos os caminhos são relativos, permitindo hospedar nessa subpasta.
O arquivo `.htaccess` configura o tipo MIME WASM em servidores Apache.
Não envie código-fonte, credenciais ou a pasta `target/` para a hospedagem.

O workflow GitHub Actions testa e compila o projeto e disponibiliza o pacote
`guararema-site` como artefato. Não publica por FTP automaticamente.
