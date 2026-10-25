# Duelo Live — placar interativo

Página React pensada para usar pelo celular durante uma live.

## Regra padrão
- 🌹 Rosa vermelha: +1 ponto para Lula.
- 🤍 Rosa branca: +1 ponto para Bolsonaro.
- Você pode alterar quantos pontos cada rosa vale nas configurações.
- Use os botões quando o presente aparecer na live. O placar é manual e não lê os presentes automaticamente.

## Como abrir no computador
1. Instale Node.js (versão LTS).
2. Extraia o ZIP.
3. Dentro da pasta, execute:
   ```bash
   npm install
   npm run dev
   ```
4. Abra o endereço mostrado no terminal.

## Como usar pelo telefone
A opção mais simples é publicar a pasta em um serviço de hospedagem estática (por exemplo, Vercel ou Netlify) e abrir o link no navegador do celular. Também é possível executar o projeto em um computador na mesma rede e abrir o endereço de rede informado pelo Vite.

## Recursos
- Placar para os dois lados
- Cronômetro de 5 ou 10 minutos, iniciar e pausar
- Total, diferença e indicação de quem está na frente
- Registro dos últimos presentes
- Ajuste manual de pontos e botão para desfazer por lado
- Tela cheia e vibração breve em dispositivos compatíveis

## Limitação do TikTok
Esta versão **não se conecta à API do TikTok nem detecta presentes automaticamente**. Para evitar depender de APIs não oficiais, toque no botão da rosa correspondente quando o presente chegar. A página pode ficar aberta no próprio celular; para mostrar o placar aos espectadores, use uma captura de tela/cena de transmissão compatível com sua configuração.
