

const showMobileEditorOnly = () => {
  editor_section.classList.remove("hidden");
  manage_tags_section.classList.add("hidden");
  document.querySelector(".ai_insights_section").classList.add("mobile_hidden");
};

const handleMobileFooterNavigation = () => {
  showMobileEditorOnly();

  mobile_notes_tab.addEventListener("click", () => {
    side_bar.classList.add("mobile_open");
    mobile_overlay.classList.add("show");

    resetMobileFooterActive();
    mobile_notes_tab.classList.add("active");
  });

  mobile_ai_tab.addEventListener("click", () => {
    editor_section.classList.remove("hidden");
    manage_tags_section.classList.add("hidden");

    document
      .querySelector(".ai_insights_section")
      .classList.remove("mobile_hidden");

    resetMobileFooterActive();
    mobile_ai_tab.classList.add("active");
  });

  mobile_tags_tab.addEventListener("click", () => {
    editor_section.classList.add("hidden");
    manage_tags_section.classList.remove("hidden");

    resetMobileFooterActive();
    mobile_tags_tab.classList.add("active");
  });

  mobile_favs_tab.addEventListener("click", () => {
    updateShowFavouritesUI(getAllNotes());

    side_bar.classList.add("mobile_open");
    mobile_overlay.classList.add("show");

    resetMobileFooterActive();
    mobile_favs_tab.classList.add("active");
  });
  
};