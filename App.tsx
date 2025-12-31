import React, { useState, useEffect } from 'react';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { Item, ViewState } from './types.ts';
import { Header } from './components/Header.tsx';
import { ItemForm } from './components/ItemForm.tsx';
import { ItemList } from './components/ItemList.tsx';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [view, setView] = useState<ViewState>('form');

  useEffect(() => {
    const saved = localStorage.getItem('data_collect');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('data_collect', JSON.stringify(items));
  }, [items]);

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-50 flex flex-col shadow-2xl relative">
      <Header 
        title={view === 'form' ? "数据采集" : "采集清单"} 
        subtitle={view === 'form' ? "AI 驱动的极速录入助手" : "管理并导出您的商品数据"} 
      />

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {view === 'form' ? (
          <ItemForm onSave={(item) => { setItems([item, ...items]); setView('list'); }} />
        ) : (
          <ItemList items={items} onDelete={(id) => setItems(items.filter(i => i.id !== id))} />
        )}
      </main>

      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 bg-white/80 backdrop-blur-md border border-white/20 h-16 rounded-3xl shadow-2xl flex justify-around items-center z-50">
        <button onClick={() => setView('form')} className={`flex flex-col items-center ${view === 'form' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">采集</span>
        </button>
        <button onClick={() => setView('list')} className={`flex flex-col items-center ${view === 'list' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <ClipboardList className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">清单</span>
        </button>
      </nav>
    </div>
  );
};

export default App;