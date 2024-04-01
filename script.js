const routes = {
  champions: "http://sdw24.us-east-1.elasticbeanstalk.com/lol-api/champions",
  ask: "http://sdw24.us-east-1.elasticbeanstalk.com/lol-api/champions/{id}/ask",
};

const apiService = {
  async getChampions() {
    const route = routes.champions;
    const response = await fetch(route);
    return await response.json();
  },
  async postAskChampion(id, message) {
    const route = routes.ask.replace("{id}", id);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }),
    };

    const response = await fetch(route, options);
    return await response.json();
  },
};

const state = {
  values: {
    characters: [],
  },
  view: {
    response: document.querySelector(".text-reponse"),
    question: document.querySelector("#text-request"),
    avatar: document.getElementById("avatar"),
    carousel: document.getElementById("carousel-cards-content"),
  },
};

async function main() {
  await loadCharacters();
  await resetForm();
  await loadCarousel();
}

async function loadCharacters() {
  const data = await apiService.getChampions();
  state.values.characters = data;
  await renderCharacters();
}

async function fetchAskChampion() {
  document.body.style.cursor = "wait";
  const id = state.view.avatar.dataset.id;
  const message = state.view.question.value;
  const response = await apiService.postAskChampion(id, message);
  state.view.response.textContent = response.answer;
  document.body.style.cursor = "default";
}

async function renderCharacters() {
  const charactersData = state.values.characters;
  const characterElements = charactersData.map(
    (character) => `
    <div class="timeline-carousel__item" onclick="onChangeCharacterSelected(${character.id},'${character.imageUrl}')">
      <div class="timeline-carousel__image">
        <div class="media-wrapper media-wrapper--overlay" style="background: url('${character.imageUrl}') center center; background-size:cover;"></div>
      </div>
      <div class="timeline-carousel__item-inner">
        <span class="name">${character.name}</span>
        <span class="role">${character.role}</span>
        <p>${character.lore}</p>
      </div>
    </div>`
  );
  state.view.carousel.innerHTML = characterElements.join("");
}

async function onChangeCharacterSelected(id, imageUrl) {
  state.view.avatar.style.backgroundImage = `url('${imageUrl}')`;
  state.view.avatar.dataset.id = id;
  await resetForm();
}

async function resetForm() {
  state.view.question.value = "";
  state.view.response.textContent = await getRandomQuote();
}

async function getRandomQuote() {
  const quotes = [
    "Manda Ver meu nobre",
    "Pode vir quente que eu to fervendo",
    "Aguardo sua pergunta",
    "Espero anciosamente pela sua pergunta",
    "Estou começando a ficar com tédio...",
    "Tenha vidas a salvar, vá depressa com isso",
    "Não vai ficar ai o dia todo vai ?",
    "Talvez seja melhor ir jogar Dota...",
    "Ainda to tentando entender como essa giringonça funciona",
    "Vamo que vamo meu chapa",
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);

  return quotes[randomIndex];
}

async function loadCarousel() {
  const carousel = state.view.carousel;
  carousel.classList.add("timeline-carousel"); // Adicione a classe do carrossel aqui, se necessário

  // Adicione o código para inicializar o carrossel aqui, usando métodos padrão do JavaScript
  // Por exemplo:
  // carousel.style.display = 'block'; // Exemplo de configuração CSS
  // carousel.style.width = '100%'; // Exemplo de configuração CSS
  // ...

  // Adicione estilos CSS necessários para o carrossel aqui, se necessário
}

main();
