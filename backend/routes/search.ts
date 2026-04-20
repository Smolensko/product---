import { Router } from 'express';
import { db } from '../db';
import { events, persons, dynasties } from '../db/schema';
import { like, or, sql } from 'drizzle-orm';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: '请提供搜索关键词' });
    }

    const searchTerm = `%${q}%`;
    const searchType = type || 'all';

    const results: any = {
      events: [],
      persons: [],
      dynasties: [],
    };

    if (searchType === 'all' || searchType === '事件') {
      results.events = await db.select().from(events).where(
        or(
          like(events.title, searchTerm),
          like(events.description, searchTerm),
          like(events.dynasty, searchTerm),
          like(events.figures, searchTerm)
        )
      );
    }

    if (searchType === 'all' || searchType === '人物') {
      results.persons = await db.select().from(persons).where(
        or(
          like(persons.name, searchTerm),
          like(persons.alias, searchTerm),
          like(persons.description, searchTerm),
          like(persons.dynasty, searchTerm)
        )
      );
    }

    if (searchType === 'all' || searchType === '政权' || searchType === '时期') {
      results.dynasties = await db.select().from(dynasties).where(
        or(
          like(dynasties.name, searchTerm),
          like(dynasties.description, searchTerm),
          like(dynasties.achievements, searchTerm)
        )
      );
    }

    res.json({
      success: true,
      query: q,
      type: searchType,
      results,
    });
  } catch (error) {
    console.error('搜索错误:', error);
    res.status(500).json({ error: '搜索失败' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const allEvents = await db.select().from(events);
    res.json({ success: true, data: allEvents });
  } catch (error) {
    console.error('获取事件错误:', error);
    res.status(500).json({ error: '获取事件失败' });
  }
});

router.get('/persons', async (req, res) => {
  try {
    const allPersons = await db.select().from(persons);
    res.json({ success: true, data: allPersons });
  } catch (error) {
    console.error('获取人物错误:', error);
    res.status(500).json({ error: '获取人物失败' });
  }
});

router.get('/dynasties', async (req, res) => {
  try {
    const allDynasties = await db.select().from(dynasties);
    res.json({ success: true, data: allDynasties });
  } catch (error) {
    console.error('获取朝代错误:', error);
    res.status(500).json({ error: '获取朝代失败' });
  }
});

export default router;
