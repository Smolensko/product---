import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('huashitongjian.db');

// 创建表
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT,
    dynasty TEXT,
    figures TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    alias TEXT,
    birth_year TEXT,
    death_year TEXT,
    dynasty TEXT,
    role TEXT,
    description TEXT NOT NULL,
    image TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Dynasties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    period TEXT NOT NULL,
    capital TEXT,
    achievements TEXT,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// 插入示例数据
const insertSampleData = () => {
  const eventCount = sqlite.prepare('SELECT COUNT(*) as count FROM Events').get() as { count: number };
  if (eventCount.count === 0) {
    const insertEvent = sqlite.prepare(`
      INSERT INTO Events (title, year, location, dynasty, figures, description, category, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const events = [
      ['赤壁之战', '公元208年', '湖北赤壁', '三国时期', '曹操,周瑜,诸葛亮', '建安十三年（208年），曹操率大军南下，孙刘联军以少胜多，于赤壁大败曹军，奠定三国鼎立格局。', '历史事件', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80'],
      ['郑和下西洋', '1405—1433年', '南海至非洲', '明朝', '郑和,永乐帝', '明永乐年间，郑和率庞大船队七次远航，最远抵达非洲东海岸，是世界航海史上的壮举。', '历史事件', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'],
      ['安史之乱', '755—763年', '唐朝全境', '唐朝', '安禄山,史思明,唐玄宗', '唐朝天宝十四年，安禄山发动叛乱，历时8年，是唐朝由盛转衰的转折点。', '历史事件', 'https://images.unsplash.com/photo-1707414021341-132ee07b62c5?w=800&q=80'],
      ['秦始皇统一中国', '公元前221年', '中国全境', '秦朝', '秦始皇', '秦王嬴政统一六国，建立中国历史上第一个大一统王朝，实行郡县制，统一文字、度量衡。', '历史事件', 'https://images.unsplash.com/photo-1707414016759-377d827a721a?w=800&q=80'],
      ['贞观之治', '627—649年', '长安', '唐朝', '唐太宗,魏征', '唐太宗李世民在位期间，政治清明，经济繁荣，文化昌盛，开创了唐朝盛世局面。', '历史事件', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'],
      ['鸦片战争', '1840—1842年', '广东、南京', '清朝', '林则徐,道光帝', '英国以禁烟为借口发动侵略战争，清政府战败，签订《南京条约》，中国开始沦为半殖民地半封建社会。', '历史事件', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80'],
    ];

    for (const event of events) {
      insertEvent.run(...event);
    }
  }

  const personCount = sqlite.prepare('SELECT COUNT(*) as count FROM Persons').get() as { count: number };
  if (personCount.count === 0) {
    const insertPerson = sqlite.prepare(`
      INSERT INTO Persons (name, alias, birth_year, death_year, dynasty, role, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const persons = [
      ['武则天', '武媚', '624年', '705年', '唐朝 / 武周', '女皇帝', '中国历史上唯一正统女皇帝，在位期间励精图治，开创武周政权，推动科举制度发展。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80'],
      ['李白', '李太白', '701年', '762年', '唐朝', '诗人', '唐朝伟大浪漫主义诗人，被称为"诗仙"，与杜甫并称"李杜"，作品豪迈飘逸，影响深远。', 'https://images.unsplash.com/photo-1762115839715-fbd4e2c65260?w=400&q=80'],
      ['秦始皇', '嬴政', '前259年', '前210年', '秦朝', '皇帝', '中国历史上第一个大一统王朝秦朝的开国皇帝，结束春秋战国分裂局面，建立中央集权封建制度。', 'https://images.unsplash.com/photo-1707414016759-377d827a721a?w=400&q=80'],
      ['唐太宗', '李世民', '598年', '649年', '唐朝', '皇帝', '唐朝第二位皇帝，开创贞观之治，被后世尊为千古一帝，政治清明，经济繁荣。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80'],
      ['诸葛亮', '孔明', '181年', '234年', '三国', '政治家', '三国时期蜀汉丞相，杰出的政治家、军事家，鞠躬尽瘁，死而后已。', 'https://images.unsplash.com/photo-1762115839715-fbd4e2c65260?w=400&q=80'],
      ['郑和', '马和', '1371年', '1433年', '明朝', '航海家', '明朝伟大的航海家，七次下西洋，开辟了海上丝绸之路，促进了中外文化交流。', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80'],
    ];

    for (const person of persons) {
      insertPerson.run(...person);
    }
  }

  const dynastyCount = sqlite.prepare('SELECT COUNT(*) as count FROM Dynasties').get() as { count: number };
  if (dynastyCount.count === 0) {
    const insertDynasty = sqlite.prepare(`
      INSERT INTO Dynasties (name, period, capital, achievements, description)
      VALUES (?, ?, ?, ?, ?)
    `);

    const dynasties = [
      ['唐朝', '618—907年', '长安', '科举制度完善,丝绸之路繁荣,诗歌文化鼎盛', '中国封建社会的鼎盛时期，政治开明，经济繁荣，文化辉煌。'],
      ['汉朝', '前206—220年', '长安', '丝绸之路开辟,儒家思想确立,封建制度完善', '中国封建社会的重要朝代，建立了完善的封建制度和儒家文化。'],
      ['宋朝', '960—1279年', '汴京', '印刷术发明,指南针广泛应用,商品经济高度发展', '中国封建社会经济最繁荣的时期，科技文化成就卓越。'],
      ['秦朝', '前221—前207年', '咸阳', '统一文字度量衡,郡县制建立,长城修建', '中国历史上第一个大一统王朝，奠定了中国统一的基础。'],
      ['明朝', '1368—1644年', '北京', '郑和下西洋,紫禁城建造,资本主义萌芽', '中国封建社会后期的强盛王朝，对外交流频繁。'],
      ['清朝', '1644—1912年', '北京', '康乾盛世,版图奠定,文化集成', '中国最后一个封建王朝，疆域辽阔，文化多元。'],
    ];

    for (const dynasty of dynasties) {
      insertDynasty.run(...dynasty);
    }
  }
};

insertSampleData();

export const db = drizzle(sqlite, { schema });
