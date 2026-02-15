import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

export function TeacherToDos() {
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('teacher_todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('teacher_todos', JSON.stringify(todos));
  }, [todos]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  const toggle = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remove = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="card-educational h-[400px] flex flex-col"> 
      <div className="flex items-center gap-2 mb-4 flex-none">
        <CheckSquare className="w-5 h-5 text-secondary" />
        <h3 className="font-display text-lg font-bold text-foreground">Lembretes</h3>
      </div>

      <form onSubmit={add} className="flex gap-2 mb-4 flex-none">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ex: Corrigir provas..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button type="submit" className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1 custom-scrollbar">
        {todos.length === 0 && (
            <div className="h-full flex items-center justify-center">
                <p className="text-xs text-muted-foreground">Tudo feito! ✨</p>
            </div>
        )}
        {todos.map(t => (
          <div key={t.id} className="flex items-center justify-between group p-2 hover:bg-muted/50 rounded-lg transition-colors shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <input 
                type="checkbox" 
                checked={t.done} 
                onChange={() => toggle(t.id)}
                className="rounded border-muted-foreground text-primary focus:ring-primary cursor-pointer"
              />
              <span className={`text-sm truncate ${t.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {t.text}
              </span>
            </div>
            <button onClick={() => remove(t.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}