import React, { useState } from 'react';
import { Camera, Sparkles, Loader2, Save } from 'lucide-react';
import { Item } from '../types.ts';
import { optimizeDescription } from '../services/geminiService.ts';

interface ItemFormProps {
  onSave: (item: Item) => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    title: '', image: '', description: '', price: '', stock: '', remarks: '',
  });
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleAi = async () => {
    setLoading(true);
    const text = await optimizeDescription(formData.title, formData.description);
    setFormData(p => ({ ...p, description: text }));
    setLoading(false);
  };

  return (
    <form className="p-6 space-y-5 pb-32" onSubmit={(e) => {
      e.preventDefault();
      onSave({ ...formData, id: crypto.randomUUID(), createdAt: Date.now() });
      setFormData({ title: '', image: '', description: '', price: '', stock: '', remarks: '' });
    }}>
      <label className="block w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-50 cursor-pointer">
        {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : 
        <div className="h-full flex flex-col items-center justify-center text-slate-400">
          <Camera /> <span className="text-sm mt-2">上传商品图</span>
        </div>}
        <input type="file" hidden accept="image/*" onChange={handleImage} />
      </label>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">商品标题</label>
        <input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="例如：极简风陶瓷咖啡杯" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">商品文案</label>
          <button type="button" onClick={handleAi} disabled={loading || !formData.title} className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
            {loading ? <Loader2 className="animate-spin w-3 h-3" /> : <Sparkles className="w-3 h-3" />} AI 优化
          </button>
        </div>
        <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="描述卖点..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} placeholder="价格" className="p-4 rounded-xl border border-slate-200 outline-none" />
        <input type="number" value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} placeholder="库存" className="p-4 rounded-xl border border-slate-200 outline-none" />
      </div>

      <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
        <Save className="w-5 h-5" /> 保存数据
      </button>
    </form>
  );
};