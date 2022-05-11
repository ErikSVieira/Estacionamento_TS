interface Veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        const hor = Math.floor(mil / 3600000);

        let newMin = min;
        if (hor > 0) {

            for (let i = 0; i < hor; i++) {
                newMin = newMin - 60;
            }
        }

        let custo = 0;
        if (hor > 0) {
            custo += hor * 8;
        }
        if (newMin > 8) {
            custo += Math.floor(newMin / 8);
        } else if (newMin >= 5) {
            custo += 1;
        }
        
        return `${hor}h ${newMin}m e ${sec}s.\nCusto da permanencia é de: R$ ${custo}`;
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
                <th scope="row">${veiculo.placa}</th>
                <td>${veiculo.nome}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete btn btn-warning" data-placa="${veiculo.placa}">X</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa); // Comentado  "strict": true em "tsconfig.json" para reconher o "this"
            });

            $("#patio")?.appendChild(row);

            if (salva) salvar([...ler(), veiculo]);
        }

        function remover(placa: string){
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa); // Alterado "target": "es2016" por "target": "es6" em "tsconfig.json" para reconher o "find"

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if (
                !confirm(`O veiculo ${nome} permaneceu ${tempo}\nDeseja encerrar?`)
            ) 
                return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));

            render();
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if (patio.length){
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return { ler, adicionar, remover, salvar, render };
    }

    patio().render();

    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        // if (!nome || !placa) {
        //     alert("Os campos são obrigatórios.");
        //     return;
        //   }

        if (!nome) {
            alert("O campo modelo é obrigatório");
            return;
        }
        if (!placa) {
            alert("O campo placa é obrigatório");
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();