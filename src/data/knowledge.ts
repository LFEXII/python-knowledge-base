import type { KnowledgeItem } from '@/types';
import knowledgeData from './python_knowledge.json';

export const knowledgeList: KnowledgeItem[] = knowledgeData as KnowledgeItem[];

export const categories = [...new Set(knowledgeList.map(k => k.category))];

export const categoryColors: Record<string, string> = {
  '基础概念': '#FF6B6B',
  '数据类型': '#4ECDC4',
  '数据结构': '#45B7D1',
  '流程控制': '#96CEB4',
  '函数': '#FFEAA7',
  '模块化': '#DDA0DD',
  '文件操作': '#87CEEB',
  '错误处理': '#F8C471',
  '面向对象': '#BB8FCE',
  '算法': '#85C1E9',
  '高级特性': '#F1948A',
  '文本处理': '#82E0AA',
  '内置工具': '#F7DC6F',
};

export const imageMap: Record<number, string> = {
  1: '/img_variables.png',
  8: '/img_conditionals.png',
  9: '/img_loops.png',
  12: '/img_functions.png',
  19: '/img_classes.png',
  18: '/img_exceptions.png',
};

export function searchKnowledge(query: string): KnowledgeItem[] {
  if (!query.trim()) return knowledgeList;
  const lower = query.toLowerCase();
  return knowledgeList.filter(k =>
    k.title.toLowerCase().includes(lower) ||
    k.definition.toLowerCase().includes(lower) ||
    k.category.toLowerCase().includes(lower) ||
    k.key_points.some(p => p.toLowerCase().includes(lower)) ||
    k.qa_pairs.some(qa =>
      qa.question.toLowerCase().includes(lower) ||
      qa.answer.toLowerCase().includes(lower)
    )
  );
}

export function getKnowledgeById(id: number): KnowledgeItem | undefined {
  return knowledgeList.find(k => k.id === id);
}

export function getAllQA(): { item: KnowledgeItem; qa: { question: string; answer: string } }[] {
  const result: { item: KnowledgeItem; qa: { question: string; answer: string } }[] = [];
  knowledgeList.forEach(item => {
    item.qa_pairs.forEach(qa => {
      result.push({ item, qa });
    });
  });
  return result;
}
