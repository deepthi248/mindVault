//listeners
// 1. updateTitleInput
// 2.refreshEditor

// ONLY UI
import { analyseNote } from "./ai_insights.js";
import { getLatestNote, UpdateCurrentNote } from "./notes.js";
import { getAllNotes, getCurrentNote, setCurrentNote } from "./state.js";
import { showTagsOfCurrentNote, tagsUI } from "./tags.js";

export let note_title = null;
export let note_title_element = null;
export let content_editor = null;
export let updated_date_element = null;
export let sidebar_all_notes_elememt = null;
export let summary_element = null;
export let topics_element = null;
export let current_theme = null; // ← ADD THIS!
export let toggle_button_element = null;
export let questions_element = null;
export let suggestions_element = null;
export let lines_count = null;
export let char_count = null;
export let total_notes = null;
export let last_saved = null;
export let status = null;
export let note_date_updated_ele = null;
export let favorite_note_toggle = null;
export let all_tag_cards = null;
export let editor_section = null;
export let modal_input = null;
export let toast_body = null;
export let export_note_button = null;
export let new_note_button = null;
export let delete_note_button = null;
export let edit_content_button = null;
export let search_note_element = null;
export let search_tags = null;
export let ai_insights_button = null;
export let clear_note_button = null;
export let favorite_note_container = null;
export let show_favorites_button = null;
export let modal_tag_button = null;
export let manage_tags_button = null;
export let cm_close_button = null;
export let new_tag_button = null;
export let tag_modal = null;
export let tag_color_section = null;
export let is_name_valid = null;
export let cancel_modal_button = null;
export let manage_tags_section = null;
export let tag_delete_button = null;
export let delete_tag_modal = null;
export let dt_delete_button = null;
export let back_to_note_button = null;
export let cm_heading = null;
export let tag_add_button = null;
export let tc_sub_heading = null;
export let ct_container_1 = null;
export let ct_container_2 = null;
export let cn_add_tag_button = null;
export let current_tags_section = null;
export let mobile_menu_container = null;
export let mobile_menu_button = null;
export let mobile_overlay;
export let mobile_notes_tab = null;
export let mobile_ai_tab = null;
export let mobile_tags_tab = null;
export let mobile_favs_tab = null;
export let editor_body = null;
export let content_section = null;
export let ai_insights_section = null;
export let content_body = null;
export let footer = null;
export let note_tools_section = null;
export let side_bar = null;
let favorites_heading = null;
export let mobile_all_notes_container = null;
let show_favourites = true;

export const initUI = () => {
  note_title_element = document.querySelector("#note_title");
  updated_date_element = document.getElementById("updated_date");
  sidebar_all_notes_elememt = document.querySelector(".notes_list");
  footer = document.querySelector(".footer");
  note_date_updated_ele = document.getElementById("note_date_updated");
  editor_body = document.querySelector(".editor_body");
  lines_count = document.getElementById("lines_count");
  char_count = document.getElementById("char_count");
  total_notes = document.getElementById("total_notes");
  last_saved = document.getElementById("last_saved");
  status = document.getElementById("status");
  content_body = document.querySelector(".content_body");
  new_note_button = document.querySelector(".new_note_button");
  delete_note_button = document.querySelector(".delete_note_button");
  content_editor = document.querySelector(".note_text_area");
  edit_content_button = document.querySelector(".edit");
  search_note_element = document.querySelector("#search_notes");
  note_tools_section = document.querySelector(
    ".note_tools_section",
  );
  mobile_all_notes_container = document.querySelector(
    ".mobile_all_notes_container",
  );
  side_bar= document.querySelector(".side_bar")
  ai_insights_section = document.querySelector(".ai_insights_section");
  ai_insights_button = document.querySelector(".ai_insights_heading");
  summary_element = document.querySelector(".summary_list");
  topics_element = document.querySelector(".topics_list");
  questions_element = document.querySelector(".questions_list");
  suggestions_element = document.querySelector(".suggestions_list");
  clear_note_button = document.querySelector(".clear_note");
  current_tags_section = document.querySelector(".current_tags_section");
  favorite_note_container = document.querySelector(".favorite_note_container");
  favorite_note_toggle = document.querySelector("#favorite_note_toggle");
  show_favorites_button = document.querySelector(".show_favorites");
  favorites_heading = document.querySelector("#favorites_heading");
  content_section = document.querySelector(".content_section");
  export_note_button = document.querySelector(".export_note");
  search_tags = document.querySelector(".search_tags");
  all_tag_cards = document.querySelector(".display_all_tags");
  manage_tags_section = document.querySelector(".manage_tags_section");
  mobile_notes_tab = document.querySelector(".mobile_notes_tab");
  mobile_ai_tab = document.querySelector(".mobile_ai_tab");
  mobile_tags_tab = document.querySelector(".mobile_tags_tab");
  mobile_favs_tab = document.querySelector(".mobile_favs_tab");
  modal_input = document.querySelector(".cm_input");
  new_tag_button = document.querySelector(".new_tag_button");
  modal_tag_button = document.querySelector("#modal_tag_button");
  toast_body = document.querySelector(".toast_body");
  tag_modal = document.querySelector(".tag_modal");
  cm_close_button = document.querySelector(".cm_close");
  tag_color_section = document.querySelector(".tag_colors");
  manage_tags_button = document.querySelector(".manage_tags");
  editor_section = document.querySelector(".editor_section");
  is_name_valid = document.querySelector(".is_name_valid");
  cm_heading = document.querySelector(".cm_heading");
  back_to_note_button = document.querySelector(".back_to_note_button");
  tag_delete_button = document.querySelector(".tag_delete_button");
  tag_add_button = document.querySelector(".tag_add_button");
  delete_tag_modal = document.querySelector(".delete_tag_modal");
  dt_delete_button = document.querySelector("#dt_delete_button");
  cancel_modal_button = document.querySelector("#cancel_modal");
  ct_container_1 = document.querySelector(".ct_container_1");
  ct_container_2 = document.querySelector(".ct_container_2");
  mobile_menu_container = document.querySelector(".mobile_menu_container");
  cn_add_tag_button = document.querySelector(".cn_add_tag_button");
  tc_sub_heading = document.querySelector(".tc_sub_heading");
  mobile_menu_button = document.querySelector(".mobile_menu_button");
  mobile_overlay = document.querySelector(".mobile_overlay");
};

const refreshHeader = (note) => {
  let sub_title = null;
  deleteNoteButtonUI();
  if (note.note_id == 1) {
    sub_title = "Click on New Note to Create a Note";
    note_title_element.disabled = true;
  } else {
    delete_note_button.disabled = false;
    note_title_element.disabled = false;

    const edited_on = get_date(note.date_updated);
    sub_title = `Updated on ${edited_on}`;
  }
  updateFavouritesUI(note.is_favorite);

  note_title_element.value = note.title;
  note_date_updated_ele.innerText = sub_title;
};

//SIDEBAR LIST "UI"

export const refreshSideBar = ({ notes, note }) => {
  sidebar_all_notes_elememt.innerHTML = "";
  const highlighted_note = note;
  if (notes) {
    for (let note of notes) {
      sideBarCard({ notes: notes, note: note });
      if (highlighted_note.note_id === note.note_id) {
        const highlightedNote = document.querySelector(
          `[data-note-id="${note.note_id}"]`,
        );
        highlightedNote.classList.add("active");
      }
    }
  }
};

const sideBarCard = ({ note, notes }) => {
  const card = document.createElement("div");
  card.classList.add("view_note");
  const title = document.createElement("p");
  title.classList.add("card_title");
  const content = document.createElement("p");
  content.classList.add("card_content");
  title.innerText = formatPreview(note.title);
  content.innerText = note.content
    ? formatPreview(note.content)
    : "Start writing your story";

  card.appendChild(title);
  card.appendChild(content);

  card.dataset.noteId = note.note_id;

  sidebar_all_notes_elememt.appendChild(card);

  card.onclick = () => {
    highlightEditor(false);

    setCurrentNote(note);
    document.querySelectorAll(".view_note").forEach((el) => {
      el.classList.remove("active");
    });
    card.classList.add("active");
    refreshHeader(note);
    refreshEditor(note);
    getStats(note);
    generateInsight({
      status: note.ai_insights.status,
      notes: notes,
      note: note,
    });
  };
};

// once - current note is set, setting all the components accordingly
export const setDefaultUI = ({ notes, note, tags, tag }) => {
  //update header
  refreshHeader(note);
  refreshSideBar({ notes: notes, note: note });
  refreshEditor(note);
  highLatestNote({ notes: notes, note: note });

  loadTheme();
  generateInsight({
    status: note.ai_insights.status,
    notes: notes,
    note: note,
  });
  updateShowFavouritesUI(notes);
  showFavouritesUI();
  if (notes.length == 0) disableDeleteButton(true);
  else disableDeleteButton(false);
  // updateTagName(tag.name);
  tagsUI(tags);
};

export const refreshApp = ({ status, notes, note }) => {
  if (notes.length == 0) {
    disableDeleteButton(true);
  } else {
    disableDeleteButton(false);
  }

  refreshHeader(note);
  refreshSideBar({ notes: notes, note: note });

  refreshEditor(note);
  generateInsight({ status: status, notes: notes, note: note });

  refreshFooter(note);
};

const disableDeleteButton = (disabled) => {
  delete_note_button.disabled = disabled;
  if (disabled) delete_note_button.classList.add("inactive");
  else delete_note_button.classList.remove("inactive");
};

export const refreshEditor = (note) => {
  content_editor.value = note.content;

  showTagsOfCurrentNote(note.tags);
  getStats(note);
};

export const highLatestNote = ({ notes, note }) => {
  const latest_note = note;
  for (let note of notes) {
    if (latest_note.note_id === note.note_id) {
      const highlightedNote = document.querySelector(
        `[data-note-id="${note.note_id}"]`,
      );
      highlightedNote.classList.add("active");
    }
  }
};

const getStats = (note) => {
  const content = note.content;
  const total_lines = content.split("\n").length;
  const total_chars = content.length;

  lines_count.innerText = total_lines;
  char_count.innerText = total_chars;
};

const refreshFooter = (note) => {
  const notes = getAllNotes();
  const total_notes_count = notes.length;
  total_notes.innerText = total_notes_count;
  last_saved.innerText = getTimeDifference(note);
};

// THEME
export const loadTheme = () => {
  const light = "☀️ Light Mode";
  const dark = "🌙 Dark Mode";
  current_theme = localStorage.getItem("current_theme");

  const place_holder = current_theme == "light" ? dark : light;

  if (current_theme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }

  toggle_button_element = document.querySelector(".toggle_button");
  toggle_button_element.textContent = place_holder;

  return current_theme;
};

// HELPER FUNCTIONS
export const formatPreview = (text, maxLength = 40) => {
  if (!text) return "";
  else {
    let cleanText = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    return cleanText.length > maxLength
      ? cleanText.slice(0, maxLength) + "..."
      : cleanText;
  }
};

export const getTimeDifference = (note) => {
  const now = new Date();
  const diff_mins = new Date(note.date_updated);
  const diffMs = now - diff_mins;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
};

export const get_date = (date_updated) => {
  const month = new Date(date_updated).toLocaleString("en-IN", {
    month: "long",
  });

  const date = new Date(date_updated).getDate();
  const year = new Date(date_updated).getFullYear();
  return `${month} ${date}, ${year}`;
};

export const generateInsight = ({ status, notes, note }) => {
  if (notes.length == 0) {
    renderAIInsights("no notes");
    return;
  }
  renderAIInsights(status);
  if (status === "generating") {
    fetchAIInsights(note);
  }
  if (status === "success") {
    renderGeneratedInsights({ data: note.ai_insights, status: status });
  }
};

const renderAIInsights = (status) => {
  if (status === "no notes") {
    summary_element.innerHTML = "";
    topics_element.innerHTML = "";
    questions_element.innerHTML = "";
    suggestions_element.innerHTML = "";
  } else if (status === "not generated") {
    summary_element.innerHTML = "click on AI Insights to regenerate";
    topics_element.innerHTML = "click on AI Insights to regenerate";
    questions_element.innerHTML = "click on AI Insights to regenerate";
    suggestions_element.innerHTML = "click on AI Insights to regenerate";
  } else if (status === "generating") {
    summary_element.innerHTML = "Gnerating insights...";
    topics_element.innerHTML = "Gnerating insights...";
    questions_element.innerHTML = "Gnerating insights...";
    suggestions_element.innerHTML = "Gnerating insights...";
    const ai_insights = {
      summary: "Generating...",
      topics: "Generating...",
      questions: "Generating...",
      suggestions: "Generating...",
      generated_at: new Date().toISOString(),
      status: "generating",
    };
    UpdateCurrentNote({ ai_insights: ai_insights });
  } else if (status === "generating") {
    summary_element.innerHTML =
      "Failed to load Insights.Click on AI Insights to Regenerate.";
    topics_element.innerHTML =
      "Failed to load Insights.Click on AI Insights to Regenerate.";
    questions_element.innerHTML =
      "Failed to load Insights.Click on AI Insights to Regenerate.";
    suggestions_element.innerHTML =
      "Failed to load Insights.Click on AI Insights to Regenerate.";
  }
};

const fetchAIInsights = async (note) => {
  const { data, status } = await analyseNote(note);

  renderGeneratedInsights({ data: data, status: status });
};

export const renderGeneratedInsights = ({ data, status }) => {
  let insight = {};
  summary_element.innerHTML = "";
  topics_element.innerHTML = "";
  questions_element.innerHTML = "";
  suggestions_element.innerHTML = "";

  for (let sub_topic in data) {
    const ul = document.createElement("ul");
    for (let point of data[sub_topic]) {
      let li = document.createElement("li");
      li.classList.add("summary_note");
      li.innerText = point;
      ul.appendChild(li);
    }

    switch (sub_topic.toLowerCase()) {
      case "summary":
        summary_element.appendChild(ul);
        insight["summary"] = data[sub_topic];
        break;
      case "topics":
        topics_element.appendChild(ul);
        insight["topics"] = data[sub_topic];

        break;
      case "questions":
        questions_element.appendChild(ul);
        insight["questions"] = data[sub_topic];

        break;
      case "suggestions":
        suggestions_element.appendChild(ul);
        insight["suggestions"] = data[sub_topic];
        break;
    }
  }
  insight["status"] = status;
  insight["generated_at"] = new Date().toISOString();
  const { updatedNote } = UpdateCurrentNote({
    ai_insights: insight,
  });
  return updatedNote;
};

export const clearNote = () => {
  content_editor.value = "";
  content_editor.placeholder = "Content cleared add content...";
  highlightEditor(true);
  UpdateCurrentNote({ content: "Content cleared add content..." });
  const note = getCurrentNote();
  const notes = getAllNotes();
  refreshSideBar({ note: note, notes: notes });
};

export const updateFavorites = ({ note, notes }) => {
  const is_fav = !note.is_favorite;
  updateFavouritesUI(is_fav);
  UpdateCurrentNote({ is_favorite: is_fav });
};

const updateFavouritesUI = (is_fav) => {
  const src = is_fav ? "./assets/star_gold.png" : "./assets/star_cement.png";
  favorite_note_toggle.setAttribute("src", src);
};

const filterFavourites = (notes) => {
  return notes.filter((note) => note.is_favorite);
};

export const updateShowFavouritesUI = (notes) => {
  const filtered_notes = filterFavourites(notes);
  const note = getLatestNote(filtered_notes);
  if (show_favourites) refreshSideBar({ notes: filtered_notes, note: note });
  else refreshSideBar({ notes: notes, note: note });
  showFavouritesUI();
  show_favourites = !show_favourites;
};

export const showFavouritesUI = () => {
  show_favorites_button.innerHTML = "";
  const img = document.createElement("img");
  const span = document.createElement("span");
  const heading = !show_favourites ? "Show Favorites" : "Clear Favorites";
  const src = !show_favourites
    ? "./assets/star_gold_16.png"
    : "./assets/clear.png";
  img.setAttribute("src", src);
  img.classList.add("icon");
  span.innerText = heading;
  show_favorites_button.appendChild(img);
  show_favorites_button.appendChild(span);
};
export const highlightEditor = (highlight) => {
  if (highlight) content_editor.classList.add("editor_active");
  else content_editor.classList.remove("editor_active");
};

export const showMObileMenu = (show) => {
  if (show) {
    mobile_menu_container.classList.remove("hidden");
  } else {
    mobile_menu_container.classList.add("hidden");
  }
};

export const deleteNoteButtonUI = () => {
  const delete_icon = document.createElement("img");
  delete_icon.classList.add("delete_note_icon");
  delete_icon.setAttribute("src", "./assets/delete.png");
  if (window.innerWidth >= 769) {
    delete_note_button.innerHTML = "🗑️ Delete";
  } else {
    delete_note_button.innerHTML = "";
    delete_note_button.appendChild(delete_icon);
  }
};

export const resetMobileFooterActive = () => {
  document.querySelectorAll(".footer_function").forEach((item) => {
    item.classList.remove("active");
  });
};


