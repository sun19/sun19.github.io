// 动漫数据存储在localStorage中
let animes = JSON.parse(localStorage.getItem('animes')) || [];

// 检查并更新动漫集数
function checkAndUpdateEpisodes() {
  const now = new Date();
  let updated = false;

  animes.forEach(anime => {
    if (!anime.addDate) {
      // 为旧数据添加添加日期
      anime.addDate = now.toISOString();
      anime.lastUpdateDate = now.toISOString();
      return;
    }

    const lastUpdate = new Date(anime.lastUpdateDate);
    const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

    // 如果过了7天或更多，更新集数
    if (daysSinceLastUpdate >= 7) {
      // 计算应该增加的集数（每7天增加一集）
      const episodesToAdd = Math.floor(daysSinceLastUpdate / 7);
      anime.episode = (parseInt(anime.episode) + episodesToAdd).toString();
      anime.lastUpdateDate = now.toISOString();
      updated = true;
    }
  });

  // 如果有更新，保存到localStorage并重新渲染
  if (updated) {
    localStorage.setItem('animes', JSON.stringify(animes));
    renderAnimes(currentDay);
  }
}

// DOM元素
const addAnimeBtn = document.getElementById('add-anime-btn');
const animeModal = document.getElementById('anime-modal');
const modalClose = document.querySelector('.close');
const animeForm = document.getElementById('anime-form');
const modalTitle = document.getElementById('modal-title');
const animeIdInput = document.getElementById('anime-id');
const animeNameInput = document.getElementById('anime-name');
const animeDayInput = document.getElementById('anime-day');
const animePlatformInput = document.getElementById('anime-platform');
const animeEpisodeInput = document.getElementById('anime-episode');
const animeImageInput = document.getElementById('anime-image');
const animeList = document.getElementById('anime-list');
const tabButtons = document.querySelectorAll('.tab-btn');
const animeAirTimeInput = document.getElementById('anime-air-time');

// 当前选中的日期
let currentDay = 'all';

// 初始化应用
function init() {
  // 设置当前日期为默认选中
  const today = new Date().getDay().toString();
  currentDay = today;

  // 高亮当前日期标签
  highlightCurrentTab();

  // 检查并更新动漫集数
  checkAndUpdateEpisodes();

  // 渲染动漫列表
  renderAnimes(currentDay);

  // 事件监听
  addEventListeners();
}

// 高亮当前标签
function highlightCurrentTab() {
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.day === currentDay) {
      btn.classList.add('active');
    }
  });
}

// 渲染动漫列表
function renderAnimes(filterDay = 'all') {
  // 清空动漫列表
  animeList.innerHTML = '';

  // 根据筛选条件渲染动漫
  const filteredAnimes = filterDay === 'all'
    ? animes
    : animes.filter(anime => anime.day.toString() === filterDay);

  filteredAnimes.forEach(anime => {
    animeList.appendChild(createAnimeCard(anime));
  });
}

// 创建动漫卡片
function createAnimeCard(anime) {
  const card = document.createElement('div');
  card.className = 'anime-card';
  card.dataset.id = anime.id;

  // 获取平台显示名称
  let platformName = "未知平台";
  switch (anime.platform) {
    case 'bilibili':
      platformName = "哔哩哔哩";
      break;
    case 'tencent':
      platformName = "腾讯视频";
      break;
    case 'youku':
      platformName = "优酷视频";
      break;
  }

  card.innerHTML = `
        <img src="${anime.image}" alt="${anime.name}" class="anime-image">
        <div class="anime-info">
            <div class="anime-name">${anime.name}</div>
            <div class="anime-platform">播放平台: ${platformName}</div>
            <div class="anime-episode">更新至: ${anime.episode}</div>
            <div class="anime-air-time">播出时间: ${anime.airTime || '未设置'}</div>
            <div class="anime-actions">
                <button class="edit-btn" data-id="${anime.id}">编辑</button>
                <button class="delete-btn" data-id="${anime.id}">删除</button>
            </div>
        </div>
    `;

  return card;
}

// 添加事件监听
function addEventListeners() {
  // 标签切换事件
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentDay = btn.dataset.day;
      highlightCurrentTab();
      renderAnimes(currentDay);
    });
  });

  // 添加动漫按钮
  addAnimeBtn.addEventListener('click', () => {
    openModal();
  });

  // 关闭模态框
  modalClose.addEventListener('click', () => {
    closeModal();
  });

  // 点击模态框外部关闭
  window.addEventListener('click', (e) => {
    if (e.target === animeModal) {
      closeModal();
    }
  });

  // 表单提交
  animeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveAnime();
  });

  // 编辑和删除按钮的事件委托
  animeList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.id;
      editAnime(id);
    } else if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      deleteAnime(id);
    }
  });
}

// 打开模态框
function openModal(anime = null) {
  // 重置表单
  animeForm.reset();
  animeIdInput.value = '';

  // 如果是编辑模式，填充表单
  if (anime) {
    modalTitle.textContent = '编辑动漫';
    animeIdInput.value = anime.id;
    animeNameInput.value = anime.name;
    animeDayInput.value = anime.day;
    animePlatformInput.value = anime.platform || 'bilibili';
    animeEpisodeInput.value = anime.episode;
    animeImageInput.value = anime.image;
    animeAirTimeInput.value = anime.airTime || '';
  } else {
    modalTitle.textContent = '添加新动漫';
  }

  // 显示模态框
  animeModal.style.display = 'block';
}

// 关闭模态框
function closeModal() {
  animeModal.style.display = 'none';
}

// 保存动漫
function saveAnime() {
  const id = animeIdInput.value || Date.now().toString();
  const name = animeNameInput.value;
  const day = animeDayInput.value;
  const platform = animePlatformInput.value;
  const episode = animeEpisodeInput.value;
  const image = animeImageInput.value;
  const airTime = animeAirTimeInput.value;
  const now = new Date();

  const anime = {
    id,
    name,
    day,
    platform,
    episode,
    image,
    airTime,
    addDate: now.toISOString(),
    lastUpdateDate: now.toISOString()
  };

  // 如果是编辑现有动漫
  if (animeIdInput.value) {
    const index = animes.findIndex(a => a.id === id);
    if (index !== -1) {
      // 保留原始添加日期
      anime.addDate = animes[index].addDate || now.toISOString();
      animes[index] = anime;
    }
  } else {
    // 添加新动漫
    animes.push(anime);
  }

  // 保存到localStorage
  localStorage.setItem('animes', JSON.stringify(animes));

  // 重新渲染并关闭模态框
  renderAnimes(currentDay);
  closeModal();
}

// 编辑动漫
function editAnime(id) {
  const anime = animes.find(a => a.id === id);
  if (anime) {
    openModal(anime);
  }
}

// 删除动漫
function deleteAnime(id) {
  if (confirm('确定要删除这个动漫吗？')) {
    animes = animes.filter(a => a.id !== id);
    localStorage.setItem('animes', JSON.stringify(animes));
    renderAnimes(currentDay);
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);