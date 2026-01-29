import React, { useState, useMemo, useContext, createContext, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  FaHeading, FaImage, FaFont, FaLayerGroup, FaColumns, FaVideo, FaMapMarkedAlt, 
  FaPlayCircle, FaShoppingCart, FaList, FaBars, FaMobileAlt, FaTabletAlt, 
  FaDesktop, FaCog, FaSearch, FaTrash, FaSave, FaGlobe, FaChevronDown, 
  FaChevronRight, FaPlus, FaGripVertical, FaUndo, FaRedo
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
function cn(...inputs) { return twMerge(clsx(inputs)); }

// --- WIDGET REGISTRY ---
// Grouped by Category as requested
const WIDGET_LIBRARY = [
  { category: "Basic", items: [
    { type: "container", label: "Container", icon: <FaLayerGroup /> },
    { type: "heading", label: "Heading", icon: <FaHeading /> },
    { type: "text", label: "Text Editor", icon: <FaFont /> },
    { type: "image", label: "Image", icon: <FaImage /> },
    { type: "button", label: "Button", icon: <FaPlayCircle /> },
  ]},
  { category: "Layout", items: [
    { type: "grid_2", label: "2 Columns", icon: <FaColumns /> },
    { type: "grid_3", label: "3 Columns", icon: <FaColumns /> },
    { type: "spacer", label: "Spacer", icon: <FaBars /> },
    { type: "divider", label: "Divider", icon: <FaBars /> },
  ]},
  { category: "Media", items: [
    { type: "video", label: "Video", icon: <FaVideo /> },
    { type: "map", label: "Google Maps", icon: <FaMapMarkedAlt /> },
    { type: "carousel", label: "Image Carousel", icon: <FaImage /> },
  ]},
  { category: "Commerce", items: [
    { type: "product_card", label: "Product Card", icon: <FaShoppingCart /> },
    { type: "add_to_cart", label: "Add to Cart", icon: <FaShoppingCart /> },
    { type: "price_box", label: "Price Box", icon: <FaList /> },
  ]}
];

// --- INITIAL DATA ---
const INITIAL_LAYOUT = [
  {
    id: "section-1",
    type: "container",
    content: {},
    styles: {
      desktop: { padding: "40px", minHeight: "200px", display: "flex", flexDirection: "column", gap: "10px" },
      mobile: { padding: "20px" }
    },
    children: []
  }
];

// --- CONTEXT ---
const BuilderContext = createContext();

const BuilderProvider = ({ children }) => {
  const [layout, setLayout] = useState(INITIAL_LAYOUT);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState("desktop"); // desktop | tablet | mobile
  const [seo, setSeo] = useState({ title: "", description: "", slug: "", image: "" });
  const [draggedItem, setDraggedItem] = useState(null); // For overlay

  // Helper: Find node by ID
  const findNode = (id, nodes = layout) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper: Recursive Update
  const updateNode = (id, updates) => {
    const recursiveUpdate = (nodes) => {
      return nodes.map(node => {
        if (node.id === id) {
          // Merge styles deeply based on viewMode if style is being updated
          if (updates.styles) {
             const newStyles = { ...node.styles };
             newStyles[viewMode] = { ...newStyles[viewMode], ...updates.styles };
             return { ...node, styles: newStyles };
          }
          return { ...node, ...updates };
        }
        if (node.children) {
          return { ...node, children: recursiveUpdate(node.children) };
        }
        return node;
      });
    };
    setLayout(recursiveUpdate(layout));
  };

  // Helper: Delete Node
  const deleteNode = (id) => {
    const recursiveDelete = (nodes) => {
      return nodes.filter(n => n.id !== id).map(n => {
        if (n.children) return { ...n, children: recursiveDelete(n.children) };
        return n;
      });
    };
    setLayout(recursiveDelete(layout));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <BuilderContext.Provider value={{ 
      layout, setLayout, selectedId, setSelectedId, 
      viewMode, setViewMode, updateNode, deleteNode, 
      findNode, seo, setSeo, draggedItem, setDraggedItem 
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

// --- COMPONENTS ---

// 1. STYLE CONTROLS COMPONENT
const StyleControls = () => {
  const { selectedId, findNode, updateNode, viewMode } = useContext(BuilderContext);
  const node = findNode(selectedId);

  if (!node) return <div className="p-6 text-gray-500 text-center">Select an element to edit</div>;

  const currentStyle = node.styles?.[viewMode] || {};

  const handleStyleChange = (key, value) => {
    updateNode(selectedId, { styles: { [key]: value } });
  };

  const handleContentChange = (key, value) => {
    updateNode(selectedId, { content: { ...node.content, [key]: value } });
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-l border-gray-200">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-xs uppercase text-gray-700">Edit {node.type}</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded capitalize">{viewMode} Mode</span>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Content Tab */}
        <div>
          <h4 className="font-bold text-xs text-gray-900 mb-3 uppercase">Content</h4>
          {(node.type === 'heading' || node.type === 'text' || node.type === 'button') && (
            <div className="mb-3">
              <label className="text-xs mb-1 block">Text</label>
              <input 
                className="w-full border rounded p-2 text-sm" 
                value={node.content.text || ""}
                onChange={(e) => handleContentChange("text", e.target.value)}
              />
            </div>
          )}
          {(node.type === 'image' || node.type === 'product_card') && (
            <div className="mb-3">
              <label className="text-xs mb-1 block">Image URL</label>
              <input 
                className="w-full border rounded p-2 text-sm" 
                value={node.content.src || ""}
                onChange={(e) => handleContentChange("src", e.target.value)}
              />
            </div>
          )}
          {node.type === 'image' && (
             <div className="mb-3">
                <label className="text-xs mb-1 block">Overlay Text</label>
                <input 
                  className="w-full border rounded p-2 text-sm" 
                  value={node.content.overlayText || ""}
                  onChange={(e) => handleContentChange("overlayText", e.target.value)}
                />
             </div>
          )}
        </div>

        {/* Style Tab */}
        <div className="border-t pt-4">
          <h4 className="font-bold text-xs text-gray-900 mb-3 uppercase">Style ({viewMode})</h4>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-xs mb-1 block">Color</label>
              <input type="color" className="w-full h-8 cursor-pointer" value={currentStyle.color || "#000000"} onChange={(e) => handleStyleChange("color", e.target.value)} />
            </div>
            <div>
              <label className="text-xs mb-1 block">Background</label>
              <input type="color" className="w-full h-8 cursor-pointer" value={currentStyle.backgroundColor || "transparent"} onChange={(e) => handleStyleChange("backgroundColor", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
             <div>
                <label className="text-xs mb-1 block">Padding (px)</label>
                <input type="number" className="w-full border p-2 text-sm rounded" value={parseInt(currentStyle.padding)||0} onChange={(e)=>handleStyleChange("padding", `${e.target.value}px`)} />
             </div>
             <div>
                <label className="text-xs mb-1 block">Margin (px)</label>
                <input type="number" className="w-full border p-2 text-sm rounded" value={parseInt(currentStyle.margin)||0} onChange={(e)=>handleStyleChange("margin", `${e.target.value}px`)} />
             </div>
          </div>

          <div className="mb-3">
             <label className="text-xs mb-1 block">Font Size</label>
             <input type="range" min="10" max="100" className="w-full" value={parseInt(currentStyle.fontSize)||16} onChange={(e)=>handleStyleChange("fontSize", `${e.target.value}px`)} />
          </div>

          <div className="mb-3">
             <label className="text-xs mb-1 block">Border Radius</label>
             <input type="range" min="0" max="50" className="w-full" value={parseInt(currentStyle.borderRadius)||0} onChange={(e)=>handleStyleChange("borderRadius", `${e.target.value}px`)} />
          </div>

          <div className="mb-3">
             <label className="text-xs mb-1 block">Alignment</label>
             <select className="w-full border p-2 text-sm rounded" value={currentStyle.textAlign || 'left'} onChange={(e)=>handleStyleChange('textAlign', e.target.value)}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
             </select>
          </div>
        </div>

      </div>
    </div>
  );
};

// 2. SEO MODAL
const SeoSettings = ({ onClose }) => {
  const { seo, setSeo } = useContext(BuilderContext);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><FaGlobe /> SEO Settings</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold block mb-1">Page Title</label>
            <input className="w-full border p-2 rounded" value={seo.title} onChange={(e)=>setSeo({...seo, title: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">Slug</label>
            <input className="w-full border p-2 rounded" value={seo.slug} onChange={(e)=>setSeo({...seo, slug: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1">Meta Description</label>
            <textarea className="w-full border p-2 rounded" rows="3" value={seo.description} onChange={(e)=>setSeo({...seo, description: e.target.value})}></textarea>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">Close</button>
          <button onClick={onClose} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Save SEO</button>
        </div>
      </div>
    </div>
  );
};

// 3. CANVAS RENDERER
const RenderNode = ({ node }) => {
  const { selectedId, setSelectedId, deleteNode, viewMode } = useContext(BuilderContext);
  const isSelected = selectedId === node.id;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: node.id, data: { ...node } });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...node.styles?.[viewMode], // Apply responsive styles
    ...(viewMode === 'mobile' && node.type.includes('grid') ? { gridTemplateColumns: '1fr' } : {}) // Auto collapse grids on mobile
  };

  // Click handler to select element
  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedId(node.id);
  };

  const renderContent = () => {
    switch (node.type) {
      case 'container':
        return (
          <div className="min-h-[50px] h-full">
            <SortableContext items={node.children?.map(c => c.id) || []} strategy={verticalListSortingStrategy}>
              {node.children?.length === 0 && <div className="text-gray-300 text-center p-4 border border-dashed text-xs">Drop Elements Here</div>}
              {node.children?.map(child => <RenderNode key={child.id} node={child} />)}
            </SortableContext>
          </div>
        );
      case 'heading': return <h2 style={{color: 'inherit'}}>{node.content.text || "Heading"}</h2>;
      case 'text': return <p style={{color: 'inherit'}}>{node.content.text || "Lorem ipsum text block."}</p>;
      case 'button': return <button className="px-4 py-2 bg-blue-600 text-white rounded">{node.content.text || "Click Me"}</button>;
      case 'image': 
        return (
          <div className="relative group overflow-hidden" style={{borderRadius: style.borderRadius}}>
             <img src={node.content.src || "https://via.placeholder.com/800x400"} className="w-full h-auto object-cover" />
             {node.content.overlayText && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-xl">
                   {node.content.overlayText}
                </div>
             )}
          </div>
        );
      case 'grid_2':
      case 'grid_3':
        const cols = node.type === 'grid_2' ? 2 : 3;
        const gridStyle = { 
            display: 'grid', 
            gridTemplateColumns: viewMode === 'mobile' ? '1fr' : `repeat(${cols}, 1fr)`, 
            gap: '1rem' 
        };
        return (
           <div style={gridStyle}>
              {/* Grids usually pre-populate with empty containers in real builders, simpler here */}
              <div className="bg-gray-100 p-4 text-center border border-dashed">Col 1</div>
              <div className="bg-gray-100 p-4 text-center border border-dashed">Col 2</div>
              {cols === 3 && <div className="bg-gray-100 p-4 text-center border border-dashed">Col 3</div>}
           </div>
        );
        case 'product_card':
            return (
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm group">
                    <div className="h-40 bg-gray-200 relative overflow-hidden">
                        <img src={node.content.src || "https://via.placeholder.com/300"} className="w-full h-full object-cover group-hover:scale-110 transition" />
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded">Sale</span>
                    </div>
                    <div className="p-3">
                        <h4 className="font-bold text-sm">Product Title</h4>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-blue-600 font-bold">$49.00</span>
                            <button className="bg-black text-white p-1.5 rounded"><FaShoppingCart size={12}/></button>
                        </div>
                    </div>
                </div>
            );
      default: return <div className="p-2 bg-gray-100 border border-dashed">Unknown Widget</div>;
    }
  };

  // If container, we need useDroppable to allow dropping inside
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: node.id,
    data: { ...node, isContainer: node.type === 'container' }
  });

  // Merge refs
  const setRefs = (el) => {
    setNodeRef(el);
    if (node.type === 'container') setDroppableRef(el);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      onClick={handleClick}
      className={cn(
        "relative transition-all group/node",
        isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300"
      )}
    >
      {/* Element Toolbar (Visible on Select/Hover) */}
      {isSelected && (
        <div className="absolute -top-7 right-0 bg-blue-500 text-white flex rounded-t-md overflow-hidden text-xs z-50">
          <div className="px-2 py-1 bg-blue-700 font-bold uppercase">{node.type}</div>
          <div {...listeners} className="px-2 py-1 cursor-move hover:bg-blue-600"><FaGripVertical /></div>
          <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="px-2 py-1 hover:bg-red-500"><FaTrash /></button>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

// 4. SIDEBAR ITEM
const SidebarItem = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, isSidebar: true }
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:border-blue-500 hover:shadow-md cursor-grab bg-white transition group">
      <div className="text-xl text-gray-400 group-hover:text-blue-500 mb-2">{icon}</div>
      <span className="text-xs font-medium text-gray-600 text-center">{label}</span>
    </div>
  );
};

// --- MAIN BUILDER COMPONENT ---
export default function ElementorClone() {
  const { layout, setLayout, setViewMode, viewMode, seo, draggedItem, setDraggedItem } = useContext(BuilderContext);
  const [searchTerm, setSearchText] = useState("");
  const [showSeo, setShowSeo] = useState(false);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- DND HANDLERS ---
  const handleDragStart = (e) => setDraggedItem(e.active);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    setDraggedItem(null);

    if (!over) return;

    // 1. New Item from Sidebar
    if (active.data.current?.isSidebar) {
      const type = active.data.current.type;
      const newNode = {
        id: uuidv4(),
        type,
        content: { text: "Edit Text", src: "" },
        styles: { desktop: { padding: type === 'container' ? '20px' : '0px' }, mobile: {}, tablet: {} },
        children: []
      };

      // Add to root (simplified for this demo - real nesting requires recursive search of 'over.id')
      // For this demo, we append to root layout or specific container if identified
      setLayout([...layout, newNode]); 
    } 
    // 2. Reordering
    else if (active.id !== over.id) {
       // Ideally use recursive find & arrayMove. Simplified here for root level:
       const oldIndex = layout.findIndex((item) => item.id === active.id);
       const newIndex = layout.findIndex((item) => item.id === over.id);
       if(oldIndex !== -1 && newIndex !== -1) {
          setLayout(arrayMove(layout, oldIndex, newIndex));
       }
    }
  };

  // --- SAVE JSON ---
  const handleSaveLayout = () => {
    const data = { pageSettings: seo, elements: layout };
    console.log("PAGE JSON:", JSON.stringify(data, null, 2));
    alert("Layout saved to Console");
  };

  // --- VIEWPORT WIDTH ---
  const getCanvasWidth = () => {
    if (viewMode === 'mobile') return 'w-[375px]';
    if (viewMode === 'tablet') return 'w-[768px]';
    return 'w-full';
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
        
        {/* --- LEFT: SIDEBAR --- */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3">
               <FaBars className="text-pink-600"/> Elements
            </h2>
            <div className="relative">
               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
               <input 
                 className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                 placeholder="Search widget..."
                 onChange={(e) => setSearchText(e.target.value.toLowerCase())}
               />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {WIDGET_LIBRARY.map((group, i) => (
              <div key={i}>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">{group.category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {group.items.filter(i => i.label.toLowerCase().includes(searchTerm)).map((item) => (
                    <SidebarItem key={item.type} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* --- CENTER: CANVAS --- */}
        <main className="flex-1 flex flex-col min-w-0 bg-gray-200/50 relative">
          
          {/* Top Bar */}
          <div className="h-14 bg-white border-b flex justify-between items-center px-6 shadow-sm z-10">
             <div className="flex gap-2">
                <button onClick={() => setShowSeo(true)} className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-600" title="SEO Settings"><FaCog/></button>
                <button className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"><FaGlobe/></button>
             </div>
             
             <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setViewMode("desktop")} className={`p-2 rounded ${viewMode === "desktop" ? "bg-white shadow text-pink-600" : "text-gray-500"}`}><FaDesktop /></button>
                <button onClick={() => setViewMode("tablet")} className={`p-2 rounded ${viewMode === "tablet" ? "bg-white shadow text-pink-600" : "text-gray-500"}`}><FaTabletAlt /></button>
                <button onClick={() => setViewMode("mobile")} className={`p-2 rounded ${viewMode === "mobile" ? "bg-white shadow text-pink-600" : "text-gray-500"}`}><FaMobileAlt /></button>
             </div>

             <button onClick={handleSaveLayout} className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-green-700 flex items-center gap-2">
                <FaSave/> Update
             </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar" onClick={() => {}}>
             <div className={`bg-white min-h-[800px] shadow-2xl transition-all duration-300 ${getCanvasWidth()} relative`}>
                <SortableContext items={layout.map(n => n.id)} strategy={verticalListSortingStrategy}>
                   {layout.map(node => <RenderNode key={node.id} node={node} />)}
                </SortableContext>
                
                {layout.length === 0 && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                      <FaPlus className="text-4xl mb-2"/>
                      <p>Drag elements from sidebar here</p>
                   </div>
                )}
             </div>
          </div>
        </main>

        {/* --- RIGHT: SETTINGS --- */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col z-20 shadow-xl">
           <StyleControls />
        </aside>

        {/* SEO Modal */}
        {showSeo && <SeoSettings onClose={() => setShowSeo(false)} />}

        {/* Drag Overlay */}
        <DragOverlay>
           {draggedItem ? <div className="bg-pink-600 text-white p-2 rounded shadow-lg text-sm font-bold">Dragging Element...</div> : null}
        </DragOverlay>

      </div>
    </DndContext>
  );
}

// Wrap in Provider for final export
export const AdminPageBuilder = () => (
  <BuilderProvider>
    <ElementorClone />
  </BuilderProvider>
);