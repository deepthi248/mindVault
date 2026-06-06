
export const analyseNote = async (note) => {
  try {
    const content = note.content;
    const url = "https://mindvault-icca.onrender.com/api/analyse_text";
    const body = JSON.stringify({ content });
    const header = {
      "Content-Type": "application/json",
    };
    console.log("IO am inisde analyse note fronty end ");
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: body,
    });

    const data = await response.json();
    console.log(data);
    if (data) {
      return { data: data, status: "success" };
    }
  } catch {
    console.log("problem connectiung backend");
    return { data: null, status: "failed" };
  }
};


