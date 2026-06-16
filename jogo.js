/*
 * Você não vai precisar alterar este arquivo
 */
const ANIMAIS_POSSIVEIS = [
  'peixe',
  'leao',
  'gato',
  'cachorro',
  'girafa',
  'rato',
  'hipopotamo',
  'coelho',
  'urso'
];

const TEMPO_PARA_DAR_COMIDA = 4000;
const DURACAO_COMANDO_VISIVEL = 4000;
const DURACAO_ANIMACAO_ATAQUE = 1000;
const DURACAO_ANIMACAO_SATISFEITO = 1000;
const DURACAO_ANIMACAO_COM_RAIVA = 1000;

const ESTADOS_POSSIVEIS = [
  'com-fome',
  'satisfeito',
  'foi-incomodado',
  'atacando'
];

const somDeSucesso = new Audio('sounds/success.wav');
const somDeErro = new Audio('sounds/error.wav');

const comandoEl = document.querySelector('#comando');
const telaEl = document.querySelector('#conteudo');
const elementoPontuacao = document.querySelector('#pontuacao');

let temporizadorProximoAnimal = null;
let temporizadorComando = null;
let pontuacao = {
  pontos: 0
};
let animais = [];

function sorteiaAnimaisDaPartida(quantos) {
  let animaisTodosCopia = ANIMAIS_POSSIVEIS.slice(0),
    indiceSorteado,
    animalSorteado,
    sorteio = [];

  while (quantos-- > 0) {
    indiceSorteado = Math.floor(Math.random() * animaisTodosCopia.length);
    animalSorteado = animaisTodosCopia.splice(indiceSorteado, 1);
    sorteio.push(animalSorteado[0]);
  }

  return sorteio;
}

function preencheAnimaisNaTela() {
  let markupAnimais = '';

  for (let animal of animais) {
    markupAnimais += `<div class="container-animal">
                        <img id="${animal}" src="imgs/${animal}.jpg" class="animal">
                      </div>`;
  }

  telaEl.innerHTML = markupAnimais;
  const elementosAnimais = document.querySelectorAll('.animal');
  for (let animalEl of elementosAnimais) {
    animalEl.addEventListener('click', darComidaParaAnimal);
  }
}

function alteraEstadoDoAnimal(animalEl, novoEstado) {
  animalEl.classList.remove(...ESTADOS_POSSIVEIS);
  
  switch (novoEstado) {
    case 'com-fome':
      break;

    case 'satisfeito':
      // registra para voltar ao normal daqui x segundos
      setTimeout(() => {
        animalEl.classList.remove('satisfeito');
      }, DURACAO_ANIMACAO_SATISFEITO);
      break;

    case 'foi-incomodado':
      // registra para voltar ao normal daqui x segundos
      setTimeout(() => {
        animalEl.classList.remove('foi-incomodado');
      }, DURACAO_ANIMACAO_COM_RAIVA);
      break;

    case 'atacando':
      // registra para voltar ao normal daqui x segundos
      setTimeout(() => {
        animalEl.classList.remove('atacando');
      }, DURACAO_ANIMACAO_ATAQUE);
      break;

    default:
      novoEstado = null;
  }

  if (novoEstado) {
    animalEl.classList.add(novoEstado);
  }
}

function sorteiaNumeroInteiro(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo)) + minimo;
}

function escolheAnimal() {
  const indiceSorteado = sorteiaNumeroInteiro(0, animais.length);
  const animalSorteado = animais[indiceSorteado];
  const sorteadoEl = document.querySelector(`#${animalSorteado}`);
    
  return {animal: animalSorteado, el: sorteadoEl};
}

function darComidaParaAnimal(e) {
  const animalEl = e.currentTarget;
  if (animalEl.classList.contains('com-fome')) {
    // animal com fome foi clicado - ganha 1 ponto
    atualizaPontuacao(pontuacao.pontos + 1);
    alteraEstadoDoAnimal(animalEl, 'satisfeito');
    comandoEl.classList.remove('visivel');

    clearTimeout(temporizadorProximoAnimal);
    temporizadorProximoAnimal = setTimeout(loopDoJogo, TEMPO_PARA_DAR_COMIDA/2);

  } else if (!animalEl.classList.contains('satisfeito')) {
    // animal quieto foi clicado - perde 1 ponto
    alteraEstadoDoAnimal(animalEl, 'foi-incomodado');
    atualizaPontuacao(pontuacao.pontos - 1);

    clearTimeout(temporizadorProximoAnimal);
    temporizadorProximoAnimal = setTimeout(loopDoJogo, TEMPO_PARA_DAR_COMIDA/2);
  }
}

function naoComeuEAtacou(animalEl) {
  alteraEstadoDoAnimal(animalEl, 'atacando');
  atualizaPontuacao(pontuacao.pontos - 2);
}

function loopDoJogo() {
  // verifica se tem algum animal com fome - se tiver, 
  // ele ataca e o jogador perde pontos
  const animalComFomeEl = document.querySelector('.com-fome');
  if (animalComFomeEl) {
    naoComeuEAtacou(animalComFomeEl);
  }

  // escolhe um animal aleatório que vai ficar com fome 
  const {animal, el} = escolheAnimal();
  
  // define um animal que está com fome
  alteraEstadoDoAnimal(el, 'com-fome');

  // exibe o comando para o usuário
  comandoEl.innerHTML = animal;
  comandoEl.classList.add('visivel');
  clearTimeout(temporizadorComando);
  temporizadorComando = setTimeout(() => comandoEl.classList.remove('visivel'), DURACAO_COMANDO_VISIVEL)

  // registra a chamada para o próximo animal
  temporizadorProximoAnimal = setTimeout(loopDoJogo,
    TEMPO_PARA_DAR_COMIDA + Math.random() * TEMPO_PARA_DAR_COMIDA/2);
}

function comecar() {
  parar();
  atualizaPontuacao(0);
  animais = sorteiaAnimaisDaPartida(6);
  preencheAnimaisNaTela();
  loopDoJogo();
}

function parar() {
  clearTimeout(temporizadorProximoAnimal);
  clearTimeout(temporizadorComando);
  const elementoAnimais = document.querySelectorAll('.animal');

  for (let animalEl of elementoAnimais) {
    animalEl.classList.remove(...ESTADOS_POSSIVEIS);
    animalEl.removeEventListener('click', darComidaParaAnimal);
  }

  comandoEl.classList.remove('visivel');
}

function atualizaPontuacao(nova) {
  if (nova > pontuacao.pontos) {
    somDeSucesso.play();
  } else if (nova < pontuacao.pontos) {
    somDeErro.play();
  }
  pontuacao.pontos = nova;
  elementoPontuacao.innerHTML = pontuacao.pontos;
  elementoPontuacao.classList.toggle('positiva', pontuacao.pontos > 0);
  elementoPontuacao.classList.toggle('negativa', pontuacao.pontos < 0);
}


const botaoComecarEl = document.querySelector('#comecar');
const botaoPararEl = document.querySelector('#parar');

botaoComecarEl.addEventListener('click', comecar);
botaoPararEl.addEventListener('click', parar);
