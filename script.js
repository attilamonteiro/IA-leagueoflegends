const routes = {
  champions: "http://sdw24.us-east-1.elasticbeanstalk.com/lol-api/champions",
  ask: "http://sdw24.us-east-1.elasticbeanstalk.com/lol-api/champions/{id}/ask",
};

const apiService = {
  async getChampions() {
    try {
      const route = routes.champions;
      const response = await fetch(route);
      if (!response.ok) {
        throw new Error('Failed to fetch champions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching champions:', error);
      throw error;
    }
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

    try {
      const response = await fetch(route, options);
      if (!response.ok) {
        throw new Error('Failed to post ask champion');
      }
      return await response.json();
    } catch (error) {
      console.error('Error posting ask champion:', error);
      throw error;
    }
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
}

async function loadCharacters() {
  try {
    const data = await apiService.getChampions();
    state.values.characters = data;
    await renderCharacters();
  } catch (error) {
    console.error('Error loading characters:', error);
    // Aqui você pode adicionar um tratamento de erro adicional, como exibir uma mensagem para o usuário informando que houve um problema ao carregar os personagens
  }
}

async function fetchAskChampion() {
  document.body.style.cursor = "wait";
  const id = state.view.avatar.dataset.id;
  const message = state.view.question.value;
  try {
    const response = await apiService.postAskChampion(id, message);
    state.view.response.textContent = response.answer;
  } catch (error) {
    console.error('Error posting ask champion:', error);
    // Aqui você pode adicionar um tratamento de erro adicional, como exibir uma mensagem para o usuário informando que houve um problema ao enviar a pergunta
  } finally {
    document.body.style.cursor = "default";
  }
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

main();
