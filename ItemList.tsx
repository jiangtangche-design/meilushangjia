import React from 'react';
import { FileSpreadsheet, Trash2 } from 'lucide-react';
import { Item } from '../types.ts';

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  const exportExcel = () => {
    const head = "标题\t价格\t库存\t描述\t备注\n";
    const body = items.map(i => `${i.title}\t${i.price}\t${i.stock}\t${i.description}\t${i.remarks}`).join('\n');
    navigator.clipboard.writeText(head + body).then(() => alert('已复制 Excel 格式数据，请去表格粘贴！'));
  };

  return (
    <div className="p-6 space-y-4 pb-32">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-slate-800">已采集 ({items.length})</h2>
        {items.length > 0 && (
          <button onClick={exportExcel} className="text-sm font-bold text-green-600 flex items-center gap-1 bg-green-50 px-3 py-2 rounded-xl">
            <FileSpreadsheet className="w-4 h-4" /> 导出 Excel
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">暂无数据</div>
      ) : (
        items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4">
            {item.image && <img src={item.image} className="w-16 h-16 rounded-xl object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-indigo-600 font-bold text-sm">¥{item.price}</span>
                <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};