import React, { useState, useEffect, useRef } from 'react';
import { Plus, Settings, Play, Save, Eye, Check, X, ChevronRight, ChevronDown, GripVertical, Trash2, Copy, ToggleLeft, ToggleRight, Search, Filter, Clock, Users, Zap, MessageSquare, Hand, Monitor, Camera, BarChart3, ArrowRight, Edit3, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

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

const ActionCard = ({ action, index, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const actionObj = typeof action === 'object' ? action : { Type: action, Target: 'Null' };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-2 bg-gray-50">
        <GripVertical size={14} className="text-gray-400 cursor-grab" />
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left text-sm font-medium flex items-center gap-2">
          <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          <span>{actionObj.Type || 'Unknown Action'}</span>
          {actionObj.Target && actionObj.Target !== 'Null' && (
            <span className="text-xs text-gray-500">→ {actionObj.Target}</span>
          )}
        </button>
        <button onClick={() => onEdit && onEdit(index, action)} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-blue-500" title="Edit Action"><Edit3 size={12} /></button>
        <button onClick={() => onDelete && onDelete(index)} className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
      </div>
      {expanded && (
        <div className="p-3 bg-white space-y-2 border-t">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-500">Type:</span> <span className="font-medium">{actionObj.Type}</span></div>
            <div><span className="text-gray-500">Target:</span> <span className="font-medium">{actionObj.Target || 'Null'}</span></div>
            {actionObj.TargetDialog && <div className="col-span-2"><span className="text-gray-500">Dialog ID:</span> <span className="font-medium">{actionObj.TargetDialog.DialogId}</span></div>}
            {actionObj.TargetCharacter && <div><span className="text-gray-500">Character:</span> <span className="font-medium">{actionObj.TargetCharacter.CharacterId}</span></div>}
            {actionObj.TargetBoardItem && <div className="col-span-2"><span className="text-gray-500">Board Item ID:</span> <span className="font-medium">{actionObj.TargetBoardItem.ItemId}</span> {actionObj.TargetBoardItem.Position && <span className="text-gray-400">({actionObj.TargetBoardItem.Position.x}, {actionObj.TargetBoardItem.Position.y})</span>}</div>}
            {actionObj.TargetBoardTask && <div><span className="text-gray-500">Board Task ID:</span> <span className="font-medium">{actionObj.TargetBoardTask.BoardTaskId}</span></div>}
            {actionObj.TargetScapeTask && <div><span className="text-gray-500">Scape Task ID:</span> <span className="font-medium">{actionObj.TargetScapeTask.ScapeTaskId}</span></div>}
            {actionObj.TypeShowTooltip && (
              <div className="col-span-2 space-y-1">
                <div><span className="text-gray-500">Tooltip Type:</span> <span className="font-medium">{actionObj.TypeShowTooltip.Type}</span></div>
                <div><span className="text-gray-500">Position:</span> <span className="font-medium">{actionObj.TypeShowTooltip.InfoMessagePosition}</span></div>
                {actionObj.TypeShowTooltip.HandRotation && <div><span className="text-gray-500">Hand Rotation:</span> <span className="font-medium">{actionObj.TypeShowTooltip.HandRotation}</span></div>}
              </div>
            )}
            {actionObj.TypeHighlight && <div><span className="text-gray-500">Highlight Type:</span> <span className="font-medium">{actionObj.TypeHighlight.Type}</span></div>}
            {actionObj.TypeFade && <div><span className="text-gray-500">Fade Type:</span> <span className="font-medium">{actionObj.TypeFade.Type}</span></div>}
            {actionObj.TypeIdleHelp && <div><span className="text-gray-500">Idle Help Delay:</span> <span className="font-medium">{actionObj.TypeIdleHelp.IdleHelpDelay}s</span></div>}
            {actionObj.TargetPopup && <div><span className="text-gray-500">Popup Type:</span> <span className="font-medium">{actionObj.TargetPopup.GamePopupType}</span></div>}
            {actionObj.TypeShowCutScene && <div className="col-span-2"><span className="text-gray-500">Cutscene ID:</span> <span className="font-medium">{actionObj.TypeShowCutScene.CutsceneId}</span></div>}
            {actionObj.TargetAwaitedAnimation && actionObj.TargetAwaitedAnimation.AwaitedAnimations && (
              <div className="col-span-2"><span className="text-gray-500">Awaited Animation:</span> <span className="font-medium">{actionObj.TargetAwaitedAnimation.AwaitedAnimations[0]?.AwaitedAnimation}</span></div>
            )}
            {actionObj.TargetGroup && <div className="col-span-2"><span className="text-gray-500">Group:</span> <span className="font-medium">{actionObj.TargetGroup.GroupName}</span></div>}
            {actionObj.TargetInfoText && <div className="col-span-2"><span className="text-gray-500">Info Text ID:</span> <span className="font-medium">{actionObj.TargetInfoText.TextId}</span></div>}
          </div>
        </div>
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
          {stepData.context && (
            <div className="p-2 bg-blue-50 rounded border border-blue-200">
              <label className="block text-xs font-medium text-blue-700 mb-1">Context</label>
              <div className="text-sm text-blue-600">
                {stepData.context.contextType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {stepData.context.contextValue}
              </div>
            </div>
          )}
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
              <ActionCard
                key={i}
                action={action}
                index={i}
                onEdit={(idx, act) => onEditAction && onEditAction(stepData, idx, act)}
                onDelete={(idx) => onDeleteAction && onDeleteAction(stepData, idx)}
              />
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

const StepContextModal = ({ onClose, onSelect }) => {
  const [selectedContext, setSelectedContext] = useState(null);
  const [contextValue, setContextValue] = useState('');
  
  const contextTypes = [
    { 
      id: 'scape_task', 
      name: 'Scape Task', 
      icon: '🗺️', 
      description: 'A specific task on the map',
      example: 'Example: Task 1, Task 2',
      help: 'Use this when the step is about completing a specific scape task'
    },
    { 
      id: 'scene', 
      name: 'Scene', 
      icon: '🎬', 
      description: 'A game scene or location',
      example: 'Example: BridgeAreaStep0Part0',
      help: 'Use this for scene-specific tutorials or cutscenes'
    },
    { 
      id: 'chapter', 
      name: 'Chapter', 
      icon: '📖', 
      description: 'A story chapter',
      example: 'Example: Chapter 1, Chapter 2',
      help: 'Use this when the step relates to a specific chapter in the story'
    },
    { 
      id: 'item', 
      name: 'Item', 
      icon: '🎁', 
      description: 'A specific game item',
      example: 'Example: Item 399, Item 504',
      help: 'Use this when teaching about or using a specific item'
    },
    { 
      id: 'feature', 
      name: 'Feature', 
      icon: '⭐', 
      description: 'A game feature or system',
      example: 'Example: Disco, Cascade, Missions',
      help: 'Use this when introducing or explaining a game feature'
    }
  ];
  
  const features = [
    'None', 'Disco', 'Cascade', 'Missions', 'Mode Boost', 'Race', 
    'Flowers', 'Recipes', 'Power Ups', 'Daily Challenges', 'Events', 
    'TimedBoardTask', 'FusionFair', 'Reel', 'Oyster', 'HarvestSystem'
  ];
  
  const handleContinue = () => {
    const trimmedValue = contextValue?.toString().trim() || '';
    if (selectedContext && trimmedValue) {
      onSelect({
        contextType: selectedContext,
        contextValue: trimmedValue
      });
      onClose();
    }
  };
  
  const canContinue = selectedContext && contextValue?.toString().trim() && contextValue !== '';
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => {
      // Only close if clicking directly on the backdrop, not on child elements
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] h-[85vh] max-h-[600px] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Fixed Header */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white">
          <h3 className="font-semibold text-lg">Select Step Context</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-blue-500 mt-0.5">💡</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900 mb-1">Step 1 of 2: Choose Context</div>
                <div className="text-xs text-blue-700">Select what this step is about. This helps organize your tutorial flow.</div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">What is this step about?</label>
            <div className="grid grid-cols-2 gap-3">
              {contextTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedContext(type.id);
                    setContextValue('');
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                    selectedContext === type.id 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {selectedContext === type.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm mb-1">{type.name}</div>
                  <div className="text-xs text-gray-600 mb-1">{type.description}</div>
                  <div className="text-xs text-gray-400 italic">{type.example}</div>
                </button>
              ))}
            </div>
          </div>
          
          {selectedContext && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-xs text-green-700">
                <span className="font-medium">💡 Tip: </span>
                {contextTypes.find(t => t.id === selectedContext)?.help}
              </div>
            </div>
          )}
          
          {selectedContext && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-blue-500">✓</div>
                <div className="text-sm font-medium text-gray-700">Step 2 of 2: Enter Value</div>
              </div>
              
              {selectedContext === 'feature' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Feature</label>
                  <select
                    value={contextValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && value !== 'None') {
                        setContextValue(value);
                      } else {
                        setContextValue('');
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                  >
                    <option value="">— Select a Feature —</option>
                    {features.filter(f => f !== 'None').map(feature => (
                      <option key={feature} value={feature}>{feature}</option>
                    ))}
                  </select>
                  <div className="mt-2 text-xs text-gray-500">Choose from available game features</div>
                </div>
              ) : selectedContext === 'chapter' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chapter Number</label>
                  <input
                    type="number"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="Enter chapter number (e.g., 1, 2, 3)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                  />
                  <div className="mt-2 text-xs text-gray-500">Enter the chapter number this step relates to</div>
                </div>
              ) : selectedContext === 'scape_task' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scape Task ID</label>
                  <input
                    type="number"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="Enter task ID (e.g., 1, 2)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                  />
                  <div className="mt-2 text-xs text-gray-500">Enter the ID of the scape task</div>
                </div>
              ) : selectedContext === 'item' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item ID</label>
                  <input
                    type="number"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="Enter item ID (e.g., 399, 692, 504)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                  />
                  <div className="mt-2 text-xs text-gray-500">Enter the ID of the item this step uses</div>
                </div>
              ) : selectedContext === 'scene' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scene Name/ID</label>
                  <input
                    type="text"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="Enter scene name (e.g., BridgeAreaStep0Part0)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                  />
                  <div className="mt-2 text-xs text-gray-500">Enter the scene identifier or name</div>
                </div>
              ) : null}
              
              {contextValue && (
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-900">Ready to Continue!</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    <span className="font-medium">{contextTypes.find(t => t.id === selectedContext)?.name}:</span>{' '}
                    <span className="font-mono bg-white px-2 py-1 rounded">{contextValue}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Fixed Footer with CTA - Always visible at bottom */}
        <div className="p-4 border-t bg-white flex justify-end gap-2 flex-shrink-0" style={{ minHeight: '72px' }}>
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContinue();
            }}
            disabled={!canContinue}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium ${
              canContinue 
                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer shadow-md hover:shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ArrowRight size={16} />Continue to Actions
          </button>
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
  
  // Real feature names from the system (matching RequiredActiveFeature values)
  const features = [
    'None', 'Disco', 'Cascade', 'Missions', 'Mode Boost', 'Race', 
    'Flowers', 'Recipes', 'Power Ups', 'Daily Challenges', 'Events', 
    'TimedBoardTask', 'FusionFair', 'Reel', 'Oyster', 'HarvestSystem'
  ];
  
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
                    <option key={feature} value={feature === 'None' ? '' : feature}>{feature}</option>
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

const ActionDetailsModal = ({ onClose, action, step, onUpdate }) => {
  const [actionData, setActionData] = useState(() => {
    // If action is a string, convert to object format
    if (typeof action === 'string') {
      return { Type: action, Target: 'Null' };
    }
    // If action is already an object, use it
    return action || { Type: 'LockUIElement', Target: 'Null' };
  });
  const [jsonView, setJsonView] = useState(false);
  
  const handleSave = () => {
    if (onUpdate && step) {
      // Find the action index in step.actions
      const actionIndex = step.actions?.findIndex(a => 
        (typeof a === 'string' && a === action) || 
        (typeof a === 'object' && JSON.stringify(a) === JSON.stringify(action))
      );
      
      if (actionIndex !== undefined && actionIndex >= 0) {
        const updatedActions = [...(step.actions || [])];
        updatedActions[actionIndex] = actionData;
        onUpdate({ ...step, actions: updatedActions });
      }
    }
    onClose();
  };
  
  const actionTypes = [
    'LockUIElement', 'UnLockUIElement', 'ShowDialog', 'HideDialog', 'ShowTooltip',
    'HighlightElement', 'FadeIn', 'Tap', 'Merge', 'ShowCutscene', 'WaitForAnimationComplete',
    'WaitForBoardTaskReady', 'ShowUIElement', 'HideUIElement', 'IdleHelp', 'LockBoardItemDrag',
    'UnLockBoardItemDrag', 'WaitForCollectItem', 'ShowTargetPopup', 'AddItemOnBoard',
    'ShowSimpleProceedText', 'CenteringScapesTooltip', 'LockUIGroup', 'UnLockUIGroup',
    'DtgMainTutorialFinished', 'ExtendTutorialStepData'
  ];
  
  // Real target types from the system
  const targetTypes = [
    'Null', 'All', 'BoardScreen', 'ScapeScreen', 'DialogSkip', 'DialogClose', 'DialogProceed',
    'BoardItem', 'BoardItems', 'BoardTask', 'Character', 'Dialog', 'ScapeTask',
    'HarvestSystem', 'RewardCenter', 'BoardModePlus', 'FusionFairGoToBoard',
    'FusionFairBoardTaskItemInfo', 'FusionFairInfoPopupClose', 'TutorialFlowersPopupSimpleProceed',
    'TutorialFusionFairPopupSimpleProceed', 'Group', 'ScapeTaskMapTooltip', 'DialogChatBubble',
    'BoardItemLastGenerated', 'BoardActiveGenerator', 'HarvestSystemTitle', 'ScapeTaskFade',
    'BoardTaskScroll', 'BoardTaskItemInfo', 'ScapeTaskScroll', 'ScapeTaskOpen', 'ItemTooltipDelete',
    'Store', 'Settings', 'BoardTile', 'FusionFairInfoPopupClose'
  ];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Action Details</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setJsonView(!jsonView)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
              {jsonView ? 'Form View' : 'JSON View'}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {jsonView ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Action JSON</label>
              <textarea
                value={JSON.stringify(actionData, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setActionData(parsed);
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="w-full h-96 p-3 border rounded-lg font-mono text-sm"
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select
                    value={actionData.Type || ''}
                    onChange={(e) => {
                      const newType = e.target.value;
                      // When type changes, initialize appropriate fields
                      const newActionData = { 
                        Type: newType, 
                        Target: actionData.Target || 'Null'
                      };
                      
                      // Initialize type-specific fields
                      if (newType === 'ShowDialog') {
                        newActionData.TargetDialog = actionData.TargetDialog || { DialogId: 0 };
                      }
                      if (newType === 'ShowTooltip' && actionData.Target === 'Character') {
                        newActionData.TargetCharacter = actionData.TargetCharacter || { CharacterId: 'Chris' };
                        newActionData.TypeShowTooltip = actionData.TypeShowTooltip || { Type: 'Info', HandRotation: 'Default', InfoMessagePosition: 'Bottom', IsLikeADialog: false, Emotion: 'None' };
                      }
                      if (newType === 'ShowCutscene') {
                        newActionData.TypeShowCutScene = actionData.TypeShowCutScene || { CutsceneId: '' };
                      }
                      if (newType === 'WaitForAnimationComplete') {
                        newActionData.TargetAwaitedAnimation = actionData.TargetAwaitedAnimation || { AwaitedAnimations: [{ AwaitedAnimation: '', AwaitComplete: false }] };
                      }
                      if (newType === 'HighlightElement') {
                        newActionData.TypeHighlight = actionData.TypeHighlight || { Type: 'Shader', IsCommonAmongSteps: false };
                      }
                      if (newType === 'FadeIn') {
                        newActionData.TypeFade = actionData.TypeFade || { Type: 'Shrink', IsCommonAmongSteps: false };
                      }
                      if (newType === 'IdleHelp') {
                        newActionData.TypeIdleHelp = actionData.TypeIdleHelp || { IdleHelpDelay: 2 };
                      }
                      if (newType === 'ShowTargetPopup') {
                        newActionData.TargetPopup = actionData.TargetPopup || { GamePopupType: '' };
                      }
                      
                      setActionData(newActionData);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Type</option>
                    {actionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Target</label>
                  <select
                    value={actionData.Target || 'Null'}
                    onChange={(e) => {
                      const newTarget = e.target.value;
                      setActionData({ 
                        ...actionData, 
                        Target: newTarget,
                        // Clear target-specific fields when changing target
                        ...(newTarget === 'BoardItem' ? {} : { TargetBoardItem: null }),
                        ...(newTarget === 'BoardTask' ? {} : { TargetBoardTask: null }),
                        ...(newTarget === 'ScapeTask' || newTarget === 'ScapeTaskMapTooltip' ? {} : { TargetScapeTask: null }),
                        ...(newTarget === 'Character' ? {} : { TargetCharacter: null }),
                        ...(newTarget === 'Group' ? {} : { TargetGroup: null }),
                        ...(newTarget === 'BoardItems' ? {} : { TargetBoardItems: null })
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {targetTypes.map(target => (
                      <option key={target} value={target}>{target}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* TargetDialog - Show for ShowDialog action or if already exists */}
              {(actionData.Type === 'ShowDialog' || actionData.TargetDialog) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Dialog ID</label>
                  <input
                    type="number"
                    value={actionData.TargetDialog?.DialogId || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetDialog: { DialogId: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="e.g., 1001199, 10013, 10014"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* TargetCharacter - Show for ShowTooltip with Character target or if already exists */}
              {((actionData.Type === 'ShowTooltip' && actionData.Target === 'Character') || actionData.TargetCharacter) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Character ID</label>
                  <select
                    value={actionData.TargetCharacter?.CharacterId || 'Chris'}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetCharacter: { CharacterId: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>Chris</option>
                    <option>Kara</option>
                    <option>Benny</option>
                    <option>Leslie</option>
                    <option>Mateo</option>
                    <option>Tyrell</option>
                  </select>
                </div>
              )}
              
              {/* TargetBoardItem - Show for BoardItem target or if already exists */}
              {(actionData.Target === 'BoardItem' || actionData.TargetBoardItem) && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Board Item</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Item ID</label>
                      <input
                        type="number"
                        value={actionData.TargetBoardItem?.ItemId || ''}
                        onChange={(e) => setActionData({
                          ...actionData,
                          TargetBoardItem: {
                            ...(actionData.TargetBoardItem || {}),
                            ItemId: parseInt(e.target.value) || 0,
                            Position: actionData.TargetBoardItem?.Position || { x: -1, y: -1 }
                          }
                        })}
                        placeholder="e.g., 399, 692, 504"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Position X</label>
                      <input
                        type="number"
                        value={actionData.TargetBoardItem?.Position?.x ?? -1}
                        onChange={(e) => setActionData({
                          ...actionData,
                          TargetBoardItem: {
                            ...(actionData.TargetBoardItem || { ItemId: 0 }),
                            Position: {
                              ...(actionData.TargetBoardItem?.Position || {}),
                              x: parseInt(e.target.value) || -1
                            }
                          }
                        })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Position Y</label>
                      <input
                        type="number"
                        value={actionData.TargetBoardItem?.Position?.y ?? -1}
                        onChange={(e) => setActionData({
                          ...actionData,
                          TargetBoardItem: {
                            ...(actionData.TargetBoardItem || { ItemId: 0 }),
                            Position: {
                              ...(actionData.TargetBoardItem?.Position || {}),
                              y: parseInt(e.target.value) || -1
                            }
                          }
                        })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* TargetBoardTask - Show for BoardTask target */}
              {(actionData.Target === 'BoardTask' || actionData.TargetBoardTask) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Board Task ID</label>
                  <input
                    type="number"
                    value={actionData.TargetBoardTask?.BoardTaskId || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetBoardTask: { BoardTaskId: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="e.g., 0, 1, 2"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* TargetScapeTask - Show for ScapeTask target */}
              {(actionData.Target === 'ScapeTask' || actionData.TargetScapeTask || actionData.Target === 'ScapeTaskMapTooltip') && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Scape Task ID</label>
                  <input
                    type="number"
                    value={actionData.TargetScapeTask?.ScapeTaskId || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetScapeTask: { ScapeTaskId: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="e.g., 1, 2"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* TargetInfoText - Show for ShowTooltip with Character */}
              {(actionData.Type === 'ShowTooltip' && actionData.TargetInfoText) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Info Text ID</label>
                  <input
                    type="text"
                    value={actionData.TargetInfoText?.TextId || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetInfoText: { TextId: e.target.value }
                    })}
                    placeholder="e.g., C1b_L1, C1b_L2, FTUE_test_29"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* TargetGroup - Show for Group target */}
              {(actionData.Target === 'Group' || actionData.TargetGroup) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Group Name</label>
                  <input
                    type="text"
                    value={actionData.TargetGroup?.GroupName || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetGroup: { GroupName: e.target.value }
                    })}
                    placeholder="e.g., BoardTasksAutoScroll"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* TargetPopup - Show for ShowTargetPopup */}
              {(actionData.Type === 'ShowTargetPopup' || actionData.TargetPopup) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Popup Type</label>
                  <select
                    value={actionData.TargetPopup?.GamePopupType || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetPopup: { GamePopupType: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Popup</option>
                    <option>TutorialFlowersPopup</option>
                    <option>TutorialFusionFairPopup</option>
                  </select>
                </div>
              )}
              
              {/* TypeShowCutScene - Show for ShowCutscene */}
              {(actionData.Type === 'ShowCutscene' || actionData.TypeShowCutScene) && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cutscene ID</label>
                  <input
                    type="text"
                    value={actionData.TypeShowCutScene?.CutsceneId || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TypeShowCutScene: { CutsceneId: e.target.value }
                    })}
                    placeholder="e.g., BridgeAreaStep0Part0"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* TargetAwaitedAnimation - Show for WaitForAnimationComplete */}
              {(actionData.Type === 'WaitForAnimationComplete' || actionData.TargetAwaitedAnimation) && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Awaited Animation</label>
                  <input
                    type="text"
                    value={actionData.TargetAwaitedAnimation?.AwaitedAnimations?.[0]?.AwaitedAnimation || ''}
                    onChange={(e) => setActionData({
                      ...actionData,
                      TargetAwaitedAnimation: {
                        AwaitedAnimations: [{
                          AwaitedAnimation: e.target.value,
                          AwaitComplete: false
                        }]
                      }
                    })}
                    placeholder="e.g., GenerateItem, MergeItem, BoardTaskReady"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              
              {/* TypeShowTooltip */}
              {actionData.TypeShowTooltip && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Tooltip Settings</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Type</label>
                      <select
                        value={actionData.TypeShowTooltip.Type || 'Tap'}
                        onChange={(e) => setActionData({
                          ...actionData,
                          TypeShowTooltip: { ...actionData.TypeShowTooltip, Type: e.target.value }
                        })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option>Tap</option>
                        <option>Info</option>
                        <option>DragAndDrop</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Position</label>
                      <select
                        value={actionData.TypeShowTooltip.InfoMessagePosition || 'Bottom'}
                        onChange={(e) => setActionData({
                          ...actionData,
                          TypeShowTooltip: { ...actionData.TypeShowTooltip, InfoMessagePosition: e.target.value }
                        })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option>Bottom</option>
                        <option>Top</option>
                        <option>Middle</option>
                        <option>TopLeft</option>
                        <option>BottomRight</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Show full JSON for reference */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">View Full JSON</summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(actionData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Save size={16} />Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const FlowPreview = ({ steps, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeAnimations, setActiveAnimations] = useState({});
  const [showDialog, setShowDialog] = useState(null);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [shaded, setShaded] = useState(false);
  const [lockedElements, setLockedElements] = useState(new Set());
  const [showPopup, setShowPopup] = useState(null);
  const [showCutscene, setShowCutscene] = useState(null);
  const [waitingForAnimation, setWaitingForAnimation] = useState(null);
  const [idleHelpActive, setIdleHelpActive] = useState(false);
  const [addedItems, setAddedItems] = useState(new Map());
  const [clickedItems, setClickedItems] = useState(new Set());
  const [mergeAnimations, setMergeAnimations] = useState(new Map());
  const [generationEffects, setGenerationEffects] = useState(new Map());
  
  // Safety checks for steps array
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-[90vw] h-[90vh] max-w-6xl flex flex-col overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <div>
              <h3 className="font-semibold text-lg">Flow Preview</h3>
              <p className="text-sm text-gray-500">No steps to preview</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded"><X size={20} /></button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">No Steps Configured</h3>
              <p className="text-gray-600">Add steps to your flow to see the preview.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const currentStep = (currentStepIndex >= 0 && currentStepIndex < steps.length) ? steps[currentStepIndex] : null;
  const isLastStep = currentStepIndex >= steps.length - 1;
  
  useEffect(() => {
    // Always reset on step change
    setActiveAnimations({});
    setShowDialog(null);
    setHighlightedElement(null);
    setShaded(false);
    setLockedElements(new Set());
    setShowPopup(null);
    setShowCutscene(null);
    setWaitingForAnimation(null);
    setIdleHelpActive(false);
    setClickedItems(new Set());
    setMergeAnimations(new Map());
    setGenerationEffects(new Map());
    
    if (currentStep && Array.isArray(currentStep.actions) && currentStep.actions.length > 0) {
      // Process actions with proper delays
      currentStep.actions.forEach((action, i) => {
        if (!action) return; // Skip null/undefined actions
        // Handle both string and object formats
        let actionObj;
        if (typeof action === 'string') {
          // Convert old string format to object format
          const typeMap = {
            'show_dialog': { Type: 'ShowDialog', Target: 'Null' },
            'show_finger': { Type: 'ShowTooltip', Target: 'BoardActiveGenerator' },
            'show_tooltip': { Type: 'ShowTooltip', Target: 'BoardActiveGenerator' },
            'highlight_ui': { Type: 'HighlightElement', Target: 'BoardScreen' },
            'highlight_element': { Type: 'HighlightElement', Target: 'BoardScreen' },
            'shade_screen': { Type: 'FadeIn', Target: 'BoardScreen' },
            'fade_in': { Type: 'FadeIn', Target: 'BoardScreen' }
          };
          actionObj = typeMap[action] || { Type: action.replace(/_/g, ''), Target: 'Null' };
        } else {
          actionObj = action;
        }
        
        // Process immediately for first action, then delay others
        const delay = i === 0 ? 100 : i * 400;
        
        setTimeout(() => {
          const actionType = actionObj.Type;
          const target = actionObj.Target || 'Null';
          
          // ShowDialog
          if (actionType === 'ShowDialog') {
            const dialogId = actionObj.TargetDialog?.DialogId || 0;
            const character = actionObj.TargetCharacter?.CharacterId || 'Chris';
            setShowDialog({
              id: dialogId,
              character: character,
              text: `Dialog ${dialogId} with ${character}`
            });
          }
          
          // HideDialog
          if (actionType === 'HideDialog') {
            setShowDialog(null);
          }
          
          // ShowTooltip
          if (actionType === 'ShowTooltip') {
            const tooltipType = actionObj.TypeShowTooltip?.Type || 'Tap';
            const position = actionObj.TypeShowTooltip?.InfoMessagePosition || 'Bottom';
            
            if (target === 'BoardItem' && actionObj.TargetBoardItem) {
              const pos = actionObj.TargetBoardItem.Position || { x: 2, y: 2 };
              setActiveAnimations(prev => ({
                ...prev,
                [`BoardItem-${pos.x}-${pos.y}`]: {
                  type: 'finger',
                  position: pos,
                  tooltipType: tooltipType,
                  itemId: actionObj.TargetBoardItem.ItemId,
                  positionType: position
                }
              }));
            } else if (target === 'BoardActiveGenerator') {
              setActiveAnimations(prev => ({
                ...prev,
                'BoardActiveGenerator': {
                  type: 'finger',
                  position: { x: 3, y: 3 },
                  tooltipType: tooltipType,
                  positionType: position
                }
              }));
            } else if (target === 'Character' && actionObj.TargetCharacter) {
              const charId = actionObj.TargetCharacter.CharacterId || 'Chris';
              setActiveAnimations(prev => ({
                ...prev,
                [`Character-${charId}`]: {
                  type: 'character',
                  characterId: charId,
                  tooltipType: tooltipType,
                  infoText: actionObj.TargetInfoText?.TextId
                }
              }));
            } else if (target === 'ScapeTaskMapTooltip' || target === 'ScapeTask') {
              setActiveAnimations(prev => ({
                ...prev,
                'ScapeTask': {
                  type: 'tooltip',
                  target: target,
                  tooltipType: tooltipType
                }
              }));
            }
          }
          
          // HighlightElement
          if (actionType === 'HighlightElement') {
            const highlightType = actionObj.TypeHighlight?.Type || 'Shader';
            setHighlightedElement({
              target: target,
              type: highlightType,
              isCommon: actionObj.TypeHighlight?.IsCommonAmongSteps || false
            });
          }
          
          // FadeIn
          if (actionType === 'FadeIn' || target === 'BoardScreen' || target === 'ScapeScreen') {
            setShaded(true);
          }
          
          // LockUIElement
          if (actionType === 'LockUIElement') {
            if (target === 'All') {
              setShaded(true);
              setLockedElements(prev => new Set(['All']));
            } else {
              setLockedElements(prev => new Set([...prev, target]));
            }
          }
          
          // UnLockUIElement
          if (actionType === 'UnLockUIElement') {
            if (target === 'All') {
              setShaded(false);
              setLockedElements(new Set());
            } else {
              setLockedElements(prev => {
                const newSet = new Set(prev);
                newSet.delete(target);
                return newSet;
              });
            }
          }
          
          // LockBoardItemDrag / UnLockBoardItemDrag
          if (actionType === 'LockBoardItemDrag') {
            setLockedElements(prev => new Set([...prev, 'BoardItemDrag']));
          }
          if (actionType === 'UnLockBoardItemDrag') {
            setLockedElements(prev => {
              const newSet = new Set(prev);
              newSet.delete('BoardItemDrag');
              return newSet;
            });
          }
          
          // LockUIGroup / UnLockUIGroup
          if (actionType === 'LockUIGroup' && actionObj.TargetGroup) {
            const groupName = actionObj.TargetGroup.GroupName;
            setLockedElements(prev => new Set([...prev, `Group-${groupName}`]));
          }
          if (actionType === 'UnLockUIGroup' && actionObj.TargetGroup) {
            const groupName = actionObj.TargetGroup.GroupName;
            setLockedElements(prev => {
              const newSet = new Set(prev);
              newSet.delete(`Group-${groupName}`);
              return newSet;
            });
          }
          
          // ShowTargetPopup
          if (actionType === 'ShowTargetPopup' && actionObj.TargetPopup) {
            const popupType = actionObj.TargetPopup.GamePopupType;
            setShowPopup({
              type: popupType,
              text: `Popup: ${popupType}`
            });
          }
          
          // ShowCutscene
          if (actionType === 'ShowCutscene' && actionObj.TypeShowCutScene) {
            const cutsceneId = actionObj.TypeShowCutScene.CutsceneId;
            setShowCutscene({
              id: cutsceneId,
              text: `Cutscene: ${cutsceneId}`
            });
          }
          
          // WaitForAnimationComplete
          if (actionType === 'WaitForAnimationComplete' && actionObj.TargetAwaitedAnimation) {
            const animations = actionObj.TargetAwaitedAnimation.AwaitedAnimations || [];
            if (animations.length > 0) {
              setWaitingForAnimation({
                animation: animations[0].AwaitedAnimation,
                awaitComplete: animations[0].AwaitComplete
              });
            }
          }
          
          // WaitForBoardTaskReady
          if (actionType === 'WaitForBoardTaskReady') {
            setWaitingForAnimation({
              animation: 'BoardTaskReady',
              awaitComplete: true
            });
          }
          
          // WaitForCollectItem
          if (actionType === 'WaitForCollectItem' && actionObj.TargetBoardItem) {
            const itemId = actionObj.TargetBoardItem.ItemId;
            setWaitingForAnimation({
              animation: 'CollectItem',
              itemId: itemId
            });
          }
          
          // AddItemOnBoard
          if (actionType === 'AddItemOnBoard' && actionObj.TargetBoardItem) {
            const pos = actionObj.TargetBoardItem.Position || { x: -1, y: -1 };
            const itemId = actionObj.TargetBoardItem.ItemId;
            if (pos.x >= 0 && pos.y >= 0) {
              setAddedItems(prev => {
                const newMap = new Map(prev);
                newMap.set(`${pos.x}-${pos.y}`, {
                  itemId: itemId,
                  position: pos
                });
                return newMap;
              });
            }
          }
          
          // IdleHelp
          if (actionType === 'IdleHelp' && actionObj.TypeIdleHelp) {
            const delay = actionObj.TypeIdleHelp.IdleHelpDelay || 2;
            setIdleHelpActive(true);
            setTimeout(() => {
              setIdleHelpActive(false);
            }, delay * 1000);
          }
          
          // ShowSimpleProceedText
          if (actionType === 'ShowSimpleProceedText') {
            setActiveAnimations(prev => ({
              ...prev,
              'SimpleProceedText': {
                type: 'text',
                text: 'Tap to continue'
              }
            }));
          }
          
          // CenteringScapesTooltip
          if (actionType === 'CenteringScapesTooltip') {
            setActiveAnimations(prev => ({
              ...prev,
              'CenteringScapesTooltip': {
                type: 'tooltip',
                text: 'Center Scapes'
              }
            }));
          }
        }, delay);
      });
    }
  }, [currentStepIndex, currentStep]);
  
  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handleClick = (target, itemData = null) => {
    // Visual feedback for click
    if (target && target !== 'dialog' && target !== 'popup') {
      setClickedItems(prev => new Set([...prev, target]));
      setTimeout(() => {
        setClickedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(target);
          return newSet;
        });
      }, 300);
    }
    
    // Handle generator click - show generation effect
    if (itemData?.isGenerator) {
      const genKey = `gen-${itemData.x}-${itemData.y}`;
      setGenerationEffects(prev => new Map([...prev, [genKey, Date.now()]]));
      setTimeout(() => {
        setGenerationEffects(prev => {
          const newMap = new Map(prev);
          newMap.delete(genKey);
          return newMap;
        });
      }, 1000);
    }
    
    // Handle item click - check for merge potential
    if (itemData?.configured && !itemData.isGenerator) {
      const itemKey = `${itemData.x}-${itemData.y}`;
      // Check if there's a similar item nearby that could merge
      const currentBoardItems = boardItemsRef.current || [];
      const nearbyItems = currentBoardItems.filter(i => 
        i.configured && 
        !i.isGenerator && 
        i.configured.itemId === itemData.configured.itemId &&
        i.id !== itemKey &&
        Math.abs(i.x - itemData.x) <= 1 &&
        Math.abs(i.y - itemData.y) <= 1
      );
      
      if (nearbyItems.length > 0) {
        // Show merge animation
        const mergeKey = `merge-${itemKey}`;
        setMergeAnimations(prev => new Map([...prev, [mergeKey, Date.now()]]));
        setTimeout(() => {
          setMergeAnimations(prev => {
            const newMap = new Map(prev);
            newMap.delete(mergeKey);
            return newMap;
          });
        }, 800);
      }
    }
    
    // Check if current step has completion condition for this target
    const completionConditions = currentStep?.completionConditions || [];
    
    // Check various completion condition types
    const canComplete = completionConditions.some(cond => {
      if (cond.type === 'user_action' && cond.value === 'click') {
        return true;
      }
      if (cond.type === 'item_on_board' && target.includes('BoardItem')) {
        return true;
      }
      if (cond.type === 'dialog_closed' && target === 'dialog') {
        return true;
      }
      if (cond.type === 'popup_closed' && target === 'popup') {
        return true;
      }
      return false;
    });
    
    // Also check if waiting for animation and it completes
    if (waitingForAnimation) {
      if (waitingForAnimation.animation === 'CollectItem' && target.includes('BoardItem')) {
        setWaitingForAnimation(null);
        setTimeout(() => handleNext(), 300);
        return;
      }
      if (waitingForAnimation.animation === 'BoardTaskReady' && target.includes('BoardTask')) {
        setWaitingForAnimation(null);
        setTimeout(() => handleNext(), 300);
        return;
      }
    }
    
    if (canComplete) {
      // Clear animations
      setActiveAnimations({});
      setShowDialog(null);
      setHighlightedElement(null);
      setShaded(false);
      setWaitingForAnimation(null);
      setClickedItems(new Set());
      setMergeAnimations(new Map());
      setGenerationEffects(new Map());
      
      // Move to next step
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };
  
  // Extract all configured board items, board tasks, and other elements from ALL steps
  const configuredItems = new Map();
  const configuredBoardTasks = new Map();
  const configuredBoardItems = new Map(); // For TargetBoardItems (multiple items)
  const configuredCharacters = new Map();
  
  steps.forEach(step => {
    if (!step || !Array.isArray(step.actions)) return;
    step.actions.forEach(action => {
      if (action === null || action === undefined) return;
      const actionObj = (action !== null && typeof action === 'object') ? action : { Type: action, Target: 'Null' };
      
      // TargetBoardItem (single item)
      if (actionObj.TargetBoardItem && actionObj.TargetBoardItem.ItemId) {
        const pos = actionObj.TargetBoardItem.Position || { x: -1, y: -1 };
        const key = `${pos.x}-${pos.y}`;
        if (pos.x >= 0 && pos.y >= 0) {
          configuredItems.set(key, {
            itemId: actionObj.TargetBoardItem.ItemId,
            position: pos,
            step: step.name,
            actionType: actionObj.Type
          });
        }
      }
      
      // TargetBoardItems (multiple items)
      if (actionObj.TargetBoardItems && Array.isArray(actionObj.TargetBoardItems)) {
        actionObj.TargetBoardItems.forEach((item, idx) => {
          if (item.ItemId && item.Position) {
            const key = `${item.Position.x}-${item.Position.y}`;
            configuredBoardItems.set(key, {
              itemId: item.ItemId,
              position: item.Position,
              step: step.name,
              actionType: actionObj.Type
            });
          }
        });
      }
      
      // TargetBoardTask
      if (actionObj.TargetBoardTask && actionObj.TargetBoardTask.TaskId) {
        configuredBoardTasks.set(actionObj.TargetBoardTask.TaskId, {
          taskId: actionObj.TargetBoardTask.TaskId,
          step: step.name,
          actionType: actionObj.Type
        });
      }
      
      // TargetCharacter
      if (actionObj.TargetCharacter && actionObj.TargetCharacter.CharacterId) {
        configuredCharacters.set(actionObj.TargetCharacter.CharacterId, {
          characterId: actionObj.TargetCharacter.CharacterId,
          step: step.name,
          actionType: actionObj.Type
        });
      }
      
      // BoardActiveGenerator
      if (actionObj.Target === 'BoardActiveGenerator' || (actionObj.Type === 'ShowTooltip' && actionObj.Target === 'BoardActiveGenerator')) {
        configuredItems.set('generator', {
          itemId: 'Generator',
          position: { x: 3, y: 3 },
          step: step.name,
          actionType: actionObj.Type
        });
      }
      
      // AddItemOnBoard - items added during preview
      if (actionObj.Type === 'AddItemOnBoard' && actionObj.TargetBoardItem) {
        const pos = actionObj.TargetBoardItem.Position || { x: -1, y: -1 };
        const key = `${pos.x}-${pos.y}`;
        if (pos.x >= 0 && pos.y >= 0) {
          configuredItems.set(key, {
            itemId: actionObj.TargetBoardItem.ItemId,
            position: pos,
            step: step.name,
            actionType: 'AddItemOnBoard',
            isAdded: true
          });
        }
      }
    });
  });
  
  // Merge added items from state
  addedItems.forEach((item, key) => {
    configuredItems.set(key, {
      ...item,
      isAdded: true
    });
  });
  
  // Generate board grid (7x7) with configured items
  const boardSize = 7;
  const boardItems = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const key = `${x}-${y}`;
      const configuredItem = configuredItems.get(key) || configuredBoardItems.get(key);
      boardItems.push({ 
        x, 
        y, 
        id: key,
        configured: configuredItem,
        isGenerator: x === 3 && y === 3
      });
    }
  }
  
  // Store boardItems in a ref or make it accessible to handleClick
  const boardItemsRef = useRef(boardItems);
  useEffect(() => {
    boardItemsRef.current = boardItems;
  }, [boardItems]);
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[90vw] h-[90vh] max-w-6xl flex flex-col overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="font-semibold text-lg">Flow Preview</h3>
            <p className="text-sm text-gray-500">Step {currentStepIndex + 1} of {steps.length}: {currentStep?.name || 'Unnamed Step'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentStepIndex ? 'bg-blue-500' : i < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`} />
              ))}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded"><X size={20} /></button>
          </div>
        </div>
        
        <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
          {/* Board Container */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative">
              {/* Board Grid */}
              <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-lg shadow-lg">
                {boardItems.map((item) => {
                  const itemKey = `${item.x}-${item.y}`;
                  const configuredItem = configuredItems.get(itemKey) || configuredBoardItems.get(itemKey);
                  const animationKey = `BoardItem-${item.x}-${item.y}`;
                  
                  // Check if this item is highlighted
                  // Note: typeof null === 'object' in JavaScript, so we need explicit null check
                  const highlightObj = (highlightedElement !== null && highlightedElement !== undefined && typeof highlightedElement === 'object') 
                    ? highlightedElement 
                    : (highlightedElement ? { target: highlightedElement } : null);
                  const isHighlighted = highlightObj && highlightObj.target && (
                    highlightObj.target === 'BoardItem' || 
                    highlightObj.target === item.id || 
                    highlightObj.target === itemKey ||
                    (highlightObj.target === 'BoardActiveGenerator' && item.isGenerator) ||
                    highlightObj.target === 'BoardScreen' ||
                    highlightObj.target === 'All'
                  );
                  
                  // Check for finger animations
                  const fingerAnimation = activeAnimations[animationKey] || 
                                        (item.isGenerator && activeAnimations['BoardActiveGenerator']) ||
                                        null;
                  const showFinger = fingerAnimation && fingerAnimation.position && 
                                    fingerAnimation.position.x === item.x && 
                                    fingerAnimation.position.y === item.y;
                  
                  // Check if item is locked
                  const isLocked = lockedElements.has('All') || 
                                  lockedElements.has('BoardItemDrag') ||
                                  (item.isGenerator && lockedElements.has('BoardActiveGenerator'));
                  
                  // Check if item was clicked
                  const wasClicked = clickedItems.has(item.id);
                  
                  // Check for merge animation
                  const mergeKey = `merge-${item.id}`;
                  const isMerging = mergeAnimations.has(mergeKey);
                  
                  // Check for generation effect
                  const genKey = `gen-${item.x}-${item.y}`;
                  const isGenerating = generationEffects.has(genKey);
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleClick(item.id, item)}
                      className={`
                        w-16 h-16 border-2 rounded-lg flex flex-col items-center justify-center transition-all relative
                        ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-100 hover:scale-105 active:scale-95'}
                        ${isHighlighted ? 'border-yellow-400 bg-yellow-100 ring-4 ring-yellow-300 animate-pulse shadow-lg shadow-yellow-300/50' : 'border-gray-200 bg-gray-50'}
                        ${showFinger ? 'ring-4 ring-blue-300 z-20 scale-110 shadow-lg shadow-blue-300/50' : ''}
                        ${configuredItem ? 'bg-blue-50 border-blue-300' : ''}
                        ${configuredItem?.isAdded ? 'bg-green-50 border-green-300' : ''}
                        ${shaded && !isHighlighted && !showFinger ? 'opacity-50' : ''}
                        ${wasClicked ? 'ring-4 ring-green-400 scale-105 bg-green-100 animate-ping' : ''}
                        ${isMerging ? 'ring-4 ring-purple-400 scale-110 bg-purple-100 animate-pulse' : ''}
                        ${isGenerating ? 'ring-4 ring-orange-400 scale-110 bg-orange-100 animate-bounce' : ''}
                      `}
                    >
                      {/* Generator icon */}
                      {item.isGenerator && (
                        <div className={`text-2xl relative ${isHighlighted ? 'animate-pulse' : ''} ${isGenerating ? 'animate-spin' : ''}`}>
                          ⚙️
                          {isGenerating && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-lg animate-bounce">✨</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Configured item display */}
                      {configuredItem && !item.isGenerator && (
                        <>
                          <div className={`text-xs font-bold ${configuredItem.isAdded ? 'text-green-600' : 'text-blue-600'} ${isMerging ? 'text-purple-600 animate-pulse' : ''}`}>
                            ID: {configuredItem.itemId}
                            {configuredItem.isAdded && <span className="ml-1">✨</span>}
                            {isMerging && <span className="ml-1 animate-bounce">💫</span>}
                          </div>
                          <div className={`text-[10px] ${configuredItem.isAdded ? 'text-green-400' : 'text-blue-400'} ${isMerging ? 'text-purple-400' : ''}`}>
                            ({configuredItem.position.x},{configuredItem.position.y})
                          </div>
                          {wasClicked && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-ping">
                              ✓
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Finger animation */}
                      {showFinger && fingerAnimation && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className={`text-4xl ${fingerAnimation.tooltipType === 'Finger' ? 'animate-finger-bounce' : 'animate-bounce'}`}>👆</div>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg z-20">
                            {fingerAnimation.tooltipType === 'Finger' || fingerAnimation.tooltipType === 'Tap' ? 'Tap here' : fingerAnimation.tooltipType === 'Info' ? 'Info' : fingerAnimation.tooltipType || 'Tap here'}
                          </div>
                        </div>
                      )}
                      
                      {/* Merge effect overlay */}
                      {isMerging && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className="text-3xl animate-pulse">💫</div>
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                            Merging!
                          </div>
                        </div>
                      )}
                      
                      {/* Generation effect overlay */}
                      {isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className="text-2xl animate-spin">✨</div>
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                            Generating!
                          </div>
                        </div>
                      )}
                      
                      {/* Empty cell indicator */}
                      {!configuredItem && !item.isGenerator && !showFinger && (
                        <div className="text-xs text-gray-300">•</div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Shade overlay */}
              {shaded && (
                <div className="absolute inset-0 bg-black/40 rounded-lg pointer-events-none" />
              )}
            </div>
          </div>
          
          {/* Dialog */}
          {showDialog && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-2xl p-6 max-w-md border-2 border-blue-300 animate-fadeIn z-50">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👤</div>
                <div className="flex-1">
                  <div className="font-semibold mb-2 text-lg">{showDialog.character}</div>
                  <div className="text-gray-700 mb-2">Dialog ID: {showDialog.id}</div>
                  <div className="text-sm text-gray-500 mt-2 p-3 bg-gray-50 rounded">
                    {showDialog.text || 'This is a preview of the dialog that would appear in the game.'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleClick('dialog')}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setShowDialog(null);
                    handleNext();
                  }}
                  className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          )}
          
          {/* No actions message */}
          {currentStep && (!currentStep.actions || currentStep.actions.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No Actions Configured</h3>
                <p className="text-gray-600">This step doesn't have any actions yet. Add actions in the step properties to see them in the preview.</p>
                <button
                  onClick={handleNext}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {/* Step Info Overlay */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border max-w-xs z-30">
            <div className="text-sm font-medium mb-2">Step: {currentStep?.name || 'Unnamed'}</div>
            {currentStep?.context && (
              <div className="text-xs text-gray-500 mb-2">
                Context: {currentStep.context.contextType.replace('_', ' ')} {currentStep.context.contextValue}
              </div>
            )}
            <div className="text-sm font-medium mb-2">Actions ({currentStep?.actions?.length || 0}):</div>
            <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
              {(currentStep?.actions || []).length === 0 ? (
                <div className="text-gray-400 italic">No actions</div>
              ) : (
                (currentStep?.actions || []).slice(0, 5).map((action, i) => {
                  const actionObj = typeof action === 'object' ? action : { Type: action, Target: 'Null' };
                  return (
                    <div key={i} className="text-gray-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span className="font-medium">{actionObj.Type}</span>
                      {actionObj.Target && actionObj.Target !== 'Null' && (
                        <span className="text-gray-400">→ {actionObj.Target}</span>
                      )}
                    </div>
                  );
                })
              )}
              {(currentStep?.actions || []).length > 5 && (
                <div className="text-gray-400">+ {(currentStep?.actions || []).length - 5} more</div>
              )}
            </div>
            {(currentStep?.completionConditions || []).length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-medium text-gray-500 mb-1">Completion:</div>
                <div className="space-y-1 text-xs">
                  {currentStep.completionConditions.map((cond, i) => (
                    <div key={i} className="text-gray-600">
                      {cond.type}: {cond.value || 'N/A'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Visual State Indicator */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border z-30">
            <div className="text-xs font-medium mb-2">Preview State:</div>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center gap-2 ${showDialog ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${showDialog ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Dialog {showDialog ? `(ID: ${showDialog.id})` : 'Hidden'}
              </div>
              <div className={`flex items-center gap-2 ${Object.keys(activeAnimations).length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${Object.keys(activeAnimations).length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Animations {Object.keys(activeAnimations).length > 0 ? `(${Object.keys(activeAnimations).length})` : 'None'}
              </div>
              <div className={`flex items-center gap-2 ${highlightedElement ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${highlightedElement ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Highlight {highlightedElement ? (highlightedElement !== null && typeof highlightedElement === 'object' && highlightedElement.target ? highlightedElement.target : (typeof highlightedElement === 'string' ? highlightedElement : 'Unknown')) : 'None'}
              </div>
              <div className={`flex items-center gap-2 ${shaded ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${shaded ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Shade {shaded ? 'Active' : 'Inactive'}
              </div>
              <div className={`flex items-center gap-2 ${lockedElements.size > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${lockedElements.size > 0 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                Locked {lockedElements.size > 0 ? `(${lockedElements.size})` : 'None'}
              </div>
              <div className={`flex items-center gap-2 ${showPopup ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${showPopup ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                Popup {showPopup ? showPopup.type : 'Hidden'}
              </div>
              <div className={`flex items-center gap-2 ${showCutscene ? 'text-pink-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${showCutscene ? 'bg-pink-500' : 'bg-gray-300'}`}></div>
                Cutscene {showCutscene ? showCutscene.id : 'Hidden'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Step
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isLastStep ? 'Finish Preview' : 'Next Step'}
          </button>
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
      <div className="bg-white rounded-xl shadow-xl w-[700px] max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-semibold text-lg">{modalTitle}</h3>
            {isAddingStep && (
              <p className="text-xs text-gray-500 mt-1">Choose an action to add to your step</p>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        
        {isAddingStep && (
          <div className="p-3 bg-blue-50 border-b border-blue-200 flex-shrink-0">
            <div className="flex items-start gap-2">
              <div className="text-blue-500 mt-0.5">💡</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900 mb-1">Step 2 of 2: Choose Action</div>
                <div className="text-xs text-blue-700">Select what this step should do. You can add more actions later in the step properties.</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex border-b flex-shrink-0">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all relative ${
                activeCategory === cat.id ? 'border-current' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`} 
              style={{ color: activeCategory === cat.id ? cat.color : undefined }}
            >
              {cat.name}
              {cat.description && (
                <div className="absolute top-full left-0 right-0 bg-gray-800 text-white text-xs p-1 rounded mt-1 opacity-0 hover:opacity-100 pointer-events-none z-10 transition-opacity">
                  {cat.description}
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
          {filteredActions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>No actions in this category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {filteredActions.map(action => (
                  <button 
                    key={action.id} 
                    onClick={() => setSelectedAction(action.id)} 
                    className={`p-4 rounded-lg border-2 text-center transition-all relative ${
                      selectedAction === action.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {selectedAction === action.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-2xl">{action.icon}</div>
                      <span className="text-sm font-medium">{action.name}</span>
                      {actionDescriptions[action.id] && (
                        <span className="text-xs text-gray-500 mt-1">{actionDescriptions[action.id]}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedAction === 'show_dialog' && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Dialog Configuration</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dialog ID</label>
                    <input 
                      type="text" 
                      value={dialogId} 
                      onChange={(e) => setDialogId(e.target.value)} 
                      placeholder="e.g., 1001199, ftue_intro_chris" 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                    />
                    <div className="mt-1 text-xs text-gray-500">Enter the dialog ID from your game system</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Character</label>
                    <select 
                      value={character} 
                      onChange={(e) => setCharacter(e.target.value)} 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
                    >
                      <option>Chris</option>
                      <option>Kara</option>
                      <option>Benny</option>
                      <option>Leslie</option>
                      <option>Mateo</option>
                      <option>Tyrell</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white rounded border">
                    <input 
                      type="checkbox" 
                      id="blockInput" 
                      checked={blockInput} 
                      onChange={(e) => setBlockInput(e.target.checked)} 
                      className="rounded"
                    />
                    <label htmlFor="blockInput" className="text-sm text-gray-700">Block player input while dialog is showing</label>
                  </div>
                </div>
              )}
              
              {selectedAction && selectedAction !== 'show_dialog' && (
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-900">Action Selected</span>
                  </div>
                  <p className="text-sm text-green-700">
                    You can configure additional details for this action after adding it to the step.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-4 border-t bg-white flex justify-end gap-2 flex-shrink-0 shadow-lg">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={handleAdd} 
            disabled={!selectedAction}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-medium ${
              selectedAction
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={16} />{buttonText}
          </button>
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
  // Helper function to create template steps for flows
  const createTemplateSteps = (flowId, stepCount) => {
    const templates = {
      'onboarding_core_loop': [
        {
          id: 'step_1',
          name: 'Welcome Dialog',
          legacy: 0,
          type: 'ui',
          context: { contextType: 'chapter', contextValue: '1' },
          actions: [
            {
              Type: 'LockUIElement',
              Target: 'All',
              TargetDialog: null,
              TargetBoardItem: null
            },
            {
              Type: 'ShowDialog',
              Target: 'Null',
              TargetDialog: { DialogId: 1001199 }
            },
            {
              Type: 'FadeIn',
              Target: 'BoardScreen',
              TypeFade: null
            }
          ],
          completionConditions: [{ type: 'dialog_closed', value: 'dialog' }]
        },
        {
          id: 'step_2',
          name: 'Show Board Generator Tooltip',
          legacy: 1,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Disco' },
          actions: [
            {
              Type: 'ShowTooltip',
              Target: 'BoardActiveGenerator',
              TypeShowTooltip: {
                Type: 'Finger',
                InfoMessagePosition: 'Top'
              },
              TargetBoardItem: null,
              TargetBoardTask: null
            },
            {
              Type: 'HighlightElement',
              Target: 'BoardActiveGenerator',
              TypeHighlight: { Type: 'Shader', IsCommonAmongSteps: false }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_3',
          name: 'Add Item to Board',
          legacy: 2,
          type: 'game',
          context: { contextType: 'item', contextValue: '399' },
          actions: [
            {
              Type: 'AddItemOnBoard',
              Target: 'BoardItem',
              TargetBoardItem: {
                ItemId: 399,
                Position: { x: 3, y: 3 }
              }
            },
            {
              Type: 'ShowTooltip',
              Target: 'BoardItem',
              TypeShowTooltip: {
                Type: 'Finger',
                InfoMessagePosition: 'Top'
              },
              TargetBoardItem: {
                ItemId: 399,
                Position: { x: 3, y: 3 }
              }
            },
            {
              Type: 'HighlightElement',
              Target: 'BoardItem',
              TypeHighlight: { Type: 'Shader', IsCommonAmongSteps: false },
              TargetBoardItem: {
                ItemId: 399,
                Position: { x: 3, y: 3 }
              }
            }
          ],
          completionConditions: [{ type: 'item_on_board', value: 'BoardItem' }]
        },
        {
          id: 'step_4',
          name: 'Wait for Board Task Ready',
          legacy: 3,
          type: 'game',
          context: { contextType: 'scape_task', contextValue: '1' },
          actions: [
            {
              Type: 'WaitForBoardTaskReady',
              Target: 'BoardTask',
              TargetBoardTask: { BoardTaskId: 0 }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_5',
          name: 'Show Character Tooltip',
          legacy: 4,
          type: 'ui',
          context: { contextType: 'chapter', contextValue: '1' },
          actions: [
            {
              Type: 'ShowTooltip',
              Target: 'Character',
              TypeShowTooltip: {
                Type: 'Info',
                InfoMessagePosition: 'Bottom'
              },
              TargetCharacter: { CharacterId: 'Chris' }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_6',
          name: 'Unlock UI Elements',
          legacy: 5,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Cascade' },
          actions: [
            {
              Type: 'UnLockUIElement',
              Target: 'All',
              TargetDialog: null
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        }
      ],
      'second_scapes_task': [
        {
          id: 'step_1',
          name: 'Scape Task Introduction',
          legacy: 0,
          type: 'ui',
          context: { contextType: 'scape_task', contextValue: '2' },
          actions: [
            {
              Type: 'LockUIElement',
              Target: 'All',
              TargetDialog: null
            },
            {
              Type: 'ShowDialog',
              Target: 'Null',
              TargetDialog: { DialogId: 10013 }
            },
            {
              Type: 'FadeIn',
              Target: 'BoardScreen',
              TypeFade: null
            }
          ],
          completionConditions: [{ type: 'dialog_closed', value: 'dialog' }]
        },
        {
          id: 'step_2',
          name: 'Highlight Scape Task',
          legacy: 1,
          type: 'ui',
          context: { contextType: 'scape_task', contextValue: '2' },
          actions: [
            {
              Type: 'HighlightElement',
              Target: 'ScapeTask',
              TypeHighlight: { Type: 'Shader', IsCommonAmongSteps: false },
              TargetScapeTask: { ScapeTaskId: 2 }
            },
            {
              Type: 'ShowTooltip',
              Target: 'ScapeTask',
              TypeShowTooltip: {
                Type: 'Finger',
                InfoMessagePosition: 'Top'
              },
              TargetScapeTask: { ScapeTaskId: 2 }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_3',
          name: 'Show Scape Task Map Tooltip',
          legacy: 2,
          type: 'ui',
          context: { contextType: 'scape_task', contextValue: '2' },
          actions: [
            {
              Type: 'ShowTooltip',
              Target: 'ScapeTaskMapTooltip',
              TypeShowTooltip: {
                Type: 'Info',
                InfoMessagePosition: 'Center'
              },
              TargetScapeTask: { ScapeTaskId: 2 }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        }
      ],
      'first_chapter_complete': [
        {
          id: 'step_1',
          name: 'Chapter Completion Celebration',
          legacy: 0,
          type: 'ui',
          context: { contextType: 'chapter', contextValue: '1' },
          actions: [
            {
              Type: 'LockUIElement',
              Target: 'All',
              TargetDialog: null
            },
            {
              Type: 'ShowCutscene',
              Target: 'Null',
              TypeShowCutScene: { CutsceneId: 'Chapter1Complete' }
            },
            {
              Type: 'ShowDialog',
              Target: 'Null',
              TargetDialog: { DialogId: 10014 }
            },
            {
              Type: 'FadeIn',
              Target: 'BoardScreen',
              TypeFade: null
            }
          ],
          completionConditions: [{ type: 'dialog_closed', value: 'dialog' }]
        },
        {
          id: 'step_2',
          name: 'Wait for Cutscene Complete',
          legacy: 1,
          type: 'flow',
          context: { contextType: 'chapter', contextValue: '1' },
          actions: [
            {
              Type: 'WaitForAnimationComplete',
              Target: 'Null',
              TargetAwaitedAnimation: {
                AwaitedAnimation: 'Chapter1Complete',
                AwaitComplete: true
              }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_3',
          name: 'Unlock UI After Celebration',
          legacy: 2,
          type: 'ui',
          context: { contextType: 'chapter', contextValue: '1' },
          actions: [
            {
              Type: 'UnLockUIElement',
              Target: 'All',
              TargetDialog: null
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        }
      ],
      'flowers_intro': [
        {
          id: 'step_1',
          name: 'Flowers Feature Discovery',
          legacy: 0,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Flowers' },
          actions: [
            {
              Type: 'LockUIElement',
              Target: 'All',
              TargetDialog: null
            },
            {
              Type: 'ShowDialog',
              Target: 'Null',
              TargetDialog: { DialogId: 10015 }
            },
            {
              Type: 'HighlightElement',
              Target: 'BoardItem',
              TypeHighlight: { Type: 'Shader', IsCommonAmongSteps: false },
              TargetBoardItem: {
                ItemId: 504,
                Position: { x: 2, y: 2 }
              }
            }
          ],
          completionConditions: [{ type: 'dialog_closed', value: 'dialog' }]
        },
        {
          id: 'step_2',
          name: 'Show Flowers Generator',
          legacy: 1,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Flowers' },
          actions: [
            {
              Type: 'ShowTooltip',
              Target: 'BoardActiveGenerator',
              TypeShowTooltip: {
                Type: 'Finger',
                InfoMessagePosition: 'Top'
              },
              TargetBoardItem: null
            },
            {
              Type: 'HighlightElement',
              Target: 'BoardActiveGenerator',
              TypeHighlight: { Type: 'Shader', IsCommonAmongSteps: false }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_3',
          name: 'Add Flower Item',
          legacy: 2,
          type: 'game',
          context: { contextType: 'item', contextValue: '504' },
          actions: [
            {
              Type: 'AddItemOnBoard',
              Target: 'BoardItem',
              TargetBoardItem: {
                ItemId: 504,
                Position: { x: 4, y: 4 }
              }
            }
          ],
          completionConditions: [{ type: 'item_on_board', value: 'BoardItem' }]
        },
        {
          id: 'step_4',
          name: 'Unlock UI',
          legacy: 3,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Flowers' },
          actions: [
            {
              Type: 'UnLockUIElement',
              Target: 'All',
              TargetDialog: null
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        }
      ],
      'recipes_intro': [
        {
          id: 'step_1',
          name: 'Recipes Feature Introduction',
          legacy: 0,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Recipes' },
          actions: [
            {
              Type: 'LockUIElement',
              Target: 'All',
              TargetDialog: null
            },
            {
              Type: 'ShowDialog',
              Target: 'Null',
              TargetDialog: { DialogId: 10016 }
            },
            {
              Type: 'FadeIn',
              Target: 'BoardScreen',
              TypeFade: null
            }
          ],
          completionConditions: [{ type: 'dialog_closed', value: 'dialog' }]
        },
        {
          id: 'step_2',
          name: 'Show Recipe Board Task',
          legacy: 1,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Recipes' },
          actions: [
            {
              Type: 'HighlightElement',
              Target: 'BoardTask',
              TypeHighlight: { Type: 'Shader', IsCommonAmongSteps: false },
              TargetBoardTask: { BoardTaskId: 1 }
            },
            {
              Type: 'ShowTooltip',
              Target: 'BoardTask',
              TypeShowTooltip: {
                Type: 'Finger',
                InfoMessagePosition: 'Top'
              },
              TargetBoardTask: { BoardTaskId: 1 }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_3',
          name: 'Wait for Recipe Task Ready',
          legacy: 2,
          type: 'game',
          context: { contextType: 'feature', contextValue: 'Recipes' },
          actions: [
            {
              Type: 'WaitForBoardTaskReady',
              Target: 'BoardTask',
              TargetBoardTask: { BoardTaskId: 1 }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_4',
          name: 'Unlock UI',
          legacy: 3,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Recipes' },
          actions: [
            {
              Type: 'UnLockUIElement',
              Target: 'All',
              TargetDialog: null
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        }
      ],
      'mode_2_unlock': [
        {
          id: 'step_1',
          name: 'Mode 2 Unlock Dialog',
          legacy: 0,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Mode Boost' },
          actions: [
            {
              Type: 'LockUIElement',
              Target: 'All',
              TargetDialog: null
            },
            {
              Type: 'ShowDialog',
              Target: 'Null',
              TargetDialog: { DialogId: 10017 }
            },
            {
              Type: 'FadeIn',
              Target: 'BoardScreen',
              TypeFade: null
            }
          ],
          completionConditions: [{ type: 'dialog_closed', value: 'dialog' }]
        },
        {
          id: 'step_2',
          name: 'Show Mode Unlock Popup',
          legacy: 1,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Mode Boost' },
          actions: [
            {
              Type: 'ShowTargetPopup',
              Target: 'Popup',
              TargetPopup: { GamePopupType: 'ModeUnlock' }
            }
          ],
          completionConditions: [{ type: 'popup_closed', value: 'popup' }]
        },
        {
          id: 'step_3',
          name: 'Show Simple Proceed Text',
          legacy: 2,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Mode Boost' },
          actions: [
            {
              Type: 'ShowSimpleProceedText',
              Target: 'Null',
              TargetInfoText: { TextId: 'Mode2Unlocked' }
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        },
        {
          id: 'step_4',
          name: 'Unlock UI',
          legacy: 3,
          type: 'ui',
          context: { contextType: 'feature', contextValue: 'Mode Boost' },
          actions: [
            {
              Type: 'UnLockUIElement',
              Target: 'All',
              TargetDialog: null
            }
          ],
          completionConditions: [{ type: 'user_action', value: 'click' }]
        }
      ]
    };
    
    return templates[flowId] || [];
  };

  // Initialize flows with template stepsData
  const initializeFlows = () => {
    const flowDefinitions = [
      { id: 'onboarding_core_loop', name: 'Core Loop Introduction', legacy: 1, steps: 14, status: 'active', priority: 100, modified: '2 hours ago' },
      { id: 'second_scapes_task', name: 'Second Scapes Task', legacy: 2, steps: 21, status: 'active', priority: 95, modified: '1 day ago' },
      { id: 'first_chapter_complete', name: 'First Chapter Completion', legacy: 3, steps: 12, status: 'active', priority: 90, modified: '3 days ago' },
      { id: 'flowers_intro', name: 'Flowers Feature Intro', legacy: 13, steps: 4, status: 'active', priority: 50, modified: '1 week ago' },
      { id: 'recipes_intro', name: 'Recipes Feature Intro', legacy: 14, steps: 7, status: 'draft', priority: 50, modified: 'Just now' },
      { id: 'mode_2_unlock', name: 'Mode 2 Unlock', legacy: 10, steps: 7, status: 'inactive', priority: 40, modified: '2 weeks ago' }
    ];
    
    return flowDefinitions.map(flow => ({
      ...flow,
      stepsData: createTemplateSteps(flow.id, flow.steps)
    }));
  };

  const [flows, setFlows] = useState(initializeFlows());
  const [steps, setSteps] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepContextModal, setShowStepContextModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showActionDetailsModal, setShowActionDetailsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [conditionContext, setConditionContext] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingActionIndex, setEditingActionIndex] = useState(null);
  const [editingAction, setEditingAction] = useState(null);
  const [pendingStepContext, setPendingStepContext] = useState(null);
  
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
    // Load steps for this flow - if flow has steps data, use it, otherwise initialize empty
    // In a real app, you'd fetch this from an API
    // For now, we'll check if flow has a steps property or initialize empty array
    if (flow.stepsData && Array.isArray(flow.stepsData) && flow.stepsData.length > 0) {
      // Flow has saved steps data, load it
      setSteps(flow.stepsData);
    } else {
      // Check if flow has steps count but no stepsData - this means it's an existing flow
      // that hasn't been loaded yet. Try to load from localStorage as fallback
      if (flow.steps && flow.steps > 0) {
        // Try to load from localStorage
        try {
          const savedData = localStorage.getItem(`flow_${flow.id}_steps`);
          if (savedData) {
            const parsedSteps = JSON.parse(savedData);
            if (Array.isArray(parsedSteps) && parsedSteps.length > 0) {
              setSteps(parsedSteps);
              // Update the flow with the loaded stepsData
              setFlows(flows.map(f => f && f.id === flow.id ? { ...f, stepsData: parsedSteps } : f));
              setView('editor');
              return;
            }
          }
        } catch (e) {
          console.error('Error loading steps from localStorage:', e);
        }
      }
      // Initialize with empty steps for new flow or flow without steps data
      setSteps([]);
    }
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
      const contextName = pendingStepContext 
        ? `${pendingStepContext.contextType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${pendingStepContext.contextValue}`
        : (actionData.id || 'New Step').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const newStep = {
        id: `step_${Date.now()}`,
        name: contextName,
        legacy: steps.length,
        type: actionTypes.find(a => a.id === actionData.id)?.category || 'ui',
        actions: [actionData.id],
        completionConditions: [{ type: 'user_action', value: 'click' }],
        context: pendingStepContext
      };
      setSteps([...steps, newStep]);
      setPendingStepContext(null);
      showToast('Step added successfully!');
    } else {
    }
  };
  
  const handleStepContextSelected = (contextData) => {
    setPendingStepContext(contextData);
    setShowStepContextModal(false);
    setShowActionModal(true);
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
    setShowActionDetailsModal(true);
  };
  
  const handleActionDetailsUpdate = (updatedStep) => {
    if (updatedStep) {
      const updatedSteps = steps.map(s => s && s.id === updatedStep.id ? updatedStep : s);
      setSteps(updatedSteps);
      setSelectedStep(updatedStep);
      setShowActionDetailsModal(false);
      setEditingActionIndex(null);
      setEditingAction(null);
      showToast('Action updated successfully!');
    }
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
    if (steps.length === 0) {
      showToast('Add at least one step to preview the flow', 'warning');
      return;
    }
    setShowPreview(true);
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
              setSteps([]); // Clear steps for new flow
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
            // Save steps to flow before going back
            if (selectedFlow) {
              const updatedFlow = { ...selectedFlow, stepsData: steps, steps: steps.length };
              setFlows(flows.map(f => f && f.id === selectedFlow.id ? updatedFlow : f));
              // Also save to localStorage as backup
              try {
                localStorage.setItem(`flow_${selectedFlow.id}_steps`, JSON.stringify(steps));
              } catch (e) {
                console.error('Error saving steps to localStorage:', e);
              }
            }
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
        {steps.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="max-w-2xl mx-auto p-8 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your First Step</h2>
                <p className="text-gray-600 mb-8">Start building your FTUE flow step by step</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4 text-left">Step-by-Step Guide:</h3>
                <div className="space-y-4 text-left">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <div className="font-medium mb-1">Add Your First Step</div>
                      <div className="text-sm text-gray-600">Click "Add Step" to create a new step in your flow</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <div className="font-medium mb-1">Configure Actions</div>
                      <div className="text-sm text-gray-600">Add actions like ShowDialog, ShowTooltip, HighlightElement, etc.</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <div className="font-medium mb-1">Set Completion Conditions</div>
                      <div className="text-sm text-gray-600">Define when the step is complete (user click, item on board, etc.)</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <div className="font-medium mb-1">Preview Your Flow</div>
                      <div className="text-sm text-gray-600">Use the Preview button to see how your flow will behave</div>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => {
                setSelectedStep(null);
                setShowStepContextModal(true);
              }} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto text-lg font-medium">
                <Plus size={20} />Add Your First Step
              </button>
            </div>
          </div>
        ) : (
          <>
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-3 border-b"><h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Step Library</h3></div>
          <div className="p-3 space-y-2">
            <button onClick={() => {
              setSelectedStep(null);
              setShowStepContextModal(true);
            }} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-2"><Plus size={16} />Add Step</button>
            <div className="pt-2">
              <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase">Quick Templates</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const templateStep = {
                      id: `step_${Date.now()}`,
                      name: 'Show Dialog',
                      legacy: steps.length,
                      type: 'ui',
                      context: { contextType: 'chapter', contextValue: '1' },
                      actions: [{
                        Type: 'ShowDialog',
                        Target: 'Null',
                        TargetDialog: { DialogId: 1001199 }
                      }],
                      completionConditions: [{ type: 'dialog_closed', value: 'dialog' }]
                    };
                    setSteps([...steps, templateStep]);
                    showToast('Dialog step template added!');
                  }}
                  className="w-full p-3 text-left text-sm bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all"
                >
                  <div className="font-medium text-blue-900 mb-1">💬 Show Dialog</div>
                  <div className="text-xs text-blue-600">Display a dialog to the player</div>
                </button>
                <button
                  onClick={() => {
                    const templateStep = {
                      id: `step_${Date.now()}`,
                      name: 'Highlight Generator',
                      legacy: steps.length,
                      type: 'ui',
                      context: { contextType: 'feature', contextValue: 'Disco' },
                      actions: [
                        {
                          Type: 'ShowTooltip',
                          Target: 'BoardActiveGenerator',
                          TypeShowTooltip: { Type: 'Finger', InfoMessagePosition: 'Top' }
                        },
                        {
                          Type: 'HighlightElement',
                          Target: 'BoardActiveGenerator',
                          TypeHighlight: { Type: 'Shader', IsCommonAmongSteps: false }
                        }
                      ],
                      completionConditions: [{ type: 'user_action', value: 'click' }]
                    };
                    setSteps([...steps, templateStep]);
                    showToast('Highlight step template added!');
                  }}
                  className="w-full p-3 text-left text-sm bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all"
                >
                  <div className="font-medium text-green-900 mb-1">👆 Highlight & Tooltip</div>
                  <div className="text-xs text-green-600">Show finger animation and highlight</div>
                </button>
                <button
                  onClick={() => {
                    const templateStep = {
                      id: `step_${Date.now()}`,
                      name: 'Add Item to Board',
                      legacy: steps.length,
                      type: 'game',
                      context: { contextType: 'item', contextValue: '399' },
                      actions: [{
                        Type: 'AddItemOnBoard',
                        Target: 'BoardItem',
                        TargetBoardItem: {
                          ItemId: 399,
                          Position: { x: 3, y: 3 }
                        }
                      }],
                      completionConditions: [{ type: 'item_on_board', value: 'BoardItem' }]
                    };
                    setSteps([...steps, templateStep]);
                    showToast('Add item step template added!');
                  }}
                  className="w-full p-3 text-left text-sm bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all"
                >
                  <div className="font-medium text-purple-900 mb-1">🎁 Add Item</div>
                  <div className="text-xs text-purple-600">Place an item on the board</div>
                </button>
                <button
                  onClick={() => {
                    setSelectedStep(null);
                    setShowStepContextModal(true);
                  }}
                  className="w-full p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all"
                >
                  <div className="font-medium text-gray-900 mb-1">➕ Custom Step</div>
                  <div className="text-xs text-gray-600">Create a step from scratch</div>
                </button>
              </div>
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
          </>
        )}
      </div>
      
      {showStepContextModal && <StepContextModal onClose={() => {
        setShowStepContextModal(false);
        setPendingStepContext(null);
      }} onSelect={handleStepContextSelected} />}
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
      {showActionDetailsModal && selectedStep && editingAction !== null && (
        <ActionDetailsModal
          onClose={() => {
            setShowActionDetailsModal(false);
            setEditingActionIndex(null);
            setEditingAction(null);
          }}
          action={editingAction}
          step={selectedStep}
          onUpdate={handleActionDetailsUpdate}
        />
      )}
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
      {showPreview && <FlowPreview steps={steps} onClose={() => setShowPreview(false)} />}
    </div>
  );
}
