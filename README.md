Sistema de Ranking e Hash para XML 
Este repositório contém uma implementação para processar um arquivo XML e gerar um ranking de palavras-chave, contando as ocorrências dessas palavras no título e no conteúdo das páginas. O sistema também utiliza um mecanismo de hash para melhorar a busca e a organização dos dados extraídos do XML.

Funcionalidades
Carregamento de Arquivo XML: O sistema permite carregar um arquivo XML e extrair informações de suas páginas, como título e texto.
Criação de Dicionário de Palavras: O sistema processa o texto de cada página para contar a ocorrência de palavras-chave.
Ranking de Ocorrências: Permite realizar buscas por palavras-chave e gera um ranking com o número de ocorrências dessas palavras nos títulos e textos das páginas.
Hash para Armazenamento: Utiliza um mecanismo de hash para organizar as palavras e melhorar a performance da busca.
Estrutura do Projeto
Este projeto é composto por:

Funções para carregar e processar o XML:

carregarXML: Carrega e lê um arquivo XML.
criarDicionarioDePalavras: Cria um dicionário de palavras a partir dos títulos e textos das páginas.
extrairPalavras: Extrai palavras do texto.
contarOcorrencias: Conta a quantidade de ocorrências de cada palavra.
Funções de Busca:

buscarOcorrencias: Realiza a busca de uma palavra-chave e retorna um ranking das páginas com base nas ocorrências.
Exibição de Resultados:

exibirResultados: Exibe os resultados da busca na interface do usuário.
Algoritmos de Hash:

Utiliza hashing para melhorar a busca e otimizar o armazenamento dos dados.
Como Usar
Clone o repositório em sua máquina:

bash
Copiar código
git clone https://github.com/macedoflp/analisadorXml.git
Abra o arquivo index.html no navegador para utilizar a interface de busca.

Selecione um arquivo XML que contenha páginas com títulos e textos. O sistema irá extrair e processar as palavras para criar um ranking de ocorrências.

Insira uma palavra-chave na caixa de busca e clique em "Buscar" para visualizar o ranking de páginas com base nas ocorrências dessa palavra.

Exemplo de Uso
Selecione o arquivo XML de entrada.
Digite a palavra-chave desejada na caixa de texto.
Clique em "Buscar" para visualizar o ranking de páginas que contêm a palavra.
Exemplo de Resultado
Se você buscar pela palavra "exemplo", o sistema exibirá algo como:

Resultados para a palavra-chave "exemplo":
1. Página 1: 5 ocorrências no título, 12 ocorrências no texto.
2. Página 2: 3 ocorrências no título, 8 ocorrências no texto.

...
Tecnologias Utilizadas
JavaScript: Para o processamento de dados e interação com o usuário.
HTML: Para a estrutura da interface do usuário.
CSS: Para o estilo da página (opcional).
Contribuindo
Faça um fork do repositório.
Crie uma branch para suas mudanças (git checkout -b minha-nova-funcionalidade).
Faça o commit das suas mudanças (git commit -am 'Adicionando nova funcionalidade').
Envie para o repositório remoto (git push origin minha-nova-funcionalidade).
Abra um pull request.
Licença
Este projeto está licenciado sob a Licença MIT - consulte o arquivo LICENSE para mais detalhes.
