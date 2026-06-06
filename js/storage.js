// STORAGE ONLY
import { setAllNotes, all_notes, setAllTags, all_tags } from "./state.js";

export const loadNotesFromLocalStorage = () => {
  const jsonText = localStorage.getItem("all_notes");

  if (jsonText) {
    setAllNotes(JSON.parse(jsonText));
  } else {
    localStorage.setItem("all_notes", JSON.stringify([]));
  }
};

export const saveNotesInLocalStorage = () => {
  localStorage.setItem("all_notes", JSON.stringify(all_notes));
};

export const loadTagsInLocalStorage = () => {
  const jsonText = localStorage.getItem("all_tags");
  if (jsonText) {
    setAllTags(JSON.parse(jsonText));
  } else {
    localStorage.setItem("all_tags", JSON.stringify([]));
  }
};
export const saveTagsInLocalStorage = () => {
  localStorage.setItem("all_tags", JSON.stringify(all_tags));
};