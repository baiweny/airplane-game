// 游戏常量
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SPEED = 5;
const BASE_FIRE_RATE = 200; // 基础射击间隔（毫秒）
const ENEMY_SPAWN_RATE = 800; // 怪物生成间隔（毫秒）

// 子弹类型
const BULLET_TYPES = {
    BASE: 'base',
    SHOTGUN: 'shotgun',
    HOMING: 'homing',
    LASER: 'laser'
};

// 怪物类型
const ENEMY_TYPES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
};

// 奖励类型
const POWER_UP_TYPES = {
    SHOTGUN: 'shotgun',
    HOMING: 'homing',
    LASER: 'laser'
};

// 游戏状态
let gameState = {
    score: 0,
    lives: 3,
    bulletType: BULLET_TYPES.BASE,
    isRunning: false,
    lastEnemySpawn: 0,
    entities: [],
    keys: {},
    stars: [] // 星空背景
};

// 游戏对象
let canvas, ctx;
let player;
let animationId;

// DOM元素
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const gameOverMenu = document.getElementById('game-over');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const bulletTypeElement = document.getElementById('bullet-type');
const finalScoreElement = document.getElementById('final-score');

// 初始化星空背景
function initStars() {
    gameState.stars = [];
    for (let i = 0; i < 100; i++) {
        gameState.stars.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.8 + 0.2
        });
    }
}

// 更新星空背景
function updateStars() {
    for (let star of gameState.stars) {
        star.y += star.speed;
        if (star.y > CANVAS_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * CANVAS_WIDTH;
        }
        // 星星闪烁效果
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
    }
}

// 渲染星空背景
function renderStars() {
    for (let star of gameState.stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 初始化游戏
function init() {
    // 初始化画布
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // 初始化星空背景
    initStars();
    
    // 初始化事件监听
    initEventListeners();
    
    // 显示主菜单
    showMainMenu();
}

// 初始化事件监听
function initEventListeners() {
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key.toLowerCase()] = false;
    });
    
    // 按钮事件
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    menuBtn.addEventListener('click', showMainMenu);
}

// 显示主菜单
function showMainMenu() {
    mainMenu.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    gameState.isRunning = false;
    cancelAnimationFrame(animationId);
}

// 开始游戏
function startGame() {
    // 重置游戏状态
    resetGame();
    
    // 隐藏主菜单，显示游戏屏幕
    mainMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameOverMenu.classList.add('hidden');
    
    // 初始化玩家
    player = new Player(CANVAS_WIDTH / 2 - 25, CANVAS_HEIGHT - 70, 50, 50);
    gameState.entities.push(player);
    
    // 开始游戏循环
    gameState.isRunning = true;
    gameLoop();
}

// 重置游戏
function resetGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.bulletType = BULLET_TYPES.BASE;
    gameState.entities = [];
    gameState.lastEnemySpawn = 0;
    updateUI();
}

// 重新开始游戏
function restartGame() {
    startGame();
}

// 游戏结束
function gameOver() {
    gameState.isRunning = false;
    cancelAnimationFrame(animationId);
    
    // 显示游戏结束菜单
    gameScreen.classList.add('hidden');
    gameOverMenu.classList.remove('hidden');
    finalScoreElement.textContent = gameState.score;
}

// 更新UI
function updateUI() {
    scoreElement.textContent = gameState.score;
    livesElement.textContent = gameState.lives;
    
    // 更新子弹类型显示
    switch(gameState.bulletType) {
        case BULLET_TYPES.BASE:
            bulletTypeElement.textContent = '基础';
            break;
        case BULLET_TYPES.SHOTGUN:
            bulletTypeElement.textContent = '散弹';
            break;
        case BULLET_TYPES.HOMING:
            bulletTypeElement.textContent = '跟踪弹';
            break;
        case BULLET_TYPES.LASER:
            bulletTypeElement.textContent = '激光';
            break;
    }
}

// 游戏循环
function gameLoop() {
    if (!gameState.isRunning) return;
    
    // 清空画布
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, '#0a192f');
    bgGradient.addColorStop(0.5, '#172a45');
    bgGradient.addColorStop(1, '#0a192f');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 渲染星空背景
    renderStars();
    
    // 更新星空
    updateStars();
    
    // 更新游戏状态
    update();
    
    // 渲染游戏
    render();
    
    // 继续游戏循环
    animationId = requestAnimationFrame(gameLoop);
}

// 更新游戏状态
function update() {
    // 更新玩家
    updatePlayer();
    
    // 生成怪物
    spawnEnemies();
    
    // 更新所有实体
    for (let i = gameState.entities.length - 1; i >= 0; i--) {
        const entity = gameState.entities[i];
        entity.update();
        
        // 移除超出屏幕或已销毁的实体
        if (entity.y < -100 || entity.y > CANVAS_HEIGHT + 100 || entity.x < -100 || entity.x > CANVAS_WIDTH + 100 || entity.health <= 0) {
            gameState.entities.splice(i, 1);
        }
    }
    
    // 检测碰撞
    checkCollisions();
    
    // 更新UI
    updateUI();
}

// 更新玩家
function updatePlayer() {
    // 移动玩家 - 同时支持WASD和上下左右键
    if ((gameState.keys['w'] || gameState.keys['arrowup'] || gameState.keys['up']) && player.y > 0) {
        player.y -= PLAYER_SPEED;
    }
    if ((gameState.keys['s'] || gameState.keys['arrowdown'] || gameState.keys['down']) && player.y < CANVAS_HEIGHT - player.height) {
        player.y += PLAYER_SPEED;
    }
    if ((gameState.keys['a'] || gameState.keys['arrowleft'] || gameState.keys['left']) && player.x > 0) {
        player.x -= PLAYER_SPEED;
    }
    if ((gameState.keys['d'] || gameState.keys['arrowright'] || gameState.keys['right']) && player.x < CANVAS_WIDTH - player.width) {
        player.x += PLAYER_SPEED;
    }
    
    // 自动射击
    const now = Date.now();
    if (now - player.lastShotTime > BASE_FIRE_RATE) {
        player.shoot();
        player.lastShotTime = now;
    }
}

// 生成怪物
function spawnEnemies() {
    const now = Date.now();
    if (now - gameState.lastEnemySpawn > ENEMY_SPAWN_RATE) {
        // 随机选择怪物类型
        const enemyTypes = [ENEMY_TYPES.SMALL, ENEMY_TYPES.MEDIUM, ENEMY_TYPES.LARGE];
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        // 随机生成位置
        const x = Math.random() * (CANVAS_WIDTH - 50);
        
        // 创建怪物
        const enemy = new Enemy(x, -50, enemyType);
        gameState.entities.push(enemy);
        
        gameState.lastEnemySpawn = now;
    }
}

// 检测碰撞
function checkCollisions() {
    const bullets = gameState.entities.filter(e => e.type === 'bullet');
    const enemies = gameState.entities.filter(e => e.type === 'enemy');
    const powerUps = gameState.entities.filter(e => e.type === 'powerup');
    
    // 子弹与怪物碰撞
    for (let bullet of bullets) {
        for (let enemy of enemies) {
            if (isColliding(bullet, enemy)) {
                // 减少怪物生命值
                enemy.health -= bullet.damage;
                
                // 销毁子弹（除了激光）
                if (bullet.bulletType !== BULLET_TYPES.LASER) {
                    bullet.health = 0;
                }
                
                // 怪物死亡，生成奖励
                if (enemy.health <= 0) {
                    gameState.score += 10;
                    enemy.dropPowerUp();
                }
            }
        }
    }
    
    // 玩家与怪物碰撞
    for (let enemy of enemies) {
        if (isColliding(player, enemy)) {
            // 减少玩家生命值
            gameState.lives--;
            
            // 销毁怪物
            enemy.health = 0;
            
            // 检查游戏结束
            if (gameState.lives <= 0) {
                gameOver();
                return;
            }
        }
    }
    
    // 玩家与奖励碰撞
    for (let powerUp of powerUps) {
        if (isColliding(player, powerUp)) {
            // 应用奖励效果
            powerUp.applyEffect();
            
            // 销毁奖励
            powerUp.health = 0;
        }
    }
}

// 检测两个实体是否碰撞
function isColliding(entity1, entity2) {
    return entity1.x < entity2.x + entity2.width &&
           entity1.x + entity1.width > entity2.x &&
           entity1.y < entity2.y + entity2.height &&
           entity1.y + entity1.height > entity2.y;
}

// 渲染游戏
function render() {
    // 渲染所有实体
    for (let entity of gameState.entities) {
        entity.render(ctx);
    }
}

// 实体基类
class Entity {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.health = 1;
        this.type = type;
    }
    
    update() {}
    
    render(ctx) {}
    
    destroy() {
        this.health = 0;
    }
}

// 玩家类
class Player extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'player');
        this.bulletType = BULLET_TYPES.BASE;
        this.lastShotTime = 0;
    }
    
    shoot() {
        switch(gameState.bulletType) {
            case BULLET_TYPES.BASE:
                // 基础子弹
                const bullet = new Bullet(this.x + this.width / 2 - 2.5, this.y, 5, 15, BULLET_TYPES.BASE);
                gameState.entities.push(bullet);
                break;
                
            case BULLET_TYPES.SHOTGUN:
                // 散弹（5发）
                for (let i = -2; i <= 2; i++) {
                    const angle = i * 0.1;
                    const bullet = new Bullet(this.x + this.width / 2 - 2.5, this.y, 5, 15, BULLET_TYPES.SHOTGUN, angle);
                    gameState.entities.push(bullet);
                }
                break;
                
            case BULLET_TYPES.HOMING:
                // 跟踪弹
                const enemies = gameState.entities.filter(e => e.type === 'enemy');
                if (enemies.length > 0) {
                    // 找到最近的敌人
                    const nearestEnemy = enemies.reduce((nearest, enemy) => {
                        const distance = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                        const nearestDistance = Math.hypot(nearest.x - this.x, nearest.y - this.y);
                        return distance < nearestDistance ? enemy : nearest;
                    });
                    
                    const bullet = new Bullet(this.x + this.width / 2 - 2.5, this.y, 5, 15, BULLET_TYPES.HOMING, 0, nearestEnemy);
                    gameState.entities.push(bullet);
                } else {
                    // 没有敌人，发射普通子弹
                    const bullet = new Bullet(this.x + this.width / 2 - 2.5, this.y, 5, 15, BULLET_TYPES.BASE);
                    gameState.entities.push(bullet);
                }
                break;
                
            case BULLET_TYPES.LASER:
                // 激光
                const laser = new Bullet(this.x + this.width / 2 - 5, this.y, 10, 100, BULLET_TYPES.LASER);
                gameState.entities.push(laser);
                break;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // 绘制飞机主体 - 三角形机身
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
        gradient.addColorStop(0, '#0044cc');
        gradient.addColorStop(0.5, '#00ffff');
        gradient.addColorStop(1, '#0044cc');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height * 0.7);
        ctx.lineTo(this.x + 10, this.y + this.height * 0.7);
        ctx.lineTo(this.x + 15, this.y + this.height);
        ctx.lineTo(this.x + this.width - 15, this.y + this.height);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.7);
        ctx.closePath();
        ctx.fill();
        
        // 绘制边框
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制驾驶舱
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.3, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        
        // 绘制引擎火焰
        const flameGradient = ctx.createLinearGradient(this.x + 15, this.y + this.height, this.x + 15, this.y + this.height + 20);
        flameGradient.addColorStop(0, '#ffffff');
        flameGradient.addColorStop(0.5, '#ff8800');
        flameGradient.addColorStop(1, '#ff0000');
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + this.height);
        ctx.lineTo(this.x + 10, this.y + this.height + 20);
        ctx.lineTo(this.x + 20, this.y + this.height + 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 15, this.y + this.height);
        ctx.lineTo(this.x + this.width - 20, this.y + this.height + 20);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height + 20);
        ctx.closePath();
        ctx.fill();
        
        // 绘制机翼装饰
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + this.width / 2 - 2, this.y + this.height * 0.5, 4, 15);
        
        ctx.restore();
    }
}

// 子弹类
class Bullet extends Entity {
    constructor(x, y, width, height, bulletType, angle = 0, target = null) {
        super(x, y, width, height, 'bullet');
        this.bulletType = bulletType;
        this.speed = 8;
        this.damage = 1;
        this.angle = angle;
        this.target = target;
        
        // 根据子弹类型设置属性
        switch(bulletType) {
            case BULLET_TYPES.BASE:
                this.damage = 1;
                this.color = '#ffffff';
                break;
            case BULLET_TYPES.SHOTGUN:
                this.damage = 1;
                this.color = '#ffff00';
                break;
            case BULLET_TYPES.HOMING:
                this.damage = 2;
                this.color = '#ff00ff';
                this.speed = 6;
                break;
            case BULLET_TYPES.LASER:
                this.damage = 3;
                this.color = '#ff0000';
                this.speed = 10;
                this.health = 100; // 激光持续时间
                break;
        }
    }
    
    update() {
        switch(this.bulletType) {
            case BULLET_TYPES.HOMING:
                // 跟踪目标
                if (this.target && this.target.health > 0) {
                    const dx = this.target.x - this.x;
                    const dy = this.target.y - this.y;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * this.speed;
                    this.y += Math.sin(angle) * this.speed;
                } else {
                    // 没有目标，直线飞行
                    this.y -= this.speed;
                }
                break;
                
            case BULLET_TYPES.SHOTGUN:
                // 散弹角度飞行
                this.x += Math.sin(this.angle) * this.speed;
                this.y -= Math.cos(this.angle) * this.speed;
                break;
                
            case BULLET_TYPES.LASER:
                // 激光持续时间
                this.health--;
                // 激光向上移动
                this.y -= this.speed;
                break;
                
            default:
                // 直线飞行
                this.y -= this.speed;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        switch(this.bulletType) {
            case BULLET_TYPES.BASE:
                // 基础子弹 - 带发光效果的子弹
                const baseGradient = ctx.createRadialGradient(
                    this.x + this.width / 2, this.y + this.height / 2, 0,
                    this.x + this.width / 2, this.y + this.height / 2, this.width / 2
                );
                baseGradient.addColorStop(0, '#ffffff');
                baseGradient.addColorStop(0.5, this.color);
                baseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = baseGradient;
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制子弹轨迹
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillRect(this.x + this.width / 2 - 1, this.y + this.height, 2, 10);
                break;
                
            case BULLET_TYPES.SHOTGUN:
                // 散弹 - 带火花效果的子弹
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制火花
                ctx.fillStyle = '#ffff00';
                for (let i = 0; i < 4; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const sparkLength = Math.random() * 5 + 3;
                    const x1 = this.x + this.width / 2 + Math.cos(angle) * this.width / 2;
                    const y1 = this.y + this.height / 2 + Math.sin(angle) * this.height / 2;
                    const x2 = x1 + Math.cos(angle) * sparkLength;
                    const y2 = y1 + Math.sin(angle) * sparkLength;
                    
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                break;
                
            case BULLET_TYPES.HOMING:
                // 跟踪弹 - 带旋转轨迹的子弹
                // 绘制旋转光环
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        this.x + this.width / 2,
                        this.y + this.height / 2,
                        this.width / 2 + i * 3,
                        0,
                        Math.PI * 2
                    );
                    ctx.stroke();
                }
                
                // 绘制中心核心
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制跟踪箭头
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x, this.y + this.height);
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height);
                ctx.stroke();
                break;
                
            case BULLET_TYPES.LASER:
                // 激光 - 带能量波动效果的激光束
                const laserGradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
                laserGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                laserGradient.addColorStop(0.45, this.color);
                laserGradient.addColorStop(0.5, '#ffffff');
                laserGradient.addColorStop(0.55, this.color);
                laserGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = laserGradient;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                
                // 绘制能量波动
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                
                // 绘制激光粒子效果
                ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 5; i++) {
                    const particleY = this.y + Math.random() * this.height;
                    ctx.fillRect(this.x - 3, particleY, 3, 2);
                    ctx.fillRect(this.x + this.width, particleY, 3, 2);
                }
                break;
        }
        
        ctx.restore();
    }
}

// 怪物类
class Enemy extends Entity {
    constructor(x, y, enemyType) {
        let width, height, health, speed, color;
        
        // 根据怪物类型设置属性
        switch(enemyType) {
            case ENEMY_TYPES.SMALL:
                width = 30;
                height = 30;
                health = 1;
                speed = 2;
                color = '#00ff00';
                break;
                
            case ENEMY_TYPES.MEDIUM:
                width = 50;
                height = 50;
                health = 3;
                speed = 1.5;
                color = '#ffa500';
                break;
                
            case ENEMY_TYPES.LARGE:
                width = 70;
                height = 70;
                health = 5;
                speed = 1;
                color = '#ff0000';
                break;
        }
        
        super(x, y, width, height, 'enemy');
        this.enemyType = enemyType;
        this.health = health;
        this.speed = speed;
        this.color = color;
        this.dropRate = 0.3; // 30%掉落率
        this.movePattern = Math.random() > 0.5 ? 'straight' : 'zigzag';
        this.zigzagDirection = 1;
        this.zigzagTimer = 0;
    }
    
    update() {
        switch(this.movePattern) {
            case 'straight':
                // 直线下落
                this.y += this.speed;
                break;
                
            case 'zigzag':
                //  zigzag移动
                this.y += this.speed;
                this.x += this.zigzagDirection * this.speed;
                this.zigzagTimer++;
                
                if (this.zigzagTimer > 50) {
                    this.zigzagDirection *= -1;
                    this.zigzagTimer = 0;
                }
                
                // 限制在屏幕内
                if (this.x < 0 || this.x > CANVAS_WIDTH - this.width) {
                    this.zigzagDirection *= -1;
                }
                break;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        switch(this.enemyType) {
            case ENEMY_TYPES.SMALL:
                // 小型敌人 - 菱形
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(centerX, this.y);
                ctx.lineTo(this.x + this.width, centerY);
                ctx.lineTo(centerX, this.y + this.height);
                ctx.lineTo(this.x, centerY);
                ctx.closePath();
                ctx.fill();
                
                // 绘制眼睛
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(centerX - 5, centerY - 5, 3, 0, Math.PI * 2);
                ctx.arc(centerX + 5, centerY - 5, 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(centerX - 5, centerY - 5, 1, 0, Math.PI * 2);
                ctx.arc(centerX + 5, centerY - 5, 1, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制尖刺
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const x1 = centerX + Math.cos(angle) * (this.width / 2);
                    const y1 = centerY + Math.sin(angle) * (this.height / 2);
                    const x2 = centerX + Math.cos(angle) * (this.width / 2 + 5);
                    const y2 = centerY + Math.sin(angle) * (this.height / 2 + 5);
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                break;
                
            case ENEMY_TYPES.MEDIUM:
                // 中型敌人 - 六边形飞船
                ctx.fillStyle = this.color;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    const x = centerX + Math.cos(angle) * (this.width / 2);
                    const y = centerY + Math.sin(angle) * (this.height / 2);
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
                
                // 绘制驾驶舱
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // 绘制武器炮管
                ctx.fillStyle = '#333333';
                ctx.fillRect(centerX - 3, this.y - 10, 6, 10);
                ctx.fillRect(centerX - 15, centerY - 3, 10, 6);
                ctx.fillRect(centerX + 5, centerY - 3, 10, 6);
                break;
                
            case ENEMY_TYPES.LARGE:
                // 大型敌人 - 带翅膀的飞船
                // 绘制主体
                const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
                gradient.addColorStop(0, '#660000');
                gradient.addColorStop(0.5, this.color);
                gradient.addColorStop(1, '#660000');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(centerX, this.y);
                ctx.lineTo(this.x, centerY);
                ctx.lineTo(this.x + 10, this.y + this.height);
                ctx.lineTo(this.x + this.width - 10, this.y + this.height);
                ctx.lineTo(this.x + this.width, centerY);
                ctx.closePath();
                ctx.fill();
                
                // 绘制边框
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // 绘制翅膀
                ctx.fillStyle = '#880000';
                ctx.beginPath();
                ctx.moveTo(this.x + 10, centerY - 10);
                ctx.lineTo(this.x - 20, centerY - 30);
                ctx.lineTo(this.x + 10, centerY - 20);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(this.x + this.width - 10, centerY - 10);
                ctx.lineTo(this.x + this.width + 20, centerY - 30);
                ctx.lineTo(this.x + this.width - 10, centerY - 20);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // 绘制多个眼睛
                ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 5; i++) {
                    const eyeX = this.x + 15 + i * 10;
                    ctx.beginPath();
                    ctx.arc(eyeX, centerY, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(eyeX, centerY, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                }
                break;
        }
        
        // 绘制生命值
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.health, centerX, this.y + this.height + 15);
        
        ctx.restore();
    }
    
    dropPowerUp() {
        // 随机掉落奖励
        if (Math.random() < this.dropRate) {
            const powerUpTypes = [POWER_UP_TYPES.SHOTGUN, POWER_UP_TYPES.HOMING, POWER_UP_TYPES.LASER];
            const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            
            const powerUp = new PowerUp(this.x + this.width / 2 - 10, this.y + this.height, 20, 20, powerUpType);
            gameState.entities.push(powerUp);
        }
    }
}

// 奖励类
class PowerUp extends Entity {
    constructor(x, y, width, height, powerUpType) {
        super(x, y, width, height, 'powerup');
        this.powerUpType = powerUpType;
        this.speed = 2;
        this.rotation = 0;
        
        // 根据奖励类型设置颜色
        switch(powerUpType) {
            case POWER_UP_TYPES.SHOTGUN:
                this.color = '#ffff00';
                this.text = 'S';
                break;
            case POWER_UP_TYPES.HOMING:
                this.color = '#ff00ff';
                this.text = 'H';
                break;
            case POWER_UP_TYPES.LASER:
                this.color = '#ff0000';
                this.text = 'L';
                break;
        }
    }
    
    update() {
        // 向下移动
        this.y += this.speed;
        
        // 旋转效果
        this.rotation += 0.1;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // 绘制旋转光环
        const光环Radius = this.width / 2 + 5;
        const光环Gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 光环Radius);
        光环Gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        光环Gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
        光环Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = 光环Gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 光环Radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制奖励主体
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        switch(this.powerUpType) {
            case POWER_UP_TYPES.SHOTGUN:
                // 散弹奖励 - 扩散效果图标
                ctx.beginPath();
                ctx.moveTo(0, -this.height / 3);
                ctx.lineTo(-this.width / 3, this.height / 3);
                ctx.lineTo(0, this.height / 4);
                ctx.lineTo(this.width / 3, this.height / 3);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // 绘制散弹扩散线条
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                for (let i = -2; i <= 2; i++) {
                    const angle = i * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.sin(angle) * this.width / 2, Math.cos(angle) * this.height / 2);
                    ctx.stroke();
                }
                break;
                
            case POWER_UP_TYPES.HOMING:
                // 跟踪弹奖励 - 目标追踪图标
                // 绘制目标圆圈
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // 绘制十字线
                ctx.beginPath();
                ctx.moveTo(-this.width / 3, 0);
                ctx.lineTo(this.width / 3, 0);
                ctx.moveTo(0, -this.height / 3);
                ctx.lineTo(0, this.height / 3);
                ctx.stroke();
                
                // 绘制追踪箭头
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(0, -this.height / 2);
                ctx.lineTo(-this.width / 5, 0);
                ctx.lineTo(0, -this.height / 5);
                ctx.lineTo(this.width / 5, 0);
                ctx.closePath();
                ctx.fill();
                break;
                
            case POWER_UP_TYPES.LASER:
                // 激光奖励 - 光束效果图标
                // 绘制激光束
                const laserWidth = this.width / 4;
                const laserHeight = this.height / 2;
                
                const laserGradient = ctx.createLinearGradient(-laserWidth, -laserHeight, laserWidth, laserHeight);
                laserGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                laserGradient.addColorStop(0.45, this.color);
                laserGradient.addColorStop(0.5, '#ffffff');
                laserGradient.addColorStop(0.55, this.color);
                laserGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = laserGradient;
                ctx.fillRect(-laserWidth, -laserHeight, laserWidth * 2, laserHeight * 2);
                ctx.strokeStyle = '#ffffff';
                ctx.strokeRect(-laserWidth, -laserHeight, laserWidth * 2, laserHeight * 2);
                
                // 绘制激光波纹
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    const offset = i * 5;
                    ctx.beginPath();
                    ctx.moveTo(-laserWidth - offset, -laserHeight + offset);
                    ctx.lineTo(laserWidth + offset, -laserHeight + offset);
                    ctx.moveTo(-laserWidth - offset, laserHeight - offset);
                    ctx.lineTo(laserWidth + offset, laserHeight - offset);
                    ctx.stroke();
                }
                break;
        }
        
        ctx.restore();
    }
    
    applyEffect() {
        // 应用奖励效果
        switch(this.powerUpType) {
            case POWER_UP_TYPES.SHOTGUN:
                gameState.bulletType = BULLET_TYPES.SHOTGUN;
                break;
            case POWER_UP_TYPES.HOMING:
                gameState.bulletType = BULLET_TYPES.HOMING;
                break;
            case POWER_UP_TYPES.LASER:
                gameState.bulletType = BULLET_TYPES.LASER;
                break;
        }
    }
}

// 游戏初始化
window.addEventListener('DOMContentLoaded', init);