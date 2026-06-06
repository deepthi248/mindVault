import { showTagModal, showDeleteModal, hideDeleteModal } from "./modal.js";
import { addTagsToNote, UpdateCurrentNote } from "./notes.js";
import { tag_color_section, editor_section } from "./ui.js";
import {
  getAllTags,
  setCurrentTag,
  setAllTags,
  getCurrentTag,
  getCurrentNote,
  setTagModalAction,
} from "./state.js";
import { saveTagsInLocalStorage } from "./storage.js";
import {
  all_tag_cards,
  cn_add_tag_button,
  ct_container_1,
  ct_container_2,
  is_name_valid,
  manage_tags_section,
  tc_sub_heading,
} from "./ui.js";
import { handleShowToast } from "./modal.js";
export const tag_default_color = "#7c3aed";
const tagColors = [
  "#7c3aed", // violet
  "#60a5fa", // blue
  "#16a34a", // green
  "#d97706", // orange
  "#dc2626", // red
  "#0ea5e9", // sky blue
];
const tagColors_bg = {
  "#7c3aed": "rgba(124,58,237,0.15)",
  "#60a5fa": "rgba(96,165,250,0.15)",
  "#16a34a": "rgba(22,163,74,0.15)",
  "#d97706": "rgba(217,119,6,0.15)",
  "#dc2626": "rgba(220,38,38,0.15)",
};
export const tagIcons = {
  "#7c3aed": `<svg width="28" height="28" viewBox="0 0 28 28" fill="#7c3aed" xmlns="http://www.w3.org/2000/svg"><path d="M23.8 15.2L15.2 23.8C14.25 24.75 12.75 24.75 11.8 23.8L4 16V4H16L23.8 11.8C24.75 12.75 24.75 14.25 23.8 15.2Z" /><circle cx="11" cy="11" r="3" fill="#0f172a"/></svg>`,

  "#60a5fa": `<svg width="28" height="28" viewBox="0 0 28 28" fill="#60a5fa" xmlns="http://www.w3.org/2000/svg"><path d="M23.8 15.2L15.2 23.8C14.25 24.75 12.75 24.75 11.8 23.8L4 16V4H16L23.8 11.8C24.75 12.75 24.75 14.25 23.8 15.2Z"/><circle cx="11" cy="11" r="3" fill="#0f172a"/></svg>`,

  "#16a34a": `<svg width="28" height="28" viewBox="0 0 28 28" fill="#16a34a" xmlns="http://www.w3.org/2000/svg"><path d="M23.8 15.2L15.2 23.8C14.25 24.75 12.75 24.75 11.8 23.8L4 16V4H16L23.8 11.8C24.75 12.75 24.75 14.25 23.8 15.2Z"/><circle cx="11" cy="11" r="3" fill="#0f172a"/></svg>`,

  "#d97706": `<svg width="28" height="28" viewBox="0 0 28 28" fill="#d97706" xmlns="http://www.w3.org/2000/svg"><path d="M23.8 15.2L15.2 23.8C14.25 24.75 12.75 24.75 11.8 23.8L4 16V4H16L23.8 11.8C24.75 12.75 24.75 14.25 23.8 15.2Z"/><circle cx="11" cy="11" r="3" fill="#0f172a"/></svg>`,

  "#dc2626": `<svg width="28" height="28" viewBox="0 0 28 28" fill="#dc2626" xmlns="http://www.w3.org/2000/svg"><path d="M23.8 15.2L15.2 23.8C14.25 24.75 12.75 24.75 11.8 23.8L4 16V4H16L23.8 11.8C24.75 12.75 24.75 14.25 23.8 15.2Z"/><circle cx="11" cy="11" r="3" fill="#0f172a"/></svg>`,
};

export const setDefaultTag = () => {
  const all_tags = getAllTags();
  if (all_tags == 0) {
  }
};

export const createTag = (name) => {
  let tags = getAllTags();
  const tag_exists = isTagExist({ tags: tags, name: name });
  if (!tag_exists) {
    updateCurrentTag({ name: name });
    const tag = getCurrentTag();
    setAllTags([...tags, tag]);
    saveTagsInLocalStorage();
    handleShowToast({
      status: "success",
      message: `Tag ${tag.name} has been successfully created`,
      showToast: true,
    });
    tagsUI([...tags, tag]);
  } else {
    handleShowToast({
      status: "failure",
      message: `Tag Exists!!!`,
      showToast: true,
    });
  }
};

export const updateTagName = (tag_name) => {
  if (tag_name) {
    let tags = getAllTags();
    tag_name = tag_name.trim().toLowerCase();
    const isNameValid = validateName(tag_name);
    const tag_exists = isTagExist({ tags: tags, name: tag_name });
    console.log(tag_exists);
    if (isNameValid && !tag_exists) {
      // showErrorMessage(isNameValid);
      modal_tag_button.disabled = false;
      updateCurrentTag({ name: tag_name });
      const tag = getCurrentTag();

      const index = tags.findIndex((n) => n.id === tag.id);
      if (index !== -1) {
        tags[index] = getCurrentTag();
      }
      saveTagsInLocalStorage();
      tags = getAllTags();

      handleShowToast({
        status: "success",
        message: `Tag ${tag_name} has been successfully updated`,
        showToast: true,
      });
      tagsUI(tags);
    } else {
      showErrorMessage(isNameValid);
    }
  }
};
//UI for the list and colors
export const showTagColorsUI = () => {
  tag_color_section.innerHTML = "";
  for (let color of tagColors) {
    const span = document.createElement("span");
    span.classList.add("tag_color");
    span.style.setProperty("background", color);
    tag_color_section.appendChild(span);
    span.dataset.color = color;
    span.style.setProperty("border", "2px solid transparent");
    if (color == tag_default_color) {
      span.style.setProperty("border", "2px solid #94a3b8");
    }
    span.onclick = () => {
      const all_spans = document.querySelectorAll(".tag_color");

      all_spans.forEach((sp) =>
        sp.style.setProperty("border", "2px solid transparent"),
      );
      updateCurrentTag({ color: color });
      span.style.setProperty("border", "2px solid #94a3b8");
    };
  }
};

const updateCurrentTag = (updates) => {
  const tag = getCurrentTag();
  const updateTag = {
    ...tag,
    ...updates,
  };

  setCurrentTag(updateTag);
};

const isTagExist = ({ tags, name }) => {
  return tags.some((curr_tag) => curr_tag.name == name);
};

const showErrorMessage = (valid) => {
  is_name_valid.innerText = valid ? " " : "Invalid Tag Name";
};

const validateName = (name) => {
  return /^[A-Za-z]+[a-zA-Z0-9 _\-.']*$/.test(name);
};
export const tagsUI = (tags) => {
  all_tag_cards.innerHTML = "";
  if (tags) {
    for (let tag of tags) {
      const template = document.querySelector("#tag_card_template");
      const tag_card_template = template.content.cloneNode(true);
      const tag_card = tag_card_template.querySelector(".tag_card");
      const tag_card_name = tag_card_template.querySelector(".tag_name");
      const tag_card_color = tag_card_template.querySelector(".tag_color_icon");
      const tag_edit_button =
        tag_card_template.querySelector(".tag_edit_button");
      const tag_delete_button =
        tag_card_template.querySelector(".tag_delete_button");

      const tag_add_button = tag_card_template.querySelector(".tag_add_button");
      tag_card_name.innerText = tag.name;
      tag_card_color.innerHTML = tagIcons[tag.color];
      
      tag_card.style.setProperty("margin", "5px");

      all_tag_cards.appendChild(tag_card_template);

      tag_card_template.onclick = () => {
        setCurrentTag(tag);
      };

      tag_edit_button.addEventListener("click", () => {
        setTagModalAction("edit");
        showTagModal();
        setCurrentTag(tag);
      });
      tag_delete_button.addEventListener("click", () => {
        setCurrentTag(tag);
        showDeleteModal();
      });

      tag_add_button.addEventListener("click", () => {
        addTagsToNote(tag);
      });
    }
  }
};

export const showTags = (note) => {
  const tags = note.tags;
  if (tags.length === 0) {
    const parent = document.createElement("div");
    parent.classList.add("empty_tag");
    parent.innerText = "Create your first tag to organize notes.";
    manage_tags_section.appendChild(parent);
  }
};

export const deleteTag = ({ tag_to_delete, tags }) => {
  const filtered_tags = tags.filter((curr) => curr.id != tag_to_delete.id);

  if (filtered_tags.length >= 1) {
    setAllTags(filtered_tags);
    saveTagsInLocalStorage();
    tagsUI(filtered_tags);
    hideDeleteModal();
    handleShowToast({
      status: "success",
      message: `Tag ${tag_to_delete.name} has been successfully deleted`,
      showToast: true,
    });
  } else {
    setAllTags([]);
    handleShowToast({
      status: "failure",
      message: `No tags to delete`,
      showToast: true,
    });
  }
};

export const backToNoteFunction = () => {
  manage_tags_section.classList.add("hidden");
  editor_section.classList.remove("hidden");
};

export const searchTags = ({ keyword, tags }) => {
  const filtered_tags = tags.filter((curr) => curr.name.includes(keyword));
  tagsUI(filtered_tags);
};

export const showTagsOfCurrentNote = (tags) => {
  ct_container_1.innerHTML = "";
  ct_container_2.innerHTML = "";

  if (tags.length >= 1) {
    cn_add_tag_button.classList.add("hidden");
    tc_sub_heading.classList.add("hidden");

    for (let tag of tags) {
      const tag_card = document.createElement("div");

      const tag_details = document.createElement("div");
      const tag_icon = document.createElement("div");
      const tag_name = document.createElement("span");

      const remove_tag = document.createElement("img");
      remove_tag.classList.add("cn_tag_remove");

      tag_card.classList.add("cn_tag_card");
      tag_details.classList.add("tag_details");
      tag_name.classList.add("cn_tag_name");

      tag_icon.innerHTML = tagIcons[tag.color];
      tag_name.innerText = tag.name;

      remove_tag.setAttribute("src", "./assets/clear.png");

      tag_details.appendChild(tag_icon);
      tag_details.appendChild(tag_name);

      tag_card.appendChild(tag_details);
      tag_card.appendChild(remove_tag);

      tag_card.style.setProperty("border", `1px solid ${tag.color}`);
      tag_card.style.setProperty("color", `${tag.color}`);
      tag_card.style.setProperty("background", `${tagColors_bg[tag.color]}`);
      const containers = [ct_container_1, ct_container_2];

      containers.forEach((curr) => {
        let clone = tag_card.cloneNode(true);
        curr.appendChild(clone);
        clone.querySelector(".cn_tag_remove").addEventListener("click", () => {
          deleteTagFromNote(tag);
        });
      });
    }
  } else {
    cn_add_tag_button.classList.remove("hidden");
    tc_sub_heading.classList.remove("hidden");
  }
};

export const deleteTagFromNote = (tag_to_delete) => {
  const note = getCurrentNote();
  const filtered_tags = note.tags.filter((tag) => tag.id != tag_to_delete.id);
  UpdateCurrentNote({ tags: filtered_tags });
  handleShowToast({
    status: "success",
    message: `Tag ${tag_to_delete.name} has been successfully removed from note`,
    showToast: true,
  });
  showTagsOfCurrentNote(filtered_tags);
};
