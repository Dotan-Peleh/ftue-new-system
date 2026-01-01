import React, { useState } from 'react';
import { Plus, Settings, Play, Save, Eye, Check, X, ChevronRight, ChevronDown, GripVertical, Trash2, Copy, ToggleLeft, ToggleRight, Search, Filter, Clock, Users, Zap, MessageSquare, Hand, Monitor, Camera, BarChart3, ArrowRight, Edit3, AlertCircle } from 'lucide-react';

const colors = {
  primary: '#1E3A5F', secondary: '#2E7D32', accent: '#FF6B00', 
  danger: '#C62828', warning: '#F9A825', info: '#0277BD'
};

const stepTypeColors = { ui: '#2196F3', game: '#4CAF50', analytics: '#FF9800', flow: '#9C27B0' };

const mockFlows = [
  { id: 'onboarding_core_loop', name: 'Core Loop Introduction', legacy: 1, steps: 14, status: 'active', priority: 100, modified: '2 hours ago' },
  { id: 'second_scapes_task', name: 'Second Scapes Task', legacy: 2, steps: 21, status: 'active', priority: 95, modified: '1 day ago' },
  { id: 'first_chapter_complete', name: 'First Chapter Completion', legacy: 3, steps: 12, status: 'active', priority: 90, modified: '3 days ago' },
  { id: 'flowers_intro', name: 'Flowers Feature Intro', legacy: 13, steps: 4, status: 'active', priority: 50, modified: '1 week ago' },
  { id: 'recipes_intro', name: 'Recipes Feature Intro', legacy: 14, steps: 7, status: 'draft', priority: 50, modified: 'Just now' },
  { id: 'mode_2_unlock', name: 'Mode 2 Unlock', legacy: 10, steps: 7, status: 'inactive', priority: 40, modified: '2 weeks ago' }
];

const mockSteps = [
  { id: 'intro_dialog', name: 'Intro Dialog', legacy: 0, type: 'ui', actions: ['show_dialog', 'send_analytics'] },
  { id: 'highlight_board', name: 'Highlight Board Button', legacy: 2, type: 'ui', actions: ['shade_screen', 'highlight_ui', 'show_finger'] },
  { id: 'first_tap', name: 'First Generator Tap', legacy: 4, type: 'game', actions: ['show_finger', 'show_dialog_bubble'] },
  { id: 'first_merge', name: 'First Merge', legacy: 5, type: 'game', actions: ['show_finger'] },
  { id: 'task_complete', name: 'Task Complete', legacy: 7, type: 'ui', actions: ['shade_screen', 'highlight_ui'] }
];

const conditionTypes = [
  { id: 'chapter', name: 'Chapter', icon: <BarChart3 size={16} /> },
  { id: 'balance', name: 'Balance', icon: <Zap size={16} /> },
  { id: 'item_on_board', name: 'Item on Board', icon: <Monitor size={16} /> },
  { id: 'user_action', name: 'User Action', icon: <Hand size={16} /> },
  { id: 'feature_active', name: 'Feature Active', icon: <ToggleRight size={16} /> },
  { id: 'flow_completed', name: 'Flow Completed', icon: <Check size={16} /> }
];

const actionTypes = [
  { id: 'show_dialog', name: 'Show Dialog', icon: <MessageSquare size={16} />, category: 'ui' },
  { id: 'show_finger', name: 'Show Finger', icon: <Hand size={16} />, category: 'ui' },
  { id: 'shade_screen', name: 'Shade Screen', icon: <Monitor size={16} />, category: 'ui' },
  { id: 'highlight_ui', name: 'Highlight UI', icon: <Eye size={16} />, category: 'ui' },
  { id: 'camera_move', name: 'Camera Move', icon: <Camera size={16} />, category: 'game' },
  { id: 'delay', name: 'Delay', icon: <Clock size={16} />, category: 'flow' },
  { id: 'send_analytics', name: 'Send Analytics', icon: <BarChart3 size={16} />, category: 'analytics' }
];

const FlowCard = ({ flow, onClick, selected }) => {
  const statusColors = { active: colors.secondary, inactive: '#9E9E9E', draft: colors.warning };
  return (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${selected ? 'border-blue-500' : 'border-transparent'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{flow.name}</h3>
          <span className="text-xs text-gray-500">Flow #{flow.legacy}</span>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: statusColors[flow.status] }}>{flow.status}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1"><Users size={14} />{flow.steps} steps</span>
        <span className="flex items-center gap-1"><Zap size={14} />P{flow.priority}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{flow.modified}</span>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-gray-100 rounded"><Edit3 size={14} /></button>
          <button className="p-1 hover:bg-gray-100 rounded"><Copy size={14} /></button>
          <button className="p-1 hover:bg-gray-100 rounded"><ToggleLeft size={14} /></button>
        </div>
      </div>
    </div>
  );
};

const StepNode = ({ step, selected, onClick }) => {
  const typeColor = stepTypeColors[step.type] || '#424242';
  return (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-sm border-2 p-3 cursor-pointer transition-all hover:shadow-md w-48 ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`} style={{ borderLeftWidth: '4px', borderLeftColor: typeColor }}>
      <div className="flex items-center gap-2 mb-2">
        <GripVertical size={14} className="text-gray-400 cursor-grab" />
        <span className="font-medium text-sm text-gray-800 flex-1 truncate">{step.name}</span>
        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">#{step.legacy}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {step.actions.slice(0, 3).map((action, i) => (
          <span key={i} className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded">{action.replace('_', ' ')}</span>
        ))}
        {step.actions.length > 3 && <span className="text-xs text-gray-400">+{step.actions.length - 3}</span>}
      </div>
    </div>
  );
};

const PropertiesPanel = ({ step, onClose }) => {
  const [expanded, setExpanded] = useState({ entry: false, actions: true, completion: true, exit: false });
  
  if (!step) return <div className="w-80 bg-gray-50 border-l p-4 flex items-center justify-center text-gray-400">Select a step to edit properties</div>;
  
  const Section = ({ title, name, children, badge }) => (
    <div className="border-b border-gray-200">
      <button onClick={() => setExpanded(e => ({ ...e, [name]: !e[name] }))} className="w-full flex items-center justify-between p-3 hover:bg-gray-50">
        <div className="flex items-center gap-2">
          {expanded[name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="font-medium text-sm">{title}</span>
          {badge && <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">{badge}</span>}
        </div>
      </button>
      {expanded[name] && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
  
  return (
    <div className="w-80 bg-white border-l overflow-y-auto">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Step Properties</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded"><X size={16} /></button>
        </div>
        <p className="text-sm text-gray-500">{step.name}</p>
      </div>
      
      <div className="divide-y">
        <div className="p-3 space-y-3">
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Step ID</label><input type="text" value={step.id} readOnly className="w-full px-2 py-1.5 text-sm border rounded bg-gray-50" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Legacy Step Number</label><input type="number" defaultValue={step.legacy} className="w-full px-2 py-1.5 text-sm border rounded" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea rows={2} defaultValue={`Step ${step.legacy}: ${step.name}`} className="w-full px-2 py-1.5 text-sm border rounded resize-none" /></div>
        </div>
        
        <Section title="Entry Conditions" name="entry">
          <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Condition</button>
        </Section>
        
        <Section title="Actions On Enter" name="actions" badge={step.actions.length}>
          <div className="space-y-2">
            {step.actions.map((action, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                <GripVertical size={14} className="text-gray-400 cursor-grab" />
                <span className="flex-1 text-sm">{action.replace(/_/g, ' ')}</span>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-400"><Edit3 size={12} /></button>
                <button className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Action</button>
          </div>
        </Section>
        
        <Section title="Completion Conditions" name="completion" badge="1">
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
              <Hand size={14} className="text-blue-500" />
              <span className="flex-1 text-sm">user_action: click</span>
              <button className="p-1 hover:bg-blue-100 rounded text-blue-400"><Edit3 size={12} /></button>
            </div>
            <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Condition</button>
          </div>
        </Section>
        
        <Section title="Actions On Exit" name="exit">
          <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Action</button>
        </Section>
        
        <div className="p-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Next Step</label>
          <select className="w-full px-2 py-1.5 text-sm border rounded">
            <option>first_merge (Step #5)</option>
            <option>task_complete (Step #7)</option>
            <option value="end">— End Flow —</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ConditionBuilderModal = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState('chapter');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Add Condition</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition Type</label>
            <div className="grid grid-cols-3 gap-2">
              {conditionTypes.map(type => (
                <button key={type.id} onClick={() => setSelectedType(type.id)} className={`p-3 rounded-lg border-2 text-left transition-all ${selectedType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-2 mb-1">{type.icon}<span className="text-sm font-medium">{type.name}</span></div>
                </button>
              ))}
            </div>
          </div>
          {selectedType === 'chapter' && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-3">
                <div className="flex-1"><label className="block text-xs font-medium text-gray-500 mb-1">Operator</label><select className="w-full px-3 py-2 border rounded-lg"><option>== (equals)</option><option>&gt;= (greater or equal)</option><option>&lt;= (less or equal)</option></select></div>
                <div className="flex-1"><label className="block text-xs font-medium text-gray-500 mb-1">Value</label><input type="number" defaultValue={1} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm"><span className="text-blue-700">Preview: </span><span className="font-mono">chapter == 1</span></div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={16} />Add Condition</button>
        </div>
      </div>
    </div>
  );
};

const ActionBuilderModal = ({ onClose }) => {
  const [selectedAction, setSelectedAction] = useState('show_dialog');
  const [activeCategory, setActiveCategory] = useState('ui');
  const categories = [{ id: 'ui', name: 'UI', color: '#2196F3' }, { id: 'game', name: 'Game', color: '#4CAF50' }, { id: 'analytics', name: 'Analytics', color: '#FF9800' }, { id: 'flow', name: 'Flow', color: '#9C27B0' }];
  const filteredActions = actionTypes.filter(a => a.category === activeCategory);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Add Action</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        <div className="flex border-b">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${activeCategory === cat.id ? 'border-current' : 'border-transparent text-gray-500'}`} style={{ color: activeCategory === cat.id ? cat.color : undefined }}>{cat.name}</button>
          ))}
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {filteredActions.map(action => (
              <button key={action.id} onClick={() => setSelectedAction(action.id)} className={`p-3 rounded-lg border-2 text-center transition-all ${selectedAction === action.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex flex-col items-center gap-2">{action.icon}<span className="text-xs">{action.name}</span></div>
              </button>
            ))}
          </div>
          {selectedAction === 'show_dialog' && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Dialog ID</label><input type="text" placeholder="e.g., ftue_intro_chris" className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Character</label><select className="w-full px-3 py-2 border rounded-lg"><option>chris</option><option>kara</option><option>benny</option><option>leslie</option></select></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="blockInput" defaultChecked className="rounded" /><label htmlFor="blockInput" className="text-sm">Block input while showing</label></div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={16} />Add Action</button>
        </div>
      </div>
    </div>
  );
};

export default function FTUEConfigUI() {
  const [view, setView] = useState('dashboard');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [filterTab, setFilterTab] = useState('all');
  
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-gray-800">FTUE Flow Manager</h1><p className="text-sm text-gray-500">Configure and manage tutorial flows</p></div>
            <button onClick={() => setView('editor')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={18} />Create Flow</button>
          </div>
        </header>
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {['all', 'active', 'inactive', 'draft'].map(tab => (
                <button key={tab} onClick={() => setFilterTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search flows..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" /></div>
              <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter size={16} /></button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFlows.filter(f => filterTab === 'all' || f.status === filterTab).map(flow => (
              <FlowCard key={flow.id} flow={flow} selected={selectedFlow?.id === flow.id} onClick={() => { setSelectedFlow(flow); setView('editor'); }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={20} className="rotate-180" /></button>
          <div>
            <input type="text" defaultValue={selectedFlow?.name || "New Flow"} className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" />
            <div className="flex items-center gap-2 text-sm text-gray-500"><span>Flow #{selectedFlow?.legacy || '?'}</span><span>•</span><span>{mockSteps.length} steps</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><Settings size={16} />Settings</button>
          <button onClick={() => setShowConditionModal(true)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><AlertCircle size={16} />Validate</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><Play size={16} />Preview</button>
          <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"><Save size={16} />Save</button>
          <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"><Check size={16} />Publish</button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-3 border-b"><h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Step Library</h3></div>
          <div className="p-3 space-y-2">
            <button onClick={() => setShowActionModal(true)} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-2"><Plus size={16} />Add Step</button>
            <div className="pt-2">
              <h4 className="text-xs font-medium text-gray-400 mb-2">TEMPLATES</h4>
              {['Dialog Step', 'Highlight Step', 'Wait for Action', 'Analytics Only'].map(template => (
                <div key={template} className="p-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-grab flex items-center gap-2" draggable><GripVertical size={14} className="text-gray-400" />{template}</div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2"><Play size={14} />Flow Start</div>
            <div className="w-0.5 h-8 bg-gray-300" />
            {mockSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepNode step={step} selected={selectedStep?.id === step.id} onClick={() => setSelectedStep(step)} />
                {index < mockSteps.length - 1 && (<><div className="w-0.5 h-4 bg-gray-300" /><ArrowRight size={16} className="text-gray-400 rotate-90" /><div className="w-0.5 h-4 bg-gray-300" /></>)}
              </React.Fragment>
            ))}
            <div className="w-0.5 h-8 bg-gray-300" />
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2"><X size={14} />Flow End</div>
          </div>
        </div>
        
        <PropertiesPanel step={selectedStep} onClose={() => setSelectedStep(null)} />
      </div>
      
      {showConditionModal && <ConditionBuilderModal onClose={() => setShowConditionModal(false)} />}
      {showActionModal && <ActionBuilderModal onClose={() => setShowActionModal(false)} />}
    </div>
  );
}

