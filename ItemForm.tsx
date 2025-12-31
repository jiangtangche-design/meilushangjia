import React, { useState } from 'react';
import { Camera, Sparkles, Loader2, Save, X } from 'lucide-react';
import { Item } from '../types.ts';
import { optimizeDescription } from '../geminiService.ts';

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
    if (!formData.title) {
      alert('请输入标题后再试');
      return;
    }
    setLoading(true);
    try {
      const text = await optimizeDescription(formData.title, formData.description);
      setFormData(p => ({ ...p, description: text }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    onSave({ ...formData, id: crypto.randomUUID(), createdAt: Date.now() });
    setFormData({ title: '', image: '', description: '', price: '', stock: '', remarks: '' });
  };

  return (
    <form className="p-6 space-y-5 pb-32 overflow-y-auto h-full no-scrollbar" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">商品配图</label>
        <div className="relative w-full h-52 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm transition-all hover:border-indigo-400">
          {formData.image ? (
            <>
              <img src={formData.image} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setFormData(p => ({ ...p, image: '' }))} 
                className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <label className="h-full flex flex-col items-center justify-center text-slate-400 cursor-pointer">
              <Camera className="w-8 h-8 text-indigo-500 mb-2" />
              <span className="text-sm font-medium">点击拍照或上传</span>
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">基本信息</label>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <input 
            required 
            value={formData.title} 
            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} 
            className="w-full p-4 outline-none border-b border-slate-50 focus:bg-indigo-50/10" 
            placeholder="商品名称" 
          />
          <div className="flex">
            <input 
              type="number" 
              value={formData.price} 
              onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} 
              placeholder="价格 (¥)" 
              className="w-1/2 p-4 outline-none border-r border-slate-50 focus:bg-indigo-50/10" 
            />
            <input 
              type="number" 
              value={formData.stock} 
              onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} 
              placeholder="库存数量" 
              className="w-1/2 p-4 outline-none focus:bg-indigo-50/10" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-bold text-slate-500 uppercase">文案描述</label>
          <button 
            type="button" 
            onClick={handleAi} 
            disabled={loading} 
            className="text-[11px] font-bold text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
          >
            {loading ? <Loader2 className="animate-spin w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            AI 润色
          </button>
        </div>
        <textarea 
          value={formData.description} 
          onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
          rows={4} 
          className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 resize-none transition-all shadow-sm" 
          placeholder="输入描述内容..." 
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-600 transition-all mt-4"
      >
        <Save className="w-5 h-5" /> 立即保存
      </button>
    </form>
  );
};