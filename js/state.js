// VARIABLES + SETTERS
export let all_notes = [];
export let current_note = null;
export let all_tags = [];
export let current_tag = null;
export let tag_action = null;
export const setAllNotes = (notes) => {
  all_notes = notes;
};
export const getAllNotes = () => {
  return all_notes;
};

export const setCurrentNote = (note) => {
  current_note = note;
};

export const getCurrentNote = () => {
  return current_note;
};

export const setAllTags = (tags) => {
  all_tags = tags;
};

export const getCurrentTag = () => {
  return current_tag;
};

export const setCurrentTag = (tag) => {
  current_tag = tag;
};

export const getAllTags = () => {
  return all_tags;
};

//MODAL ACTION GETTER AND SETTER
export const setTagModalAction = (action) => {
  tag_action = action;
};

export const getTagModalAction = () => {
  return tag_action;
};
