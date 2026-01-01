import React, { useState, useEffect } from 'react';
import { Plus, Settings, Play, Save, Eye, Check, X, ChevronRight, ChevronDown, GripVertical, Trash2, Copy, ToggleLeft, ToggleRight, Search, Filter, Clock, Users, Zap, MessageSquare, Hand, Monitor, Camera, BarChart3, ArrowRight, Edit3, AlertCircle, CheckCircle2 } from 'lucide-react';

const colors = {
  primary: '#1E3A5F', secondary: '#2E7D32', accent: '#FF6B00', 
  danger: '#C62828', warning: '#F9A825', info: '#0277BD'
};

const stepTypeColors = { ui: '#2196F3', game: '#4CAF50', analytics: '#FF9800', flow: '#9C27B0' };

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in`}>
      {type === 'success' && <CheckCircle2 size={20} />}
      {type === 'error' && <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80"><X size={16} /></button>
    </div>
  );
};

const FlowCard = ({ flow, onClick, selected, onEdit, onCopy, onToggle }) => {
  if (!flow) return null;
  const statusColors = { active: colors.secondary, inactive: '#9E9E9E', draft: colors.warning };
  return (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${selected ? 'border-blue-500' : 'border-transparent'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{flow.name || 'Unnamed Flow'}</h3>
          <span className="text-xs text-gray-500">Flow #{flow.legacy || '?'}</span>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: statusColors[flow.status] || '#9E9E9E' }}>{flow.status || 'draft'}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1"><Users size={14} />{flow.steps || 0} steps</span>
        <span className="flex items-center gap-1"><Zap size={14} />P{flow.priority || 0}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{flow.modified || 'Unknown'}</span>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(flow)} className="p-1 hover:bg-gray-100 rounded" title="Edit"><Edit3 size={14} /></button>
          <button onClick={() => onCopy(flow)} className="p-1 hover:bg-gray-100 rounded" title="Copy"><Copy size={14} /></button>
          <button onClick={() => onToggle(flow)} className="p-1 hover:bg-gray-100 rounded" title="Toggle Status"><ToggleLeft size={14} /></button>
        </div>
      </div>
    </div>
  );
};

const StepNode = ({ step, selected, onClick, onDelete, onDragStart, onDragOver, onDrop, index, isDragging }) => {
  if (!step) return null;
  const typeColor = stepTypeColors[step.type] || '#424242';
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, index)}
      onClick={onClick} 
      className={`bg-white rounded-lg shadow-sm border-2 p-3 cursor-pointer transition-all hover:shadow-md w-48 relative group ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} ${isDragging ? 'opacity-50' : ''}`} 
      style={{ borderLeftWidth: '4px', borderLeftColor: typeColor }}
    >
      <div className="flex items-center gap-2 mb-2">
        <GripVertical size={14} className="text-gray-400 cursor-grab" />
        <span className="font-medium text-sm text-gray-800 flex-1 truncate">{step.name || 'Unnamed Step'}</span>
        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">#{step.legacy || index}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {(step.actions || []).slice(0, 3).map((action, i) => (
          <span key={i} className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded">{String(action).replace('_', ' ')}</span>
        ))}
        {(step.actions || []).length > 3 && <span className="text-xs text-gray-400">+{(step.actions || []).length - 3}</span>}
      </div>
      {selected && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(step); }} className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200" title="Delete Step">
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};

const PropertiesPanel = ({ step, onClose, onUpdate, onAddCondition, onAddAction, onEditAction, onDeleteAction, allSteps }) => {
  const [expanded, setExpanded] = useState({ entry: false, actions: true, completion: true, exit: false });
  const [stepData, setStepData] = useState(step || {});
  
  useEffect(() => {
    if (step) {
      setStepData(step);
      // Reset expanded state when step changes
      setExpanded({ entry: false, actions: true, completion: true, exit: false });
    } else {
      setStepData({});
    }
  }, [step]);
  
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
  
  const handleUpdate = (field, value) => {
    if (!stepData) return;
    const updated = { ...stepData, [field]: value };
    setStepData(updated);
    if (onUpdate) onUpdate(updated);
  };
  
  return (
    <div className="w-80 bg-white border-l overflow-y-auto">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Step Properties</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded"><X size={16} /></button>
        </div>
        <p className="text-sm text-gray-500">{(stepData && stepData.name) || 'Unnamed Step'}</p>
      </div>
      
      <div className="divide-y">
        <div className="p-3 space-y-3">
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Step ID</label><input type="text" value={(stepData && stepData.id) || ''} readOnly className="w-full px-2 py-1.5 text-sm border rounded bg-gray-50" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Legacy Step Number</label><input type="number" value={(stepData && stepData.legacy) || 0} onChange={(e) => handleUpdate('legacy', parseInt(e.target.value) || 0)} className="w-full px-2 py-1.5 text-sm border rounded" /></div>
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea rows={2} value={`Step ${(stepData && stepData.legacy) || 0}: ${(stepData && stepData.name) || ''}`} onChange={(e) => {
            const parts = e.target.value.split(': ');
            if (parts.length > 1) {
              handleUpdate('name', parts.slice(1).join(': '));
            } else {
              handleUpdate('name', e.target.value);
            }
          }} className="w-full px-2 py-1.5 text-sm border rounded resize-none" /></div>
        </div>
        
        <Section title="Entry Conditions" name="entry">
          <button onClick={() => onAddCondition && onAddCondition('entry')} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Condition</button>
        </Section>
        
        <Section title="Actions On Enter" name="actions" badge={(stepData.actions || []).length}>
          <div className="space-y-2">
            {(stepData.actions || []).map((action, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                <GripVertical size={14} className="text-gray-400 cursor-grab" />
                <span className="flex-1 text-sm">{String(action).replace(/_/g, ' ')}</span>
                <button onClick={() => onEditAction && onEditAction(stepData, i, action)} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-blue-500" title="Edit Action"><Edit3 size={12} /></button>
                <button onClick={() => onDeleteAction && onDeleteAction(stepData, i)} className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
              </div>
            ))}
            <button onClick={() => onAddAction && onAddAction(stepData)} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Action</button>
          </div>
        </Section>
        
        <Section title="Completion Conditions" name="completion" badge={(stepData.completionConditions || [{ type: 'user_action', value: 'click' }]).length}>
          <div className="space-y-2">
            {(stepData.completionConditions || [{ type: 'user_action', value: 'click' }]).map((condition, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                <Hand size={14} className="text-blue-500" />
                <span className="flex-1 text-sm">{condition.type || 'user_action'}: {condition.value || 'click'}</span>
                <button className="p-1 hover:bg-blue-100 rounded text-blue-400"><Edit3 size={12} /></button>
              </div>
            ))}
            <button onClick={() => onAddCondition && onAddCondition('completion')} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Condition</button>
          </div>
        </Section>
        
        <Section title="Actions On Exit" name="exit">
          <button onClick={() => onAddAction && onAddAction(stepData, 'exit')} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-1"><Plus size={14} />Add Action</button>
        </Section>
        
        <div className="p-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Next Step</label>
          <select value={stepData.nextStep || ''} onChange={(e) => handleUpdate('nextStep', e.target.value)} className="w-full px-2 py-1.5 text-sm border rounded">
            <option value="">— Select Next Step —</option>
            {(allSteps || []).filter(s => s && s.id !== stepData.id).map(s => (
              <option key={s.id} value={s.id}>{s.name || 'Unnamed'} (Step #{s.legacy || 0})</option>
            ))}
            <option value="end">— End Flow —</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ConditionBuilderModal = ({ onClose, onAdd, context }) => {
  const [selectedType, setSelectedType] = useState('chapter');
  const [operator, setOperator] = useState('==');
  const [value, setValue] = useState('1');
  const [selectedFeature, setSelectedFeature] = useState('');
  
  const features = ['Disco', 'Cascade', 'Missions', 'Mode Boost', 'Race', 'Flowers', 'Recipes', 'Power Ups', 'Daily Challenges', 'Events'];
  
  const handleAdd = () => {
    if (onAdd) {
      const conditionValue = selectedType === 'feature_active' ? selectedFeature : value;
      onAdd({ type: selectedType, operator, value: conditionValue });
      // Close modal after state update
      setTimeout(() => onClose(), 0);
    } else {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
                <div className="flex-1"><label className="block text-xs font-medium text-gray-500 mb-1">Operator</label><select value={operator} onChange={(e) => setOperator(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option>== (equals)</option><option>&gt;= (greater or equal)</option><option>&lt;= (less or equal)</option></select></div>
                <div className="flex-1"><label className="block text-xs font-medium text-gray-500 mb-1">Value</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm"><span className="text-blue-700">Preview: </span><span className="font-mono">{selectedType} {operator} {value}</span></div>
            </div>
          )}
          {selectedType === 'feature_active' && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Select Feature</label>
                <select value={selectedFeature} onChange={(e) => setSelectedFeature(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">— Select Feature —</option>
                  {features.map(feature => (
                    <option key={feature} value={feature.toLowerCase().replace(/\s+/g, '_')}>{feature}</option>
                  ))}
                </select>
              </div>
              {selectedFeature && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                  <span className="text-blue-700">Preview: </span>
                  <span className="font-mono">feature_active == {selectedFeature}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={16} />Add Condition</button>
        </div>
      </div>
    </div>
  );
};

const ActionBuilderModal = ({ onClose, onAdd, step, existingAction, actionIndex, isEdit }) => {
  // Initialize with existing action data if editing
  const getInitialAction = () => {
    if (isEdit && existingAction) {
      const actionId = typeof existingAction === 'string' ? existingAction : existingAction.id;
      return actionId || 'show_dialog';
    }
    return 'show_dialog';
  };
  
  const [selectedAction, setSelectedAction] = useState(getInitialAction());
  const [activeCategory, setActiveCategory] = useState(() => {
    if (isEdit && existingAction) {
      const actionId = typeof existingAction === 'string' ? existingAction : existingAction.id;
      return actionTypes.find(a => a.id === actionId)?.category || 'ui';
    }
    return 'ui';
  });
  const [dialogId, setDialogId] = useState(() => {
    if (isEdit && existingAction && typeof existingAction === 'object') {
      return existingAction.dialogId || '';
    }
    return '';
  });
  const [character, setCharacter] = useState(() => {
    if (isEdit && existingAction && typeof existingAction === 'object') {
      return existingAction.character || 'chris';
    }
    return 'chris';
  });
  const [blockInput, setBlockInput] = useState(() => {
    if (isEdit && existingAction && typeof existingAction === 'object') {
      return existingAction.blockInput !== undefined ? existingAction.blockInput : true;
    }
    return true;
  });
  
  const isAddingStep = !step && !isEdit; // If no step provided and not editing, we're adding a new step
  const modalTitle = isEdit ? 'Edit Action' : (isAddingStep ? 'Add Step' : 'Add Action');
  const buttonText = isEdit ? 'Save Changes' : (isAddingStep ? 'Add Step' : 'Add Action');
  
  const categories = [{ id: 'ui', name: 'UI', color: '#2196F3' }, { id: 'game', name: 'Game', color: '#4CAF50' }, { id: 'analytics', name: 'Analytics', color: '#FF9800' }, { id: 'flow', name: 'Flow', color: '#9C27B0' }];
  const filteredActions = actionTypes.filter(a => a.category === activeCategory);
  
  const handleAdd = () => {
    if (onAdd) {
      const actionData = {
        id: selectedAction,
        ...(selectedAction === 'show_dialog' && { dialogId, character, blockInput })
      };
      onAdd(actionData);
      // Close modal after state update
      setTimeout(() => onClose(), 0);
    } else {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">{modalTitle}</h3>
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
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Dialog ID</label><input type="text" value={dialogId} onChange={(e) => setDialogId(e.target.value)} placeholder="e.g., ftue_intro_chris" className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Character</label><select value={character} onChange={(e) => setCharacter(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option>chris</option><option>kara</option><option>benny</option><option>leslie</option></select></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="blockInput" checked={blockInput} onChange={(e) => setBlockInput(e.target.checked)} className="rounded" /><label htmlFor="blockInput" className="text-sm">Block input while showing</label></div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={16} />{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({ onClose, flow, onUpdate }) => {
  const [settings, setSettings] = useState({
    priority: flow?.priority || 50,
    status: flow?.status || 'draft',
    autoStart: false,
    skipEnabled: true
  });
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Flow Settings</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <input type="number" value={settings.priority} onChange={(e) => setSettings({...settings, priority: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border rounded-lg" min="0" max="100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select value={settings.status} onChange={(e) => setSettings({...settings, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="autoStart" checked={settings.autoStart} onChange={(e) => setSettings({...settings, autoStart: e.target.checked})} className="rounded" />
            <label htmlFor="autoStart" className="text-sm">Auto-start when conditions are met</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="skipEnabled" checked={settings.skipEnabled} onChange={(e) => setSettings({...settings, skipEnabled: e.target.checked})} className="rounded" />
            <label htmlFor="skipEnabled" className="text-sm">Allow users to skip this flow</label>
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={() => { if (onUpdate) onUpdate(settings); onClose(); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

const ValidationModal = ({ onClose, steps }) => {
  const [issues, setIssues] = useState([]);
  
  useEffect(() => {
    const validationIssues = [];
    (steps || []).forEach((step, index) => {
      if (!step) return;
      if (!step.nextStep && index < steps.length - 1) {
        validationIssues.push({ type: 'warning', message: `${step.name || 'Unnamed step'} has no next step defined` });
      }
      if (!step.actions || step.actions.length === 0) {
        validationIssues.push({ type: 'info', message: `${step.name || 'Unnamed step'} has no actions` });
      }
    });
    setIssues(validationIssues);
  }, [steps]);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Flow Validation</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-4">
          {issues.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 size={24} className="text-green-600" />
              <div>
                <div className="font-medium text-green-800">All checks passed!</div>
                <div className="text-sm text-green-600">Your flow is ready to publish.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue, i) => (
                <div key={i} className={`p-3 rounded-lg border ${issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center gap-2">
                    {issue.type === 'warning' ? <AlertCircle size={16} className="text-yellow-600" /> : <AlertCircle size={16} className="text-blue-600" />}
                    <span className="text-sm">{issue.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Close</button>
        </div>
      </div>
    </div>
  );
};

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

export default function FTUEConfigUI() {
  const [view, setView] = useState('dashboard');
  const [flows, setFlows] = useState([
    { id: 'onboarding_core_loop', name: 'Core Loop Introduction', legacy: 1, steps: 14, status: 'active', priority: 100, modified: '2 hours ago' },
    { id: 'second_scapes_task', name: 'Second Scapes Task', legacy: 2, steps: 21, status: 'active', priority: 95, modified: '1 day ago' },
    { id: 'first_chapter_complete', name: 'First Chapter Completion', legacy: 3, steps: 12, status: 'active', priority: 90, modified: '3 days ago' },
    { id: 'flowers_intro', name: 'Flowers Feature Intro', legacy: 13, steps: 4, status: 'active', priority: 50, modified: '1 week ago' },
    { id: 'recipes_intro', name: 'Recipes Feature Intro', legacy: 14, steps: 7, status: 'draft', priority: 50, modified: 'Just now' },
    { id: 'mode_2_unlock', name: 'Mode 2 Unlock', legacy: 10, steps: 7, status: 'inactive', priority: 40, modified: '2 weeks ago' }
  ]);
  const [steps, setSteps] = useState([
    { id: 'intro_dialog', name: 'Intro Dialog', legacy: 0, type: 'ui', actions: ['show_dialog', 'send_analytics'], completionConditions: [{ type: 'user_action', value: 'click' }] },
    { id: 'highlight_board', name: 'Highlight Board Button', legacy: 2, type: 'ui', actions: ['shade_screen', 'highlight_ui', 'show_finger'], completionConditions: [{ type: 'user_action', value: 'click' }] },
    { id: 'first_tap', name: 'First Generator Tap', legacy: 4, type: 'game', actions: ['show_finger', 'show_dialog_bubble'], completionConditions: [{ type: 'user_action', value: 'click' }] },
    { id: 'first_merge', name: 'First Merge', legacy: 5, type: 'game', actions: ['show_finger'], completionConditions: [{ type: 'user_action', value: 'click' }] },
    { id: 'task_complete', name: 'Task Complete', legacy: 7, type: 'ui', actions: ['shade_screen', 'highlight_ui'], completionConditions: [{ type: 'user_action', value: 'click' }] }
  ]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [conditionContext, setConditionContext] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingActionIndex, setEditingActionIndex] = useState(null);
  const [editingAction, setEditingAction] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };
  
  const filteredFlows = flows.filter(f => {
    if (!f) return false;
    const matchesTab = filterTab === 'all' || f.status === filterTab;
    const matchesSearch = searchQuery === '' || (f.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    
    const newSteps = [...steps];
    const draggedStep = newSteps[draggedIndex];
    newSteps.splice(draggedIndex, 1);
    newSteps.splice(dropIndex, 0, draggedStep);
    setSteps(newSteps);
    setDraggedIndex(null);
    showToast('Step order updated');
  };
  
  const handleFlowEdit = (flow) => {
    if (!flow) {
      return;
    }
    setSelectedFlow(flow);
    setView('editor');
  };
  
  const handleFlowCopy = (flow) => {
    if (!flow) {
      return;
    }
    const newFlow = { ...flow, id: `${flow.id}_copy_${Date.now()}`, name: `${flow.name} (Copy)`, modified: 'Just now' };
    setFlows([...flows, newFlow]);
    showToast(`Copied "${flow.name}" successfully!`);
  };
  
  const handleFlowToggle = (flow) => {
    if (!flow) {
      return;
    }
    const newStatus = flow.status === 'active' ? 'inactive' : 'active';
    setFlows(flows.map(f => f && f.id === flow.id ? { ...f, status: newStatus } : f));
    showToast(`Flow status changed to ${newStatus}`);
  };
  
  const handleAddStep = (actionData) => {
    if (actionData) {
      const newStep = {
        id: `step_${Date.now()}`,
        name: (actionData.id || 'New Step').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        legacy: steps.length,
        type: actionTypes.find(a => a.id === actionData.id)?.category || 'ui',
        actions: [actionData.id],
        completionConditions: [{ type: 'user_action', value: 'click' }]
      };
      setSteps([...steps, newStep]);
      showToast('Step added successfully!');
    } else {
    }
  };
  
  const handleAddAction = (step, context = 'enter') => {
    if (!step) {
      return;
    }
    setSelectedStep(step);
    setEditingActionIndex(null);
    setEditingAction(null);
    setShowActionModal(true);
  };
  
  const handleEditAction = (step, actionIndex, action) => {
    if (!step) {
      return;
    }
    setSelectedStep(step);
    setEditingActionIndex(actionIndex);
    setEditingAction(action);
    setShowActionModal(true);
  };
  
  const handleActionAdded = (actionData) => {
    if (selectedStep && actionData) {
      const updatedSteps = steps.map(s => {
        if (s && s.id === selectedStep.id) {
          const currentActions = s.actions || [];
          if (editingActionIndex !== null && editingActionIndex !== undefined) {
            // Editing existing action
            const newActions = [...currentActions];
            newActions[editingActionIndex] = actionData.id;
            return { ...s, actions: newActions };
          } else {
            // Adding new action
            return { ...s, actions: [...currentActions, actionData.id] };
          }
        }
        return s;
      });
      setSteps(updatedSteps);
      setSelectedStep(updatedSteps.find(s => s && s.id === selectedStep.id));
      const wasEditing = editingActionIndex !== null && editingActionIndex !== undefined;
      setEditingActionIndex(null);
      setEditingAction(null);
      showToast(wasEditing ? 'Action updated successfully!' : 'Action added successfully!');
    } else {
    }
  };
  
  const handleDeleteAction = (step, actionIndex) => {
    if (!step) {
      return;
    }
    const oldActions = step.actions || [];
    const updatedSteps = steps.map(s => 
      s && s.id === step.id 
        ? { ...s, actions: (s.actions || []).filter((_, i) => i !== actionIndex) }
        : s
    );
    setSteps(updatedSteps);
    if (selectedStep && selectedStep.id === step.id) {
      setSelectedStep(updatedSteps.find(s => s && s.id === step.id));
    }
    showToast('Action removed');
  };
  
  const handleAddCondition = (context) => {
    setConditionContext(context);
    setShowConditionModal(true);
  };
  
  const handleConditionAdded = (condition) => {
    if (selectedStep && condition) {
      const field = conditionContext === 'entry' ? 'entryConditions' : 'completionConditions';
      const oldConditions = selectedStep[field] || [];
      const updatedSteps = steps.map(s => 
        s && s.id === selectedStep.id 
          ? { ...s, [field]: [...(s[field] || []), condition] }
          : s
      );
      setSteps(updatedSteps);
      setSelectedStep(updatedSteps.find(s => s && s.id === selectedStep.id));
      showToast('Condition added successfully!');
    } else {
    }
  };
  
  const handleStepUpdate = (updatedStep) => {
    if (!updatedStep) {
      return;
    }
    const updatedSteps = steps.map(s => s && s.id === updatedStep.id ? updatedStep : s);
    setSteps(updatedSteps);
    setSelectedStep(updatedStep);
  };
  
  const handleDeleteStep = (step) => {
    if (!step) {
      return;
    }
    if (window.confirm(`Delete step "${step.name || 'Unnamed'}"?`)) {
      setSteps(steps.filter(s => s && s.id !== step.id));
      if (selectedStep && selectedStep.id === step.id) {
        setSelectedStep(null);
      }
      showToast('Step deleted');
    } else {
    }
  };
  
  const handleSave = () => {
    showToast('Flow saved successfully!', 'success');
  };
  
  const handlePublish = () => {
    if (window.confirm('Publish this flow? It will be available to all users.')) {
      if (selectedFlow) {
        setFlows(flows.map(f => f && f.id === selectedFlow.id ? { ...f, status: 'active' } : f));
      }
      showToast('Flow published successfully!', 'success');
    } else {
    }
  };
  
  const handlePreview = () => {
    showToast('Preview mode - This would show a live preview of the flow', 'info');
  };
  
  const handleFlowNameChange = (name) => {
    if (selectedFlow) {
      const updated = { ...selectedFlow, name: name || 'New Flow' };
      setSelectedFlow(updated);
      setFlows(flows.map(f => f && f.id === updated.id ? updated : f));
    } else {
    }
  };
  
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-100">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-gray-800">FTUE Flow Manager</h1><p className="text-sm text-gray-500">Configure and manage tutorial flows</p></div>
            <button onClick={() => {
              setSelectedFlow(null);
              setView('editor');
            }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={18} />Create Flow</button>
          </div>
        </header>
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {['all', 'active', 'inactive', 'draft'].map(tab => (
                <button key={tab} onClick={() => {
                  setFilterTab(tab);
                }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => {
                setSearchQuery(e.target.value);
              }} placeholder="Search flows..." className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64" /></div>
              <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter size={16} /></button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFlows.map(flow => (
              <FlowCard key={flow.id} flow={flow} selected={selectedFlow?.id === flow.id} onClick={() => handleFlowEdit(flow)} onEdit={handleFlowEdit} onCopy={handleFlowCopy} onToggle={handleFlowToggle} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => {
            setView('dashboard');
          }} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={20} className="rotate-180" /></button>
          <div>
            <input type="text" value={(selectedFlow && selectedFlow.name) || "New Flow"} onChange={(e) => handleFlowNameChange(e.target.value)} className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" />
            <div className="flex items-center gap-2 text-sm text-gray-500"><span>Flow #{selectedFlow?.legacy || '?'}</span><span>•</span><span>{steps.length} steps</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            setShowSettingsModal(true);
          }} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><Settings size={16} />Settings</button>
          <button onClick={() => {
            setShowValidationModal(true);
          }} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><AlertCircle size={16} />Validate</button>
          <button onClick={handlePreview} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><Play size={16} />Preview</button>
          <button onClick={handleSave} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-300"><Save size={16} />Save</button>
          <button onClick={handlePublish} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"><Check size={16} />Publish</button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-3 border-b"><h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Step Library</h3></div>
          <div className="p-3 space-y-2">
            <button onClick={() => {
              setSelectedStep(null);
              setShowActionModal(true);
            }} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-2"><Plus size={16} />Add Step</button>
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
            {steps.map((step, index) => (
              <React.Fragment key={step?.id || index}>
                {step && (
                  <>
                    <StepNode 
                      step={step} 
                      selected={selectedStep?.id === step.id} 
                      onClick={() => {
                        setSelectedStep(step);
                      }} 
                      onDelete={handleDeleteStep}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      index={index}
                      isDragging={draggedIndex === index}
                    />
                    {index < steps.length - 1 && (<><div className="w-0.5 h-4 bg-gray-300" /><ArrowRight size={16} className="text-gray-400 rotate-90" /><div className="w-0.5 h-4 bg-gray-300" /></>)}
                  </>
                )}
              </React.Fragment>
            ))}
            <div className="w-0.5 h-8 bg-gray-300" />
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-2"><X size={14} />Flow End</div>
          </div>
        </div>
        
        <PropertiesPanel 
          step={selectedStep} 
          onClose={() => {
            setSelectedStep(null);
          }} 
          onUpdate={handleStepUpdate}
          onAddCondition={handleAddCondition}
          onAddAction={handleAddAction}
          onEditAction={handleEditAction}
          onDeleteAction={handleDeleteAction}
          allSteps={steps}
        />
      </div>
      
      {showConditionModal && <ConditionBuilderModal onClose={() => {
        setShowConditionModal(false);
      }} onAdd={handleConditionAdded} context={conditionContext} />}
      {showActionModal && <ActionBuilderModal 
        onClose={() => {
          setShowActionModal(false);
          setEditingActionIndex(null);
          setEditingAction(null);
        }} 
        onAdd={selectedStep ? handleActionAdded : handleAddStep} 
        step={selectedStep} 
        existingAction={editingAction}
        actionIndex={editingActionIndex}
        isEdit={editingActionIndex !== null && editingActionIndex !== undefined}
      />}
      {showSettingsModal && <SettingsModal onClose={() => {
        setShowSettingsModal(false);
      }} flow={selectedFlow || {}} onUpdate={(settings) => {
        if (selectedFlow) {
          setSelectedFlow({...selectedFlow, ...settings});
        } else {
          // Create new flow if none selected
          const newFlow = {
            id: `flow_${Date.now()}`,
            name: 'New Flow',
            legacy: flows.length + 1,
            steps: steps.length,
            status: settings.status || 'draft',
            priority: settings.priority || 50,
            modified: 'Just now',
            ...settings
          };
          setSelectedFlow(newFlow);
          setFlows([...flows, newFlow]);
        }
        showToast('Settings saved!');
      }} />}
      {showValidationModal && <ValidationModal onClose={() => {
        setShowValidationModal(false);
      }} steps={steps} />}
    </div>
  );
}
