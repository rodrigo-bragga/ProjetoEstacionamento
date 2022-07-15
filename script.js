(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min} minutos e ${sec} segundos`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${getHora()}</td>
            <td>
                <button class="delete" data-placa=${veiculo.placa}">X</button>
            </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(veiculo.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { entrada, nome } = ler().find((veiculo) => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo => adicionar(veiculo)));
            }
        }
        function getHora() {
            let horarioDeEntrada = new Date;
            let min = horarioDeEntrada.getMinutes() > 9 ? horarioDeEntrada.getMinutes() : "0" + horarioDeEntrada.getMinutes();
            let hora = horarioDeEntrada.getHours() > 9 ? horarioDeEntrada.getHours() : "0" + horarioDeEntrada.getHours();
            let dia = horarioDeEntrada.getDate() > 9 ? horarioDeEntrada.getDate() : "0" + horarioDeEntrada.getDate();
            let mes = (horarioDeEntrada.getMonth() + 1) > 9 ? horarioDeEntrada.getMonth() + 1 : "0" + (horarioDeEntrada.getMonth() + 1);
            let ano = horarioDeEntrada.getFullYear() > 9 ? horarioDeEntrada.getFullYear() : "0" + horarioDeEntrada.getFullYear();
            return `${hora}:${min} ${dia}/${mes}/${ano}`;
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("OS campos nome e placa são obrigatórios");
        }
        else {
            patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
        }
    });
})();
