async function handleSubmit(event) {
  event.preventDefault();

  const inputText = document.getElementById("name").value;

  if (!inputText) {
    alert("Please enter some text!");
    return;
  }

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: inputText }),
    });

    const result = await response.json();

    if (result.error) {
      alert("Error: " + result.error);
    } else {
      // Update the DOM with the result
      document.getElementById("results").innerHTML = `
          <p><strong>Category:</strong> ${result.category}</p>
          <p><strong>Confidence:</strong> ${result.confidence}</p>
          <p><strong>Text:</strong> ${result.text}</p>
        `;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while analyzing the text.");
  }
}
