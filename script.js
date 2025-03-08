// 动漫数据存储
let animes = [];

// 从JSON文件读取数据
async function loadAnimes() {
  try {
    const response = await fetch('./data.json');
    animes = await response.json();
  } catch (error) {
    console.error('加载动漫数据失败:', error);
    animes = [];
  }
}

// DOM元素
const animeList = document.getElementById('anime-list');
const tabButtons = document.querySelectorAll('.tab-btn');

// 当前选中的日期
let currentDay = 'all';

// 初始化应用
async function init() {
  // 加载数据
  await loadAnimes();

  // 设置当前日期为默认选中
  const today = new Date().getDay().toString();
  currentDay = today;

  // 高亮当前日期标签
  highlightCurrentTab();

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

  card.innerHTML = `
        <img src="${anime.image}" alt="${anime.name}" class="anime-image">
        <div class="anime-info">
            <div class="anime-name">${anime.name}</div>
            <div class="anime-platform">播放平台: ${anime.platform || "未知平台"}</div>
            <div class="anime-air-time">播出时间: ${anime.airTime || '未设置'}</div>
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
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);