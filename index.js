const valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
// const naipes = ["♥", "♣", "♦", "♠"];
const naipes = [0, 1, 2, 3];
var baralho = [];

class Carta {
    constructor(valor, naipe) {
        this.valor = valor;
        this.naipe = naipe;
    }
}

class Jogador {
    constructor(jogador, cartas, maiorDeck, ponto) {
        this.jogador = jogador;
        this.cartas = cartas;
        this.ponto = ponto;
        this.maiorDeck = maiorDeck;
    }
}

class Mesa {
    constructor(cartas) {
        this.cartas = cartas
    }
}

gerarCartas();


var jogador1 = new Jogador('jogador1', [], [], 0);
var jogador2 = new Jogador('jogador2', [], [], 0);
var jogador3 = new Jogador('jogador3', [], [], 0);
var jogador4 = new Jogador('jogador4', [], [], 0);
var mesa = new Mesa([]);

var cartasDistribuidas = [jogador1, jogador2, jogador3, jogador4, mesa];

addCartasMesa();

function gerarCartas() {
    for (var naipe of naipes) {
        for (var valor of valores) {
            var carta = new Carta(valor, naipe);
            baralho.push(carta);
        }
    }
}

function trocarCartaJogador(jogador) {

    baralho = baralho.concat(cartasDistribuidas[jogador - 1].cartas)
    cartasDistribuidas[jogador - 1].cartas = []

    for (var i = 1; i <= 3; i++) {

        var jogadorValor = document.getElementById('jogador' + jogador + 'Valor' + i);
        var jogadorNaipe = document.getElementById('jogador' + jogador + 'Naipe' + i);

        var indice = Math.floor(Math.random() * baralho.length);
        var carta = baralho[indice];
        baralho.splice(indice, 1);

        jogadorValor.value = carta.valor;
        jogadorNaipe.value = naipes.indexOf(carta.naipe);
        changeColor(jogadorNaipe.value, jogadorValor.id, jogadorNaipe.id);

        var carta = new Carta(jogadorValor.value, parseInt(jogadorNaipe.value));

        cartasDistribuidas[jogador - 1].cartas.push(carta);

    }

}

function trocarCartaMesa() {

    baralho = baralho.concat(cartasDistribuidas[4].cartas)
    cartasDistribuidas[4].cartas = []

    for (var i = 1; i <= 2; i++) {

        var mesaValor = document.getElementById('mesaValor' + i);
        var mesaNaipe = document.getElementById('mesaNaipe' + i);

        var indice = Math.floor(Math.random() * baralho.length);
        var carta = baralho[indice];
        baralho.splice(indice, 1);

        mesaValor.value = carta.valor;
        mesaNaipe.value = naipes.indexOf(carta.naipe);
        changeColor(mesaNaipe.value, mesaValor.id, mesaNaipe.id);

        var carta = new Carta(mesaValor.value, parseInt(mesaNaipe.value));

        cartasDistribuidas[4].cartas.push(carta)
    }
}

function changeColor(valorNaipe, valor, naipe) {
    var cartaValor = document.getElementById(valor);
    var cartaNaipe = document.getElementById(naipe);

    if (valorNaipe % 2 == 0) {
        cartaValor.style.color = 'red';
        cartaNaipe.style.color = 'red';
    } else {
        cartaValor.style.color = 'black';
        cartaNaipe.style.color = 'black';
    }
}

function addCartasMesa() {

    baralho = []

    gerarCartas();

    jogador1.cartas = []
    jogador2.cartas = []
    jogador3.cartas = []
    jogador4.cartas = []
    mesa.cartas = []

    for (var i = 1; i <= 4; i++) {
        trocarCartaJogador(i);
    }

    trocarCartaMesa();
}

function combinacoesSemRepeticao(array1, array2) {
    var resultado = [];

    var elementos = array1.concat(array2);

    function permutar(atual, restantes) {
        if (atual.length === 3) {
            resultado.push(atual);
            return;
        }

        for (let i = 0; i < restantes.length; i++) {
            var carta = restantes[i];
            var proximo = restantes.filter((_, index) => index !== i);
            permutar(atual.concat(carta), proximo);
        }
    }

    permutar([], elementos);
    return resultado.filter((comb, index) => {
        var combinacaoRepetida = resultado.slice(index + 1).some(
            c => c.every(
                carta => comb.some(
                    c2 => c2.valor === carta.valor && c2.naipe === carta.naipe
                )
            )
        );
        return !combinacaoRepetida;
    });
}

function calcularPontos() {
    for (var i = 0; i < 4; i++) {

        cartasDistribuidas[i].ponto = 0;
        cartasDistribuidas[i].maiorDeck = [];

        var combinacoes = combinacoesSemRepeticao(cartasDistribuidas[i].cartas, mesa.cartas);

        var maiorDeck = combinacoes[0];

        for (var combinacao of combinacoes) {
            var pontos = 0;
            var pontoNaipe = 0;
            var sequencia = false;
            var naipeIgual = false;
            combinacao.sort((a, b) => valores.indexOf(a.valor) - valores.indexOf(b.valor));

            for (var j = 0; j < 2; j++) {
                for (var k = j + 1; k <= 2; k++) {
                    if (Math.abs(valores.indexOf(combinacao[j].valor) - valores.indexOf(combinacao[k].valor)) == 1) {
                        if (!sequencia) {
                            sequencia = true;
                            pontos += 4;
                        } else {
                            pontos += 2;
                        }
                    }

                    if (combinacao[j].naipe == combinacao[k].naipe && pontoNaipe < 3) {
                        if (!naipeIgual) {
                            naipeIgual = true;
                            pontos += 2;
                            pontoNaipe += 2;
                        } else {
                            pontos += 1;
                            pontoNaipe += 1;
                        }
                    }
                }


            }
            
            if (pontos > cartasDistribuidas[i].ponto) {

                cartasDistribuidas[i].ponto = pontos;
                cartasDistribuidas[i].maiorDeck = combinacao;
                maiorDeck = combinacao;
            } else {
                pontos = 0;
            }
            
            for (var m = 1; m <= 3; m++) {
                var jogadorValor = document.getElementById('jogador' + (i + 1) + 'Valor' + m + 'Resultado');
                var jogadorNaipe = document.getElementById('jogador' + (i + 1) + 'Naipe' + m + 'Resultado');

                jogadorValor.value = maiorDeck[m - 1].valor;
                jogadorNaipe.value = naipes.indexOf(maiorDeck[m - 1].naipe);
                changeColor(jogadorNaipe.value, jogadorValor.id, jogadorNaipe.id);

            }
            var jogadorPonto = document.getElementById('jogador' + (i + 1) + 'Ponto');
            jogadorPonto.innerText = cartasDistribuidas[i].ponto;
        }
    }
}