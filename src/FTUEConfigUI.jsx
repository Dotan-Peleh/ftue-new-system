import React, { useState, useEffect } from 'react';
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
    { id: 'scape_task', name: 'Scape Task', icon: '🗺️', description: 'Select a scape task' },
    { id: 'scene', name: 'Scene', icon: '🎬', description: 'Select a scene' },
    { id: 'chapter', name: 'Chapter', icon: '📖', description: 'Select a chapter' },
    { id: 'item', name: 'Item', icon: '🎁', description: 'Select an item' },
    { id: 'feature', name: 'Feature', icon: '⭐', description: 'Select a feature' }
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Fixed Header */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white z-10">
          <h3 className="font-semibold text-lg">Select Step Context</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(85vh - 140px)' }}>
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
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedContext === type.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm">{type.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          {selectedContext && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              {selectedContext === 'feature' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Select Feature</label>
                  <select
                    value={contextValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Don't allow "None" or empty string as a valid selection
                      if (value && value !== 'None') {
                        setContextValue(value);
                      } else {
                        setContextValue('');
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">— Select Feature —</option>
                    {features.filter(f => f !== 'None').map(feature => (
                      <option key={feature} value={feature}>{feature}</option>
                    ))}
                  </select>
                </div>
              ) : selectedContext === 'chapter' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Chapter Number</label>
                  <input
                    type="number"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="e.g., 1, 2, 3"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              ) : selectedContext === 'scape_task' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Scape Task ID</label>
                  <input
                    type="number"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="e.g., 1, 2"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              ) : selectedContext === 'item' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Item ID</label>
                  <input
                    type="number"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="e.g., 399, 692, 504"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              ) : selectedContext === 'scene' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Scene Name/ID</label>
                  <input
                    type="text"
                    value={contextValue}
                    onChange={(e) => setContextValue(e.target.value)}
                    placeholder="e.g., BridgeAreaStep0Part0"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              ) : null}
              
              {contextValue && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                  <span className="text-blue-700">Selected: </span>
                  <span className="font-mono">{contextTypes.find(t => t.id === selectedContext)?.name} = {contextValue}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Fixed Footer with CTA */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContinue();
            }}
            disabled={!canContinue}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              canContinue 
                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' 
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
  
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex >= steps.length - 1;
  
  useEffect(() => {
    if (currentStep && currentStep.actions && currentStep.actions.length > 0) {
      // Reset animations
      setActiveAnimations({});
      setShowDialog(null);
      setHighlightedElement(null);
      setShaded(false);
      
      // Process actions with proper delays
      currentStep.actions.forEach((action, i) => {
        // Handle both string and object formats
        let actionObj;
        if (typeof action === 'string') {
          // Convert old string format to object format
          if (action === 'show_dialog') {
            actionObj = { Type: 'ShowDialog', Target: 'Null' };
          } else if (action === 'show_finger' || action === 'show_tooltip') {
            actionObj = { Type: 'ShowTooltip', Target: 'BoardActiveGenerator' };
          } else if (action === 'highlight_ui' || action === 'highlight_element') {
            actionObj = { Type: 'HighlightElement', Target: 'BoardScreen' };
          } else if (action === 'shade_screen' || action === 'fade_in') {
            actionObj = { Type: 'FadeIn', Target: 'BoardScreen' };
          } else {
            actionObj = { Type: action.replace(/_/g, ''), Target: 'Null' };
          }
        } else {
          actionObj = action;
        }
        
        setTimeout(() => {
          // ShowDialog action
          if (actionObj.Type === 'ShowDialog' || actionObj.Type === 'show_dialog') {
            const dialogId = actionObj.TargetDialog?.DialogId || actionObj.dialogId || 0;
            const character = actionObj.TargetCharacter?.CharacterId || actionObj.character || 'Chris';
            setShowDialog({
              id: dialogId,
              character: character,
              text: `Dialog ${dialogId} with ${character}`
            });
          }
          
          // ShowTooltip action
          if (actionObj.Type === 'ShowTooltip' || actionObj.Type === 'show_tooltip' || actionObj.Type === 'show_finger') {
            const target = actionObj.Target || 'BoardActiveGenerator';
            if (target === 'BoardItem' && actionObj.TargetBoardItem) {
              const pos = actionObj.TargetBoardItem.Position || { x: 2, y: 2 };
              setActiveAnimations(prev => ({
                ...prev,
                'BoardItem': {
                  type: 'finger',
                  position: pos,
                  tooltipType: actionObj.TypeShowTooltip?.Type || 'Tap',
                  itemId: actionObj.TargetBoardItem.ItemId
                }
              }));
            } else if (target === 'BoardActiveGenerator' || target === 'Null') {
              setActiveAnimations(prev => ({
                ...prev,
                'BoardActiveGenerator': {
                  type: 'finger',
                  position: { x: 3, y: 3 },
                  tooltipType: actionObj.TypeShowTooltip?.Type || 'Tap'
                }
              }));
            }
          }
          
          // HighlightElement action
          if (actionObj.Type === 'HighlightElement' || actionObj.Type === 'highlight_ui' || actionObj.Type === 'highlight_element') {
            const target = actionObj.Target || 'BoardScreen';
            setHighlightedElement(target);
          }
          
          // FadeIn / Shade Screen action
          if (actionObj.Type === 'FadeIn' || actionObj.Type === 'fade_in' || actionObj.Type === 'shade_screen' || actionObj.Target === 'BoardScreen') {
            setShaded(true);
          }
          
          // LockUIElement
          if (actionObj.Type === 'LockUIElement') {
            setShaded(true);
          }
          
          // UnLockUIElement
          if (actionObj.Type === 'UnLockUIElement') {
            // Could show unlock animation
          }
        }, i * 500); // Increased delay for better visibility
      });
    } else if (currentStep && (!currentStep.actions || currentStep.actions.length === 0)) {
      // If step has no actions, show empty state
      setActiveAnimations({});
      setShowDialog(null);
      setHighlightedElement(null);
      setShaded(false);
    }
  }, [currentStepIndex, currentStep]);
  
  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handleClick = (target) => {
    // Check if current step has completion condition for this target
    const completionConditions = currentStep?.completionConditions || [];
    const canComplete = completionConditions.some(cond => 
      cond.type === 'user_action' && cond.value === 'click'
    );
    
    if (canComplete) {
      // Clear animations
      setActiveAnimations({});
      setShowDialog(null);
      setHighlightedElement(null);
      setShaded(false);
      
      // Move to next step
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };
  
  // Extract all configured board items from actions
  const configuredItems = new Map();
  const configuredPositions = new Set();
  
  steps.forEach(step => {
    (step.actions || []).forEach(action => {
      const actionObj = typeof action === 'object' ? action : { Type: action, Target: 'Null' };
      
      if (actionObj.TargetBoardItem && actionObj.TargetBoardItem.ItemId) {
        const pos = actionObj.TargetBoardItem.Position || { x: -1, y: -1 };
        const key = `${pos.x}-${pos.y}`;
        if (pos.x >= 0 && pos.y >= 0) {
          configuredItems.set(key, {
            itemId: actionObj.TargetBoardItem.ItemId,
            position: pos,
            step: step.name
          });
          configuredPositions.add(key);
        }
      }
      
      if (actionObj.Target === 'BoardActiveGenerator') {
        configuredItems.set('generator', {
          itemId: 'Generator',
          position: { x: 3, y: 3 },
          step: step.name
        });
        configuredPositions.add('3-3');
      }
    });
  });
  
  // Generate board grid (7x7) with configured items
  const boardSize = 7;
  const boardItems = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const key = `${x}-${y}`;
      const configuredItem = configuredItems.get(key);
      boardItems.push({ 
        x, 
        y, 
        id: key,
        configured: configuredItem,
        isGenerator: x === 3 && y === 3
      });
    }
  }
  
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
                  const isHighlighted = highlightedElement === 'BoardItem' || highlightedElement === item.id || 
                                       (highlightedElement === 'BoardActiveGenerator' && item.isGenerator) ||
                                       (highlightedElement === 'BoardScreen');
                  const hasFinger = activeAnimations['BoardItem'] || activeAnimations['BoardActiveGenerator'];
                  const fingerPos = hasFinger ? (activeAnimations['BoardItem']?.position || activeAnimations['BoardActiveGenerator']?.position || { x: 2, y: 2 }) : null;
                  const showFinger = fingerPos && fingerPos.x === item.x && fingerPos.y === item.y;
                  const configuredItem = item.configured;
                  const fingerAnimation = showFinger ? (activeAnimations['BoardItem'] || activeAnimations['BoardActiveGenerator']) : null;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`
                        w-16 h-16 border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all relative
                        ${isHighlighted ? 'border-yellow-400 bg-yellow-100 ring-4 ring-yellow-300 animate-pulse' : 'border-gray-200 bg-gray-50'}
                        ${showFinger ? 'ring-4 ring-blue-300 z-20 scale-110' : ''}
                        ${configuredItem ? 'bg-blue-50 border-blue-300' : ''}
                        ${shaded && !isHighlighted && !showFinger ? 'opacity-50' : ''}
                        hover:bg-gray-100 hover:scale-105
                      `}
                    >
                      {/* Generator icon */}
                      {item.isGenerator && (
                        <div className={`text-2xl ${isHighlighted ? 'animate-pulse' : ''}`}>⚙️</div>
                      )}
                      
                      {/* Configured item display */}
                      {configuredItem && !item.isGenerator && (
                        <>
                          <div className="text-xs font-bold text-blue-600">ID: {configuredItem.itemId}</div>
                          <div className="text-[10px] text-blue-400">({configuredItem.position.x},{configuredItem.position.y})</div>
                        </>
                      )}
                      
                      {/* Finger animation */}
                      {showFinger && fingerAnimation && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className="text-4xl animate-bounce">👆</div>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                            {fingerAnimation.tooltipType === 'Tap' ? 'Tap here' : fingerAnimation.tooltipType === 'Info' ? 'Info' : fingerAnimation.tooltipType || 'Tap here'}
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
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
            <div className="text-sm font-medium mb-2">Current Step Actions:</div>
            <div className="space-y-1 text-xs">
              {(currentStep?.actions || []).slice(0, 3).map((action, i) => {
                const actionObj = typeof action === 'object' ? action : { Type: action };
                return (
                  <div key={i} className="text-gray-600">• {actionObj.Type}</div>
                );
              })}
              {(currentStep?.actions || []).length > 3 && (
                <div className="text-gray-400">+ {(currentStep?.actions || []).length - 3} more</div>
              )}
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
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Character</label><select value={character} onChange={(e) => setCharacter(e.target.value)} className="w-full px-3 py-2 border rounded-lg"><option>Chris</option><option>Kara</option><option>Benny</option><option>Leslie</option><option>Mateo</option><option>Tyrell</option></select></div>
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
