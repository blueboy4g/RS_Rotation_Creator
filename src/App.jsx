import React, { useState } from 'react';
import Fuse from 'fuse.js';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const generateId = () => Math.random().toString(36).substring(2, 9);

const melee = [
    "Assault",
    "Backhand",
    "Balanced_Strike",
    "Barge",
    "Berserk",
    "Bladed_Dive",
    "Blood_Tendrils",
    "Chaos_Roar",
    "Cleave",
    "Decimate",
    "Destroy",
    "Dismember",
    "Flurry",
    "Forceful_Backhand",
    "Frenzy",
    "Fury",
    "Greater_Barge",
    "Greater_Flurry",
    "Greater_Fury",
    "Havoc",
    "Hurricane",
    "Kick",
    "Massacre",
    "Meteor_Strike",
    "Overpower",
    "Pulverise",
    "Punish",
    "Quake",
    "Sever",
    "Slaughter",
    "Slice",
    "Smash",
    "Stomp",
];

const range = [
    "Binding_Shot",
    "Bombardment",
    "Corruption_Shot",
    "Dazing_Shot",
    "Deadshot",
    "Death's_Swiftness",
    "Demoralise",
    "Fragmentation_Shot",
    "Greater_Dazing_Shot",
    "Greater_Death's_Swiftness",
    "Greater_Ricochet",
    "Incendiary_Shot",
    "Needle_Strike",
    "Piercing_Shot",
    "Rapid_Fire",
    "Ricochet",
    "Rout",
    "Salt_the_Wound",
    "Shadow_Tendrils",
    "Snap_Shot",
    "Snipe",
    "Tight_Bindings",
    "Unload",
];

const magic = [
    "Animate_Dead",
    "Asphyxiate",
    "Blood_Barrage",
    "Chain",
    "Combust",
    "Concentrated_Blast",
    "Corruption_Blast",
    "Deep_Impact",
    "Detonate",
    "Disruption_Shield",
    "Dragon_Breath",
    "Exsanguinate",
    "Greater_Chain",
    "Greater_Concentrated_Blast",
    "Greater_Sonic_Wave",
    "Greater_Sunshine",
    "Horror",
    "Impact",
    "Incite_Fear",
    "Intercept",
    "Magma_Tempest",
    "Metamorphosis",
    "Omnipower",
    "Shock",
    "Smoke_Cloud",
    "Smoke_Tendrils",
    "Sonic_Wave",
    "Spellbook_Swap",
    "Sunshine",
    "Surge",
    "Temporal_Anomaly",
    "Tsunami",
    "Vengeance",
    "Wild_Magic",
    "Wrack",
    "Wrack_and_Ruin",
];

const defence = [
    "Anticipation",
    "Barricade",
    "Bash",
    "Cease",
    "Debilitate",
    "Devotion",
    "Divert",
    "Freedom",
    "Ice_Asylum",
    "Immortality",
    "Ingenuity_of_the_Humans",
    "Natural_Instinct",
    "Preparation",
    "Provoke",
    "Reflect",
    "Rejuvenate",
    "Resonance",
    "Revenge",
];

const necromancy = [
    "Bloat",
    "Blood_Siphon",
    "Command_Phantom_Guardian",
    "Command_Putrid_Zombie",
    "Command_Skeleton_Warrior",
    "Command_Vengeful_Ghost",
    "Conjure_Phantom_Guardian",
    "Conjure_Putrid_Zombie",
    "Conjure_Skeleton_Warrior",
    "Conjure_Undead_Army",
    "Conjure_Vengeful_Ghost",
    "Death_Skulls",
    "Finger_of_Death",
    "Living_Death",
    "Necromancy",
    "Soul_Sap",
    "Soul_Strike",
    "Spectral_Scythe",
    "Spectral_Scythe_2",
    "Spectral_Scythe_3",
    "Touch_of_Death",
    "Volley_of_Souls",
    "Life_Transfer",
    "Threads_of_Fate",
    "Invoke_Lord_of_Bones",
    "Invoke_Death",
    "Darkness",
    "Split_Soul",
    "Death_Spark",
];

const misc = [
    "Adrenaline_potion",
    "Demon_Slayer",
    "Dive",
    "Dragon_Slayer",
    "Eat_Food",
    "Escape",
    "Limitless",
    "Move",
    "Onslaught",
    "Powerburst_of_vitality",
    "Quiver_ammo_slot_1",
    "Quiver_ammo_slot_2",
    "Reprisal",
    "Sacrifice",
    "Shatter",
    "Storm_Shards",
    "Target_Cycle",
    "Tuska's_Wrath",
    "Undead_Slayer",
    "Vulnerability_bomb",
    "Weapon_Special_Attack",
];

const gear = [
    "Abyssal_Scourge",
    "Bow_of_the_Last_Guardian",
    "Champion's_Ring",
    "Channeller's_Ring",
    "Cinderbane_Gloves",
    "Cryptbloom_Boots",
    "Cryptbloom_Bottoms",
    "Cryptbloom_Gloves",
    "Cryptbloom_Helm",
    "Cryptbloom_Top",
    "Dark_Bow",
    "Dark_Bow_In_EOF",
    "Dark_Shard_Of_Leng",
    "Dark_Sliver_Of_Leng",
    "Death_Guard",
    "Death_Guard_In_EOF",
    "Decimation",
    "Dracolich_Boots",
    "Dracolich_Chaps",
    "Dracolich_Coif",
    "Dracolich_Hauberk",
    "Dracolich_Vambraces",
    "Dragon_Battleaxe",
    "Dragon_claw",
    "Dragon_claw_In_EOF",
    "Dragon_Scimitar",
    "Dragon_Scimitar_In_EOF",
    "Ek-ZekKil",
    "Eldritch_Crossbow",
    "Eldritch_Crossbow_In_EOF",
    "Elite_Sirenic_Chaps",
    "Elite_Sirenic_Hauberk",
    "Elite_Sirenic_Mask",
    "Elite_Tectonic_Mask",
    "Elite_Tectonic_Robe_Bottom",
    "Elite_Tectonic_Robe_Top",
    "Enhanced_Gloves_Of_Passage",
    "Essence_of_Finality",
    "Flanking",
    "Fractured_Staff_Of_Armadyl",
    "Guthix_Staff",
    "Guthix_Staff_In_EOF",
    "Iban's_staff",
    "Iban's_staff_In_EOF",
    "Jaws_of_the_Abyss",
    "Masterwork_Spear_of_Annihilation",
    "Noxious_Scythe",
    "Obliteration",
    "Occultist's_Ring",
    "Ode_To_Deceit",
    "Omni_Guard",
    "Pernixs_Quiver_Black",
    "Pernixs_Quiver_Blue",
    "Pernixs_Quiver_Green",
    "Pernixs_Quiver_Orange",
    "Pernixs_Quiver_Purple",
    "Pernixs_Quiver_Red",
    "Pernixs_Quiver_Yellow",
    "Reaver's_Ring",
    "Roar_Of_Awakening",
    "Royal_Crossbow",
    "Seren_godbow",
    "Seren_godbow_In_EOF",
    "Skull_Lantern",
    "Soulbound_Lantern",
    "Stalker's_Ring",
    "Vestments_Of_Havoc_Boots",
    "Vestments_Of_Havoc_Hood",
    "Vestments_Of_Havoc_Robe_Bottom",
    "Vestments_Of_Havoc_Robe_Top",
    "Zamorak_Bow",
    "Zamorak_Bow_In_EOF",
    "Zaros_Godsword",
    "Zorgoth's_Soul_Ring"
];

const text = [
  "Text: P1",
  "Text: P2",
  "Text: P3",
  "Text: P4",
  "Text: P5",
  "Text: P6",
  "Text: 1",
  "Text: 2",
  "Text: 3",
  "Text: 4",
  "Text: 5",
  "Text: 6",
  "Text: Pre",
  "Text: Enter",
  "Text: Stall",
  "Text: Release",
]

const ABILITY_SECTIONS = {
  Melee: melee,
  Range: range,
  Magic: magic,
  Necromancy: necromancy,
  Defence: defence,
  Misc: misc,
  Gear: gear,
  Text: text,
};

const fuse = new Fuse(Object.values(ABILITY_SECTIONS).flat(), {
  includeScore: true,
  threshold: 0.4,
});

function DraggableBlock({ ability, blockType, length, listeners, attributes, isDragging, style }) {
  return (
    <div
      {...listeners}
      {...attributes}
      style={{
        padding: '4px 8px',
        margin: '4px 0',
        borderRadius: 4,
        backgroundColor: blockType === 'ticks' ? '#ddd' : '#4f46e5',
        color: blockType === 'ticks' ? '#555' : 'white',
        fontWeight: 'bold',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        textAlign: 'center',
        userSelect: 'none',
        width: 170,
        border: '2px dashed transparent',
        ...style,
      }}
      title={blockType === 'ticks' ? `${length} tick${length > 1 ? 's' : ''}` : ability}
    >
      {blockType === 'ticks' ? `${length} tick${length > 1 ? 's' : ''}` : ability}
    </div>
  );
}

function PaletteBlock({ id, ability, blockType, length }) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '4px 8px',
        marginBottom: 4,
        borderRadius: 4,
        backgroundColor: blockType === 'ticks' ? '#ddd' : '#4f46e5',
        color: blockType === 'ticks' ? '#555' : 'white',
        fontWeight: 'bold',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        textAlign: 'center',
        userSelect: 'none',
        width: 185,
        minHeight: 30,
        wordBreak: 'break-word',
        whiteSpace: 'normal'
      }}
      title={blockType === 'ticks' ? `${length} tick${length > 1 ? 's' : ''}` : ability}
    >
      {blockType === 'ticks' ? `${length} tick${length > 1 ? 's' : ''}` : ability}
    </div>
  );
}

function DropIndicator({ id }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        height: 10,
        margin: '4px 0',
        backgroundColor: isOver ? '#4f46e5' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    />
  );
}

function SortableBlock(props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <DraggableBlock
        {...props}
        listeners={listeners}
        attributes={attributes}
        isDragging={isDragging}
      />
    </div>
  );
}

function TrashBin() {
  const { isOver, setNodeRef } = useDroppable({ id: 'trash-bin' });
  return (
    <div
      ref={setNodeRef}
      style={{
        height: 50,
        marginTop: 20,
        border: '2px dashed #b91c1c',
        borderRadius: 8,
        backgroundColor: isOver ? '#dc2626' : '#fff',
        color: isOver ? '#fff' : '#b91c1c',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        cursor: 'pointer',
        userSelect: 'none',
        width: 200,
      }}
    >
      🗑️ Delete
    </div>
  );
}

export default function AbilityTimelineEditor() {
  const [timeline, setTimeline] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [expandedSections, setExpandedSections] = useState(
    Object.keys(ABILITY_SECTIONS).reduce((acc, k) => ({ ...acc, [k]: false }), {})
  );
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const paletteTicks = [1, 2, 3, 4, 5, 6].map((length) => ({
    id: `p_ticks_${length}`,
    blockType: 'ticks',
    length,
  }));

  const paletteAbilitySections = Object.entries(ABILITY_SECTIONS).map(([section, abilities]) => ({
    section,
    blocks: abilities.map((ability) => ({
      id: `p_${ability}`,
      ability,
      blockType: 'ability',
    })),
  }));

  const paletteBlocksFlat = [...paletteTicks];
  paletteAbilitySections.forEach((sec) => paletteBlocksFlat.push(...sec.blocks));

  const filteredAbilities = searchQuery
    ? fuse.search(searchQuery).map((res) => res.item)
    : [];

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    if (over.id === 'trash-bin' && !active.id.startsWith('p_')) {
      setTimeline((items) => items.filter((b) => b.id !== active.id));
      return;
    }

    const activeIdStr = active.id.toString();
    const overId = over.id.toString();
    const overIndex = parseInt(overId.replace('timeline-', ''), 10);

    if (activeIdStr.startsWith('p_')) {
      const paletteBlock = paletteBlocksFlat.find((b) => b.id === activeIdStr);
      if (!paletteBlock) return;
      const newBlock = {
        id: generateId(),
        blockType: paletteBlock.blockType,
        ability: paletteBlock.ability,
        length: paletteBlock.length,
      };
      const newTimeline = [...timeline];
      newTimeline.splice(overIndex, 0, newBlock);
      setTimeline(newTimeline);
      return;
    }

    const activeIndex = timeline.findIndex((b) => b.id === activeIdStr);
    if (activeIndex === -1 || activeIndex === overIndex) return;
    setTimeline((items) => arrayMove(items, activeIndex, overIndex));
  }

  function exportJSON() {
    let tick = 4;
    const result = [];
    for (const block of timeline) {
      if (block.blockType === 'ticks') {
        tick += block.length;
      } else if (block.blockType === 'ability') {
        result.push({ tick, ability: block.ability });
      }
    }
    const json = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(json);
    alert('Timeline JSON copied to clipboard!');
  }

  function importJSON() {
    const json = prompt('Paste your ability-only JSON here (tick + ability):');
    if (!json) return;
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed) || !parsed.every((b) => typeof b.tick === 'number' && typeof b.ability === 'string')) {
        alert('Invalid timeline JSON format.');
        return;
      }

      const rebuilt = [];
      let lastTick = 0;

      parsed.forEach(({ tick, ability }) => {
        const gap = tick - lastTick;
        if (gap > 0) {
          rebuilt.push({
            id: generateId(),
            blockType: 'ticks',
            length: gap,
          });
        }
        rebuilt.push({
          id: generateId(),
          blockType: 'ability',
          ability,
        });
        lastTick = tick;
      });

      setTimeline(rebuilt);
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  }

  function toggleSection(section) {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  const activeBlock =
    activeId && (paletteBlocksFlat.find((b) => b.id === activeId) || timeline.find((b) => b.id === activeId));

  return (
    <div style={{ padding: 10, fontFamily: 'sans-serif', userSelect: 'none' }}>
      <h1 style={{ margin: '0 0 12px 0' }}>RS Rotation Creator</h1>
      <h3 style={{ margin: '0 0 12px 0' }}>Drag and drop to build a rotation, note the default global cooldown in game is 3 ticks.</h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Timeline on far left */}
                    <SortableContext
                      items={timeline.map((_, i) => `timeline-${i}`)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '80vh',                // Set max height
                          overflowY: 'auto',             // Enable vertical scrolling
                          minWidth: 235,
                          padding: 10,
                          border: '1px solid #ccc',
                          borderRadius: 8,
                          backgroundColor: '#fafafa',
                        }}
                      >
                        {[...Array(timeline.length + 1)].map((_, i) => {
                          const block = timeline[i];
                          return (
                            <div key={i} style={{ width: '100%' }}>
                              <DropIndicator id={`timeline-${i}`} />
                              {block && (
                                <SortableBlock
                                  id={block.id}
                                  ability={block.ability}
                                  blockType={block.blockType}
                                  length={block.length}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </SortableContext>

                  {/* Middle section: Import/Export, ticks, trash bin */}
                  <div style={{minWidth: 160}}>
                      <div style={{marginBottom: 12}}>
                          <button
                              onClick={exportJSON}
                              style={{
                                  padding: '8px 16px',
                                  fontWeight: 'bold',
                                  marginRight: 12,
                                  cursor: 'pointer',
                                  width: '70%',
                                  marginBottom: 8,
                              }}
                          >
                              Export JSON
                          </button>
                          <button
                              onClick={importJSON}
                              style={{
                                  padding: '8px 16px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  width: '70%',
                              }}
                          >
                              Import JSON
                          </button>
                      </div>

                      <div style={{marginBottom: 24}}>
                          <SortableContext
                              items={paletteTicks.map((b) => b.id)}
                              strategy={verticalListSortingStrategy}
                          >
                              {paletteTicks.map(({id, blockType, length}) => (
                                  <PaletteBlock key={id} id={id} blockType={blockType} length={length}/>
                              ))}
                          </SortableContext>
                      </div>

                      <TrashBin/>
                  </div>

                  {/* Right section: Ability groups */}
                  <div style={{minWidth: 160}}>
                      {paletteAbilitySections.map(({section, blocks}) => (
                          <div key={section} style={{marginBottom: 16}}>
                              <h3
                                  onClick={() => toggleSection(section)}
                                  style={{
                                      cursor: 'pointer',
                                      userSelect: 'none',
                                      backgroundColor: '#4f46e5',
                                      color: 'white',
                                      padding: '4px 8px',
                                      borderRadius: 4,
                                      marginBottom: 8,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      fontWeight: 'bold',
                                  }}
                              >
                                  {section}
                                  <span style={{fontSize: 14}}>
                    {expandedSections[section] ? '▼' : '▶'}
                  </span>
                              </h3>
                              {expandedSections[section] && (
                                  <SortableContext
                                      items={blocks.map((b) => b.id)}
                                      strategy={verticalListSortingStrategy}
                                  >
                                      {blocks.map(({id, ability, blockType}) => (
                                          <PaletteBlock
                                              key={id}
                                              id={id}
                                              ability={ability}
                                              blockType={blockType}
                                          />
                                      ))}
                                  </SortableContext>
                              )}
                          </div>
                      ))}
                  </div>
<div style={{ minWidth: 200 }}>
            <input
              type="text"
              placeholder="Search ability..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '6px', marginBottom: '12px', marginTop: '20px' }}
            />
            <SortableContext
              items={filteredAbilities.map((a) => `p_${a}`)}
              strategy={verticalListSortingStrategy}
            >
              {filteredAbilities.map((ability) => (
                <PaletteBlock
                  key={`p_${ability}`}
                  id={`p_${ability}`}
                  ability={ability}
                  blockType="ability"
                />
              ))}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeBlock ? (
            <DraggableBlock
              ability={activeBlock.ability}
              blockType={activeBlock.blockType}
              length={activeBlock.length}
              style={{ width: 150 }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

