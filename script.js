
async function dados(){
    var dados = await fetch("http://3.87.188.55:5000/dados", {
        method: "GET"
    })

    var dadosJS = await dados.json()
    var cont = 0
    dadosJS.dados.forEach(element => {
        console.log(element)
        lista = document.querySelector("tbody")
        item = document.createElement("td")
        linha = document.createElement("tr")
        botao = document.createElement("button")
        botao.innerText = "Visualizar"
        botao.className = "btn btn-primary fs-5 botaoVisu"
        botao.setAttribute("type", "button");
        botao.setAttribute("data-bs-toggle", "modal");
        botao.setAttribute("data-bs-target", "#exampleModal");

        item.innerText = element.notebook
        item.id = element.id
        item.className = "fs-3"
        if (cont != 0) {
            if(element.notebook != dadosJS.dados[cont-1].notebook){
                botao.id = element.notebook
                linha.append(item)
                linha.append(botao)
                lista.append(linha)
            }
        }
        cont++
        
    });
    
    function contar_areas(){
        var areas_valor = {
            dbo: 0, 
            Exportacao: 0, 
            Graos: 0, 
            Contabilidade: 0
        }
        var cont = 0
        dadosJS.dados.forEach(element => {
            if (cont != 0) {
                if(element.notebook != dadosJS.dados[cont-1].notebook){
                    areas_valor[element.area]++
                    console.log(areas_valor[element.area])
                }
            }
            cont++
        });
        console.log(areas_valor)
        grafico_areas(areas_valor)
    }
    contar_areas()
    

    function armazenar_tabelas(){
        tabelas = []
        var flag = 0
        var count = 0
        dadosJS.dados.forEach(element => {
            flag = 0

            if(count != 0){
                tabelas.forEach(tabela => {
                    if(element.tabelas == tabela){
                        flag = 1
                    }
                });
                if(flag == 0){
                    tabelas.push(element.tabelas)
                }
            }else{
                tabelas.push(element.tabelas)
                count++
            }
        });
        console.log(tabelas)
        contar_tabelas(tabelas)
    }

    armazenar_tabelas()
  
    function contar_tabelas(tabelas){
        var cont = 0
        var valor_tabelas = []
        tabelas.forEach(tabela => {
            cont = 0;
            dadosJS.dados.forEach(element => {
                if(element.tabelas == tabela){
                    cont++
                    console.log(element.tabelas, cont)
                }
            });
            valor_tabelas.push(cont);
        });
        console.log(valor_tabelas)
        grafico_tabelas(valor_tabelas, tabelas)
    }


    function modal(){
        botoes = document.querySelectorAll(".botaoVisu")
        
        botoes.forEach(element => {
            element.addEventListener("click", ()=>{
                var lista = document.querySelector(".lista-tabela-modal")
                lista.innerHTML = ""
                notebook = element.id
                console.log(notebook)
                dadosJS.dados.forEach(element2=>{
                    if(notebook == element2.notebook){
                        var titulo = document.querySelector("#exampleModalLabel")
                        titulo.innerText = element2.notebook
                        var area = document.querySelector(".area-modal")
                        area.innerText = `Area: ${element2.area}`

                        
                        var item = document.createElement("li")
                        item.innerText = element2.tabelas
                        lista.appendChild(item)
                    }
                })
            })
        });
    }
    modal()
}
dados()

function grafico_areas(areas_valor){
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Exportação', 'dbo', 'Grãos', 'Contabilidade'],
          datasets: [{
            label: '# Notebooks',
            data: [areas_valor.Exportacao, areas_valor.dbo, areas_valor.Graos, areas_valor.Contabilidade],
            borderWidth: 1
          }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Contagem de notebook por area'
                }
            },
            indexAxis: 'y',
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}

function grafico_tabelas(tabelas_valor, tabelas){
    const ctx = document.getElementById('myChart2');
    new Chart(ctx, {
        type: 'bar',
        data: {
          labels: tabelas,
          datasets: [{
            label: '# Notebooks',
            data: tabelas_valor,
            borderWidth: 1
          }]
        },
        options: {
            plugins: {
                title: {
                    align: "start",
                    display: true,
                    text: 'Contagem de notebook por tabela'
                }
            },
            indexAxis: 'x',
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}
