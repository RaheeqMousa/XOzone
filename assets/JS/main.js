/*..............................Action for the clicked Mode button..................................*/

document.querySelectorAll(".ModeBtn").forEach(btn => {
    btn.addEventListener('click', (event) => {
        const mode = event.currentTarget.id; // ensures we get the button's ID
        const options = document.querySelector(".modal .options");

        let html = `
            <label for='BoardSize'>Choose board size</label>
            <select id='BoardSize'>`;

        for (let i = 3; i <= 10; i++) {
            html += `<option value='${i}'>${i}</option>`;
        }

        html += `</select>
        <button onclick="setBoardSize('${mode}')" class='button'>Choose size</button>`;

        options.innerHTML = html;

        const modal = document.querySelector(".modal");
        modal.classList.remove("DisplayNone");
    });
});

/*.................................Close Action for the button....................................*/


document.querySelector('.CloseButtonWrapper button').addEventListener("click", () => {
    document.querySelector(".modal").classList.add("DisplayNone");
});


/*................................Action After choosing the size..................................*/
function setBoardSize(choice) {

    const modal = document.querySelector(".modal");
    modal.classList.add("DisplayNone");

    const boardSize = document.querySelector("#BoardSize").value;
    sessionStorage.setItem("boardSize", boardSize);
    sessionStorage.setItem("choice", choice);
    window.open(`${choice}.html`, "_self");
}


