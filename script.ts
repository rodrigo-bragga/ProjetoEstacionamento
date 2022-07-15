interface Veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function() {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil /60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min} minutos e ${sec} segundos`;
    }

    function patio(){
        function ler(): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function adicionar(veiculo: Veiculo, salva?: boolean){
            
           
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${getHora()}</td>
            <td>
                <button class="delete" data-placa=${veiculo.placa}">X</button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener("click",function(){
                remover(veiculo.placa);
            });

            $("#patio")?.appendChild(row);
            if(salva) salvar([...ler(),veiculo]);
        }
        function remover(placa: string) {

            const {entrada, nome} = ler().find((veiculo) => veiculo.placa === placa);

            const tempo = calcTempo( new Date().getTime() - new Date(entrada) .getTime());

            if(!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo => adicionar(veiculo)));
            }
        }
        function getHora(){
            let horarioDeEntrada = new Date;
            let min = horarioDeEntrada.getMinutes() > 9 ? horarioDeEntrada.getMinutes():"0" + horarioDeEntrada.getMinutes();
            let hora = horarioDeEntrada.getHours() > 9 ?  horarioDeEntrada.getHours() : "0" +  horarioDeEntrada.getHours();
            let dia = horarioDeEntrada.getDate() > 9 ? horarioDeEntrada.getDate() : "0" + horarioDeEntrada.getDate();
            let mes = (horarioDeEntrada.getMonth()+1) > 9 ? horarioDeEntrada.getMonth()+1 : "0"+ (horarioDeEntrada.getMonth() + 1);
            let ano = horarioDeEntrada.getFullYear() > 9 ? horarioDeEntrada.getFullYear() : "0" + horarioDeEntrada.getFullYear();


            return `${hora}:${min} ${dia}/${mes}/${ano}`;
         }
         

        return {ler, adicionar, remover, salvar, render}  
    }

    
    
    patio().render();
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa){
            alert("OS campos nome e placa são obrigatórios")
        } else {
        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true)
        }
    });
} )();

