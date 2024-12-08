const cache = new Map();

async function carregarXML(arquivo) {
    

    const chaveArquivo = `${arquivo.name}-${arquivo.size}-${arquivo.lastModified}`;
    
    if (cache.has(chaveArquivo)) {
        console.log(`Usando XML em cache para o arquivo: ${arquivo.name}`);
        return cache.get(chaveArquivo).xmlDoc;
    }

    try {
        const leitor = new FileReader();
        return new Promise((resolve, reject) => {
            leitor.onload = () => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(leitor.result, "text/xml");
                cache.set(chaveArquivo, { xmlDoc });
                resolve(xmlDoc);
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

function calcularPorcentagem(ocorrencias, totalPalavras) {
    if (totalPalavras === 0) return 0;
    return (ocorrencias / totalPalavras) * 100;
}

function calcularRanking(xmlDoc) {
    const xmlString = new XMLSerializer().serializeToString(xmlDoc);
    const chaveRanking = `ranking-${xmlString.length}`;

    if (cache.has(chaveRanking)) {
        console.log("Usando o ranking em cache.");
        return cache.get(chaveRanking);
    }

    const pages = xmlDoc.getElementsByTagName("page");
    const resultados = [];

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const titleTag = page.getElementsByTagName("title")[0];
        const textTag = page.getElementsByTagName("text")[0];

        const titleContent = titleTag?.textContent || "";
        const textContent = textTag?.textContent || "";

        const titleWords = titleContent.split(/\s+/);
        const textWords = textContent.split(/\s+/);

        const titleOcorrenciasA = (titleContent.match(/\bcomputer\b/gi) || []).length;
        const textOcorrenciasA = (textContent.match(/\bcomputer\b/gi) || []).length;

        const titleOcorrenciasB = (titleContent.match(/\bscience\b/gi) || []).length;
        const textOcorrenciasB = (textContent.match(/\bscience\b/gi) || []).length;

        const titleOcorrenciasTotal = titleOcorrenciasA + titleOcorrenciasB;
        const textOcorrenciasTotal = textOcorrenciasA + textOcorrenciasB;

        const titlePorcentagemA = calcularPorcentagem(titleOcorrenciasA, titleWords.length);
        const textPorcentagemA = calcularPorcentagem(textOcorrenciasA, textWords.length);

        const titlePorcentagemB = calcularPorcentagem(titleOcorrenciasB, titleWords.length);
        const textPorcentagemB = calcularPorcentagem(textOcorrenciasB, textWords.length);

        const titlePorcentagemTotal = titlePorcentagemA + titlePorcentagemB;
        const textPorcentagemTotal = textPorcentagemA + textPorcentagemB;
        const porcentagemTotal = titlePorcentagemTotal + textPorcentagemTotal;

        resultados.push({
            page,
            porcentagemTotal,
            detalhes: {
                titleOcorrenciasA,
                titleOcorrenciasB,
                textOcorrenciasA,
                textOcorrenciasB,
                titlePorcentagemA,
                titlePorcentagemB,
                textPorcentagemA,
                textPorcentagemB,
                titleOcorrenciasTotal,
                titleWords: titleWords.length,
                textOcorrenciasTotal,
                textWords: textWords.length,
                titlePorcentagemTotal,
                textPorcentagemTotal,
            },
        });
    }

    resultados.sort((a, b) => b.porcentagemTotal - a.porcentagemTotal);
    cache.set(chaveRanking, resultados);
    return resultados;
}

function exibirResultados(resultados) {
    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = "Ranking de Pages por Porcentagem Total de 'computer' e 'science'";
    divResultado.appendChild(titulo);

    if (resultados.length > 0) {
        const lista = document.createElement("ol");
        resultados.slice(0, 10).forEach(({ page, porcentagemTotal, detalhes }) => {
            const itemLista = document.createElement("li");
            itemLista.innerHTML = `
                <strong>Porcentagem Total:</strong> ${porcentagemTotal.toFixed(2)}% <br>
                <strong>Title Computer - Ocorrências:</strong> ${detalhes.titleOcorrenciasA}, Total de Palavras: ${detalhes.titleWords}, Porcentagem: ${detalhes.titlePorcentagemA.toFixed(2)}% <br>
                <strong>Title Science - Ocorrências:</strong> ${detalhes.titleOcorrenciasB}, Total de Palavras: ${detalhes.titleWords}, Porcentagem: ${detalhes.titlePorcentagemB.toFixed(2)}% <br>
                <strong>Title Total - Ocorrências:</strong> ${detalhes.titleOcorrenciasTotal}, Total de Palavras: ${detalhes.titleWords}, Porcentagem: ${detalhes.titlePorcentagemTotal.toFixed(2)}% <br>
                <strong>Text Computer- Ocorrências:</strong> ${detalhes.textOcorrenciasA}, Total de Palavras: ${detalhes.textWords}, Porcentagem: ${detalhes.textPorcentagemA.toFixed(2)}% <br>
                <strong>Text Science- Ocorrências:</strong> ${detalhes.textOcorrenciasB}, Total de Palavras: ${detalhes.textWords}, Porcentagem: ${detalhes.textPorcentagemB.toFixed(2)}% <br>
                <strong>Text Total- Ocorrências:</strong> ${detalhes.textOcorrenciasTotal}, Total de Palavras: ${detalhes.textWords}, Porcentagem: ${detalhes.textPorcentagemTotal.toFixed(2)}% <br>
                <strong>Page Content:</strong> ${page.outerHTML.slice(0, 200)}...
            `;
            lista.appendChild(itemLista);
        });
        divResultado.appendChild(lista);
    } else {
        const semResultados = document.createElement("p");
        semResultados.textContent = `Nenhuma ocorrência das palavras "computer" e "science" encontrada nas tags analisadas.`;
        divResultado.appendChild(semResultados);
    }
}

document.getElementById("botaoBuscar").addEventListener("click", async () => {
    const inputArquivo = document.getElementById("arquivoXML");
    const arquivo = inputArquivo.files[0];

    if (!arquivo) {
        alert("Por favor, selecione um arquivo XML.");
        return;
    }

    const chaveArquivo = `${arquivo.name}-${arquivo.size}-${arquivo.lastModified}`;
    
    try {
        const xmlDoc = await carregarXML(arquivo);
        
        if (cache.get(chaveArquivo)?.ranking) {
            console.log("Usando ranking em cache.");
            exibirResultados(cache.get(chaveArquivo).ranking);
        } else {
            console.log("Calculando o ranking.");
            const resultados = calcularRanking(xmlDoc);
            cache.set(chaveArquivo, { xmlDoc, ranking: resultados });
            exibirResultados(resultados);
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
});
