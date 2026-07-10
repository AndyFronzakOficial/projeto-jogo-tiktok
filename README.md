# Ranking de Clubes para TikTok Live

Sistema simples com duas telas:

- `/ranking`: tela visual para colocar na live.
- `/controle`: painel onde cada clique soma um ponto ao clube.

## Rodar

```bash
npm install
npm run dev
```

Sem configurar Supabase, o projeto abre em **modo demonstração local** usando o navegador.

## Conectar ao Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute `supabase/schema.sql`.
3. Em Database > Replication, ative Realtime para a tabela `clubs`.
4. Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=SEU_URL
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

5. Reinicie `npm run dev`.

## Uso na live

Abra `/ranking` na fonte de navegador do TikTok Live Studio/OBS. Em outra aba ou no celular, abra `/controle`. Quando alguém enviar um presente, clique no clube escolhido e ele subirá automaticamente no ranking.

## Logos

A V1 usa escudos genéricos com siglas para evitar incluir arquivos de marcas. Para usar logos reais, preencha `logo_url` na tabela `clubs` com a URL da imagem de cada clube.

## Segurança

Como solicitado, não há login. As políticas do Supabase permitem atualização pela chave pública. Para publicar o painel de controle na internet, o recomendado é adicionar autenticação ou proteger a rota por senha.

## Correção de configuração PostCSS externa

Esta versão força uma configuração PostCSS local vazia. Assim, o Vite não carrega acidentalmente arquivos `postcss.config.js` que estejam em pastas superiores, como a pasta `Downloads`.


## Novidades da V2

- Os 20 clubes aparecem juntos na tela da live, sem barra de rolagem.
- Cada clube possui um presente identificado ao lado do escudo.
- Exemplo: Grêmio usa o presente Rosa (🌹).
- O painel de controle também mostra qual presente corresponde a cada clube.
- Foi incluído o Bragantino para completar os 20 clubes.

## V3 — duas colunas e presentes reais

A tela `/ranking` mostra 10 clubes à esquerda e 10 à direita, sem rolagem. Os 20 presentes enviados pelo usuário ficam em `public/gifts` e aparecem no ranking e no painel de controle. O Grêmio está associado à Rosa.
