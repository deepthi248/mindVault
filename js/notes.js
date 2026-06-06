import { handleShowToast } from "./modal.js";
import {showTagsOfCurrentNote} from "./tags.js"
import {
  getAllNotes,
  getCurrentNote,
  setAllNotes,
  setCurrentNote,
} from "./state.js";
import {
  loadNotesFromLocalStorage,
  saveNotesInLocalStorage,
} from "./storage.js";
import { get_date } from "./ui.js";

export const noteDefaultState = () => {
  // No notes at all
  const all_notes = getAllNotes();
  if (all_notes.length == 0) {
    setNoteDefaultState();
  } else {
    const latest_note = getLatestNote(all_notes);
    setCurrentNote(latest_note);
  }
};

export const getLatestNote = (notes) => {
  return notes.reduce((accumulator, currentValue) => {
    if (accumulator == null) return currentValue;
    if (
      new Date(accumulator.date_updated) < new Date(currentValue.date_updated)
    ) {
      return currentValue;
    } else {
      return accumulator;
    }
  }, null);
};

export const filteredNotes = (keyword) => {
  const all_notes = getAllNotes();

  if (!keyword) {
    return all_notes;
  }
  const filtered_notes = all_notes.filter((note) => {
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();
    keyword = keyword.toLowerCase().trim();

    return title.includes(keyword) || content.includes(keyword);
  });
  return filtered_notes;
};

export const setNoteDefaultState = () => {
  const default_note = {
    note_id: 1,
    title: "Welcome to MindVault",
    content: "Write your notes here...!!",
    updated_date: new Date().toISOString(),
    ai_insights: {
      summary: ["click on AI Insights to regenerate"],
      topics: ["click on AI Insights to regenerate"],
      questions: ["click on AI Insights to regenerate"],
      suggestions: ["click on AI Insights to regenerate"],
      status: "not generated",
      generated_at: new Date().toISOString(),
    },
    tags: [],
    is_favorite: false,
  };
  setCurrentNote(default_note);
  loadNotesFromLocalStorage();
};
// NOTE CRUD OPS
export const UpdateCurrentNote = (updates) => {
  const all_notes = getAllNotes();
  const current_note = getCurrentNote();
  const updatedNote = {
    ...current_note,
    ...updates,
    date_updated: new Date().toISOString(),
  };

  setCurrentNote(updatedNote);

  const index = all_notes.findIndex((n) => n.note_id === updatedNote.note_id);

  if (index !== -1) {
    all_notes[index] = updatedNote;
  }
  saveNotesInLocalStorage();
  return { updatedNote };
};
// {all_notes,updatedNote }
export const createNote = () => {
  const all_notes = getAllNotes();
  const note_title = createDistinctTitle();

  let note_created = {
    title: note_title,
    note_id: Date.now().toString(),
    date_created: new Date().toISOString(),
    content: "Ready for content input....",
    date_updated: new Date().toISOString(),
    tags: [],
    ai_insights: {
      summary: ["click on AI Insights to regenerate"],
      topics: ["click on AI Insights to regenerate"],
      questions: ["click on AI Insights to regenerate"],
      suggestions: ["click on AI Insights to regenerate"],
      generated_at: new Date().toISOString(),
      status: "not generated",
    },
    tags: [],
    is_favorite: false,
  };

  // update all notes -- localstorage
  setCurrentNote(note_created);
  setAllNotes([...all_notes, note_created]);
  saveNotesInLocalStorage();

  return note_created;
};
const createDistinctTitle = () => {
  const notes = getAllNotes();
  let note_title = `New Note: ${get_date(new Date().toISOString())}`
  const titleCount = notes.filter((note) =>
    note.title.toLowerCase().startsWith(note_title.toLowerCase()),
  ).length;
  console.log(titleCount);
  if (titleCount == 0) return note_title;
  else {
    note_title = note_title + `\ (${titleCount})`;
  }
  return note_title;
};

export const deleteNote = ({ notes, note }) => {
  const filtered_notes = notes.filter(
    (curr_note) => curr_note.note_id != note.note_id,
  );
  const latestNote =
    filtered_notes.length > 0
      ? getLatestNote(filtered_notes)
      : setNoteDefaultState();
  setCurrentNote(latestNote);
  setAllNotes(filtered_notes);
  saveNotesInLocalStorage();

  return { filtered_notes, latestNote };
};

export const addTagsToNote = (tag_to_add) => {
  const note = getCurrentNote();
  const tags = note.tags;
  const tag_exists = tags.some((t) => t.id == tag_to_add.id);
  if (!tag_exists) {
    const updated_tags = [...tags, tag_to_add];
    UpdateCurrentNote({ tags: [...tags, tag_to_add] });
    handleShowToast({
      status: "success",
      message: `Tag ${tag_to_add.name} has been successfully added`,
      showToast: true,
    });
    showTagsOfCurrentNote(updated_tags);
  } else {
    handleShowToast({
      status: "failure",
      message: `Tag ${tag_to_add.name} is already added`,
      showToast: true,
    });
  }
};
