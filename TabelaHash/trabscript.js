async function carregarXML(arquivo) {
    try {
        const leitor = new FileReader();
        return new Promise((resolve, reject) => {
            leitor.onload = () => {
                const parser = new DOMParser();
                resolve(parser.parseFromString(leitor.result, "text/xml"));
            };
            leitor.onerror = () => reject(new Error("Erro ao ler o arquivo."));
            leitor.readAsText(arquivo);
        });
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar o arquivo XML.");
        throw erro;
    }
}

function criarDicionarioDePalavras(xmlDoc) {
    const pages = xmlDoc.getElementsByTagName("page");
    const dicionarioGlobal = [];

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const titleTag = page.getElementsByTagName("title")[0];
        const textTag = page.getElementsByTagName("text")[0];

        const titleContent = titleTag?.textContent || "";
        const textContent = textTag?.textContent || "";

        const palavrasTitle = extrairPalavras(titleContent);
        const palavrasText = extrairPalavras(textContent);

        const dicionarioPage = {
            index: i,
            title: contarOcorrencias(palavrasTitle),
            text: contarOcorrencias(palavrasText),
            page 
        };

        dicionarioGlobal.push(dicionarioPage);
    }

    return dicionarioGlobal;
}

function extrairPalavras(texto) {
    return texto
        .toLowerCase()
        .match(/\b[a-z]{4,}\b/g) || [];
}

function contarOcorrencias(palavras) {
    const contador = {};
    palavras.forEach(palavra => {
        contador[palavra] = (contador[palavra] || 0) + 1;
    });
    return contador;
}

function buscarOcorrencias(dicionarioGlobal, palavraChave) {
    const palavra = palavraChave.toLowerCase();
    const resultados = dicionarioGlobal.map(dicionarioPage => {
        const ocorrenciasTitle = dicionarioPage.title[palavra] || 0;
        const ocorrenciasText = dicionarioPage.text[palavra] || 0;
        const totalOcorrencias = ocorrenciasTitle + ocorrenciasText;

        return {
            page: dicionarioPage.page,
            ocorrenciasTitle,
            ocorrenciasText,
            totalOcorrencias
        };
    });

    resultados.sort((a, b) => b.totalOcorrencias - a.totalOcorrencias);
    return resultados;
}

function exibirResultados(resultados, palavraChave) {
    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = `Resultados para a palavra-chave "${palavraChave}"`;
    divResultado.appendChild(titulo);

    if (resultados.length > 0) {
        const lista = document.createElement("ol");
        resultados.slice(0, 10).forEach(({ page, ocorrenciasTitle, ocorrenciasText, totalOcorrencias }) => {
            if (totalOcorrencias > 0) {
                const itemLista = document.createElement("li");
                itemLista.innerHTML = ` 
                    <strong>Total de Ocorrências:</strong> ${totalOcorrencias} <br>
                    <strong>Title - Ocorrências:</strong> ${ocorrenciasTitle} <br>
                    <strong>Text - Ocorrências:</strong> ${ocorrenciasText} <br>
                    <strong>Page Content (resumo):</strong> ${page.outerHTML.slice(0, 200)}...
                `;
                lista.appendChild(itemLista);
            }
        });
        divResultado.appendChild(lista);
    } else {
        const semResultados = document.createElement("p");
        semResultados.textContent = `Nenhuma ocorrência da palavra "${palavraChave}" foi encontrada.`;
        divResultado.appendChild(semResultados);
    }
}


function baixarDicionario(dicionarioGlobal) {
    const dicionarioJSON = JSON.stringify(dicionarioGlobal, null, 2); 
    const blob = new Blob([dicionarioJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dicionario.json";
    link.click();
    URL.revokeObjectURL(url); 
}

let dicionarioGlobal = null;

document.getElementById("botaoBuscar").addEventListener("click", async () => {
    const inputArquivo = document.getElementById("arquivoXML");
    const arquivo = inputArquivo.files[0];
    const palavraChave = document.getElementById("palavraChave").value.trim();

    if (!arquivo) {
        alert("Por favor, selecione um arquivo XML.");
        return;
    }

    if (!palavraChave) {
        alert("Por favor, insira uma palavra-chave.");
        return;
    }

    try {
        if (!dicionarioGlobal) {
            const xmlDoc = await carregarXML(arquivo);
            dicionarioGlobal = criarDicionarioDePalavras(xmlDoc);
            alert("Dicionário criado com sucesso! Agora as buscas serão mais rápidas.");
        }

        const resultados = buscarOcorrencias(dicionarioGlobal, palavraChave);
        exibirResultados(resultados, palavraChave);
    } catch (erro) {
        console.error("Erro:", erro);
    }
});


document.getElementById("botaoBaixar").addEventListener("click", () => {
    if (dicionarioGlobal) {
        baixarDicionario(dicionarioGlobal);
    } else {
        alert("Nenhum dicionário foi criado ainda.");
    }
});
