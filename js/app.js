// CORE LOGIC / USER INTERACTIONS -- BRAIN
import {
  ai_insights_button,
  ai_insights_section,
  back_to_note_button,
  cancel_modal_button,
  clear_note_button,
  clearNote,
  cm_close_button,
  cn_add_tag_button,
  content_body,
  content_editor,
  delete_note_button,
  dt_delete_button,
  editor_body,
  editor_section,
  export_note_button,
  favorite_note_container,
  generateInsight,
  highlightEditor,
  initUI,
  manage_tags_button,
  manage_tags_section,
  mobile_ai_tab,
  mobile_tags_tab,
  modal_input,
  modal_tag_button,
  new_note_button,
  new_tag_button,
  note_title_element,
  refreshApp,
  refreshSideBar,
  resetMobileFooterActive,
  search_note_element,
  search_tags,
  setDefaultUI,
  show_favorites_button,
  sidebar_all_notes_elememt,
  updateFavorites,
  updateShowFavouritesUI,
  current_tags_section,
  mobile_notes_tab,
  content_section,
  note_tools_section,
  footer,side_bar,mobile_favs_tab
} from "./ui.js";

import { exportNotePDF } from "./export_logic.js";
import {
  createNote,
  deleteNote,
  filteredNotes,
  noteDefaultState,
  UpdateCurrentNote,
} from "./notes.js";
import {
  backToNoteFunction,
  createTag,
  deleteTag,
  searchTags,
  tag_default_color,
  updateTagName,
} from "./tags.js";

import { hideModal, showTagModal } from "./modal.js";
import {
  getAllNotes,
  getAllTags,
  getCurrentNote,
  getCurrentTag,
  getTagModalAction,
  setCurrentTag,
  setTagModalAction,
} from "./state.js";
import {
  loadNotesFromLocalStorage,
  loadTagsInLocalStorage,
} from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  loadNotesFromLocalStorage();
  loadTagsInLocalStorage();
  //setting default UI
  initUI();
  //setting default note and all notes default states
  noteDefaultState();

  //updating UI accordingly
  const note = getCurrentNote();
  const notes = getAllNotes();
  const tag = getCurrentTag();
  const tags = getAllTags();
  setDefaultUI({ notes: notes, note: note, tag: tag, tags: tags });

  refreshApp({ notes: notes, note: note });
  handleCreateNewNote();
  handleDeleteNote();
  handleSearchNote();
  handleAIInsightGeneration();
  handleClearNote();
  handleFavorites();
  handleShowAllFavorites();
  handleExportPDF();
  handleModalClose();
  handleNewTag();
  handleManageTags();
  handleTagDeletion();
  handleBackToNote();
  handleSearchTags();
  handleAddTag();
  handleContentInput();
  handleTitleInput();
  handleModalAction();

  //mobile UI
  handleMobileFooterNavigation();
});
//NOTE CRUD OPERATIONS
const handleCreateNewNote = () => {
  new_note_button.addEventListener("click", () => {
    const note_created = createNote();
    const notes = getAllNotes();
    refreshApp({
      status: "not generated",
      notes: notes,
      note: note_created,
    });
  });
};

const handleDeleteNote = () => {
  delete_note_button.addEventListener("click", () => {
    const noteToDelete = getCurrentNote();
    const notes = getAllNotes();
    const { filtered_notes, latestNote } = deleteNote({
      notes: notes,
      note: noteToDelete,
    });
    refreshApp({ notes: filtered_notes, note: latestNote });
  });
};

const handleSearchNote = () => {
  const note = getCurrentNote();

  search_note_element.addEventListener("input", (event) => {
    let keyword = event.target.value;
    const filtered_notes = filteredNotes(keyword);
    refreshApp({ notes: filtered_notes, note: note });
  });
};

export const handleTitleInput = () => {
  note_title_element.addEventListener("input", (event) => {
    let updated_title =
      event.target.value === "" ? "Enter Note Title" : event.target.value;

    const { updatedNote } = UpdateCurrentNote({
      title: updated_title,
    });

    const notes = getAllNotes();
    refreshSideBar({ notes: notes, note: updatedNote });
  });
};

export const handleContentInput = () => {
  const notes = getAllNotes();
  content_editor.addEventListener("click", () => {
    highlightEditor(true);
  });

  content_editor.addEventListener("input", (event) => {
    const { updatedNote } = UpdateCurrentNote({ content: event.target.value });
    refreshSideBar({ notes: notes, note: updatedNote });
  });
};

//AI INSIGHTS
const handleAIInsightGeneration = () => {
  ai_insights_button.addEventListener("click", () => {
    const status = "generating";
    const note = getCurrentNote();
    const notes = getAllNotes();

    generateInsight({
      status: status,
      notes: notes,
      note: note,
    });
  });
};

//NOTE TOOLS
const handleClearNote = () => {
  const note = getCurrentNote();
  const notes = getAllNotes();
  clear_note_button.addEventListener("click", () => {
    clearNote();
    refreshSideBar({ notes: notes, note: note });
  });
};

const handleFavorites = () => {
  const notes = getAllNotes();
  favorite_note_container.addEventListener("click", () => {
    const note = getCurrentNote();

    updateFavorites({ note: note, notes: notes });
  });
};

const handleShowAllFavorites = () => {
  const notes = getAllNotes();
  show_favorites_button.addEventListener("click", () => {
    updateShowFavouritesUI(notes);
  });
};

const handleExportPDF = () => {
  const note = getCurrentNote();

  export_note_button.addEventListener("click", async () => {
    try {
      await exportNotePDF(note);
    } catch (error) {
      console.error(error);
      alert("Could not export PDF");
    }
  });
};

const handleManageTags = () => {
  manage_tags_button.addEventListener("click", () => {
    manage_tags_section.classList.remove("hidden");
    editor_section.classList.add("hidden");
  });
};

//TAG - CRUD
const handleNewTag = () => {
  new_tag_button.addEventListener("click", () => {
    setTagModalAction("create");
    const draft_tag = {
      id: new Date().toISOString(),
      color: tag_default_color,
    };
    setCurrentTag(draft_tag);
    showTagModal();
  });
};

const handleModalAction = () => {
  modal_tag_button.addEventListener("click", () => {
    const action = getTagModalAction();
    const name = modal_input.value.trim();
    if (action == "edit") {
      updateTagName(name);
    }
    if (action == "create") {
      createTag(name);
    }
  });
  modal_input.value = "";
};
const handleModalClose = () => {
  cm_close_button.addEventListener("click", () => {
    hideModal();
  });
  cancel_modal_button.addEventListener("click", () => {
    hideModal();
  });
};

// const  = () => {
//   const current_action = getTagModalAction();
//   const tag = getCurrentTag();

// };

const handleTagDeletion = () => {
  dt_delete_button.addEventListener("click", () => {
    const tag_to_delete = getCurrentTag();
    const tags = getAllTags();
    deleteTag({ tag_to_delete: tag_to_delete, tags: tags });
  });
};

const handleBackToNote = () => {
  back_to_note_button.addEventListener("click", () => {
    backToNoteFunction();
  });
};

const handleSearchTags = () => {
  search_tags.addEventListener("input", (event) => {
    let keyword = event.target.value;
    const tags = getAllTags();
    searchTags({ keyword: keyword, tags: tags });
  });
};

const handleAddTag = () => {
  cn_add_tag_button.addEventListener("click", () => {
    manage_tags_section.classList.remove("hidden");
    editor_section.classList.add("hidden");
  });
};

const handleMobileFooterNavigation = () => {
  mobile_ai_tab.addEventListener("click", () => {
    resetMobileFooterActive();
    manage_tags_section.classList.add("mobile_hidden");
    content_body.classList.remove("mobile_hidden");
    ai_insights_section.classList.remove("mobile_hidden");
    current_tags_section.classList.add("mobile_hidden");
    editor_section.classList.remove("mobile_hidden");
    editor_section.classList.remove("hidden");
   

    side_bar.classList.add("mobile_hidden");
    editor_body.classList.add("mobile_hidden");
  });

  mobile_tags_tab.addEventListener("click", () => {
    resetMobileFooterActive();
    manage_tags_section.classList.remove("mobile_hidden");
    manage_tags_section.classList.remove("hidden");

    editor_section.classList.add("mobile_hidden");
    side_bar.classList.add("mobile_hidden");
  });
  mobile_notes_tab.addEventListener("click", () => {
    resetMobileFooterActive();
    side_bar.classList.remove("mobile_hidden");
    content_section.classList.remove("mobile_hidden");
    footer.classList.add("mobile_hidden");
    ai_insights_section.classList.add("mobile_hidden");

    manage_tags_section.classList.add("mobile_hidden");
    manage_tags_section.classList.add("hidden");

    note_tools_section.classList.add("mobile_hidden");
  });

 mobile_favs_tab.addEventListener("click", () => {
    resetMobileFooterActive();
    side_bar.classList.add("mobile_hidden");
    content_section.classList.remove("mobile_hidden");
    footer.classList.add("mobile_hidden");
    ai_insights_section.classList.add("mobile_hidden");

    manage_tags_section.classList.add("mobile_hidden");
    manage_tags_section.classList.add("hidden");

    note_tools_section.classList.add("mobile_hidden");
    handleFavorites()
  });

};
