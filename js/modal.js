import {
  cm_heading,
  delete_tag_modal,
  modal_tag_button,
  tag_modal,
  toast_body,
} from "./ui.js";
import { showTagColorsUI } from "./tags.js";
import {getTagModalAction} from './state.js'
export let current_tag_action = null;

export const updateToastMessage = ({ status, message }) => {
  let edit_icon = document.createElement("img");
  if (status === "success") {
    edit_icon.setAttribute("src", "./assets/success.png");
    toast_body.appendChild(edit_icon);
    toast_body.classList.remove("failure");
    toast_body.classList.add("success");
  }
  if (status === "failure") {
    edit_icon.setAttribute("src", "./assets/failure.png");
    toast_body.appendChild(edit_icon);
    toast_body.classList.remove("success");
    toast_body.classList.add("failure");
  }
  toast_body.innerText = message;
};

export const handleShowToast = ({ status, message, showToast }) => {
  if (showToast) {
    toast_body.classList.remove("hidden");
    updateToastMessage({ status: status, message: message });
  } else {
    toast_body.classList.add("hidden");
  }
  hideToast();
};

export const hideToast = () => {
  setTimeout(() => {
    handleShowToast({ showToast: false });
  }, 3000);
};

export const hideModal = () => {
  tag_modal.classList.add("hidden");
};

export const showTagModal = () => {
  const action = getTagModalAction()
  if (action == "create") {
    cm_heading.innerText = "Create Tag";
    modal_tag_button.innerText = "Create";
  } else if (action == "edit") {
    cm_heading.innerText = "Edit Tag";
    modal_tag_button.innerText = "Update";
  }
  tag_modal.classList.remove("hidden");
  showTagColorsUI();
};

export const showDeleteModal = () => {
  delete_tag_modal.classList.remove("hidden");
};

export const hideDeleteModal = () => {
  delete_tag_modal.classList.add("hidden");
};
